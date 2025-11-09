// Simple enhancements: sidebar toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("sidebarToggle");
  const logout = document.getElementById("logout-link");
 


  // Sidebar collapse/expand
  toggle?.addEventListener("click", () => {
    const collapsed = document.body.classList.toggle("collapsed");
    toggle.setAttribute("aria-expanded", String(!collapsed));
  });

  // Clear stored email on logout
  logout?.addEventListener("click", () => {
    try { localStorage.removeItem('currentEmail'); } catch {}
  });
});

