// Simple enhancements: sidebar toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("sidebarToggle");
 


  // Sidebar collapse/expand
  toggle?.addEventListener("click", () => {
    const collapsed = document.body.classList.toggle("collapsed");
    toggle.setAttribute("aria-expanded", String(!collapsed));
  });
});

