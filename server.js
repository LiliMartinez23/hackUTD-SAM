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

// GET route for register page
app.get('/register', (req, res) => {
   res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// GET route for register page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// POST route for login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = getUsers();
    const user = users.find(u => u.email === email);
    if (!user) return res.send('Invalid email or password. <a href="/">Try again</a>');
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (passwordMatch) {
        res.send(`Login successful. Welcome, ${email}!`);
    } else {
        res.send('Invalid email or password. <a href="/">Try again</a>');
    }
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