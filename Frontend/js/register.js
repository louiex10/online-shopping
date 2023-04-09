// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {
    // Register Button
    const registerButton = document.querySelector("#register-btn");
    registerButton.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.window.location.href = "login.html";
    });

});