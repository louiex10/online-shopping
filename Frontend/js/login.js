// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {
    // login Button
    const loginButton = document.querySelector("#login-btn");
    loginButton.addEventListener('click', async(evt) => {
        evt.preventDefault();
        await login();
    });
});

async function login() {
    const username = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;

    if (!username || !password) {
        console.log("fill in input")
        return;
    }

    const response = await fetch('https://valenciashopping.store/api/token', {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({ username, password })
    });
    console.log(response.status);
    if (response.status === 200) {
        const token = await response.text();
        localStorage.setItem('user', username);
        localStorage.setItem('token', token);
        this.user = username;
        this.token = token;
        window.location.href = "index.html";
    } else {
        throw new Error('Invalid credentials');
    }
}