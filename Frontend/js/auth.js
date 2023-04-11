const user = localStorage.getItem("user");

if (!user) {
    window.location.href = "login.html";
}

// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {
    console.log("auth.js loaded")
        // Logout Button
    const logoutButton = document.querySelector("#logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}