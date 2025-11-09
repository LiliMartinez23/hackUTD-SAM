const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Utility functions
function getUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    try {
        if (!data.trim()) return [];
        return JSON.parse(data);
    } catch {
        return [];
    }
}
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Helper: create a display name from email if missing
function defaultNameFromEmail(email) {
    try {
        const local = String(email).split('@')[0] || '';
        if (!local) return 'User';
        // Capitalize first letter, keep rest as-is
        return local.charAt(0).toUpperCase() + local.slice(1);
    } catch {
        return 'User';
    }
}

// Helper: strip sensitive fields and ensure profile fields exist
function sanitizeUser(u) {
    return {
        email: u.email,
        name: u.name ?? defaultNameFromEmail(u.email),
        bio: u.bio ?? 'No bio provided.',
        role: u.role ?? 'User',
    };
}

// GET route for register page
app.get('/register', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// POST route for registration
app.post('/register', (req, res) => {
    const { email, password, role, bio, name } = req.body;
    let users = getUsers();
    if (users.find(u => u.email === email)) {
        return res.send('Email already registered. <a href="/register">Try again</a>');
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const allowedRoles = new Set(['Admin', 'Staff']);
    const safeRole = allowedRoles.has(role) ? role : 'User';
    const safeBio = typeof bio === 'string' ? bio.trim().slice(0, 500) : '';
    const safeName = (typeof name === 'string' && name.trim())
        ? name.trim().slice(0, 80)
        : defaultNameFromEmail(email);

    users.push({ email, password: hashedPassword, role: safeRole, bio: safeBio, name: safeName });
    saveUsers(users);
    res.send('Registration successful! <a href="/">Go to Login</a>');
});

// Static asset routes for root-level files
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'styles.css'));
});
app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});
app.get('/images.jpg', (req, res) => {
    res.sendFile(path.join(__dirname, 'images.jpg'));
});

// POST route for login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).send('Invalid email or password. <a href="/">Try again</a>');
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (passwordMatch) {
        return res.redirect('/data.html');
    }
    return res.status(401).send('Invalid email or password. <a href="/">Try again</a>');
});

// Public API: return sanitized user profiles (no passwords)
app.get('/api/users', (req, res) => {
    const profiles = getUsers().map(sanitizeUser);
    const { email } = req.query;
    if (email) {
        const match = profiles.find(u => u.email === email);
        if (!match) return res.status(404).json({ error: 'User not found' });
        return res.json(match);
    }
    res.json(profiles);
});

// Public API: get a single user by email
app.get('/api/users/:email', (req, res) => {
    const email = decodeURIComponent(req.params.email || '');
    const profiles = getUsers().map(sanitizeUser);
    const match = profiles.find(u => u.email === email);
    if (!match) return res.status(404).json({ error: 'User not found' });
    res.json(match);
});

// GET route for login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const PORT = 3000;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static('public'));

// app.post('/register', (req, res) => {
//   res.send('REGISTER ROUTE REACHED!');
// });

// app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
