// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {
    // login Button
    const loginButton = document.querySelector("#return-btn");
    loginButton.addEventListener('click', (evt) => {
        evt.preventDefault();
        this.window.location.href = "index.html";
    });
});