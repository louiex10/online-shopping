// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('registered')) {
        createAlert('Your account was created successfully. Please log in.', 'success');
    }
    // login Button
    const loginButton = document.querySelector("#login-btn");
    loginButton.addEventListener('click', async(evt) => {
        evt.preventDefault();
        // disable button from event listener
        loginButton.disabled = true;
        await login(loginButton);
    });
});

async function login(loginButton) {
    const username = document.querySelector("#login-email").value;
    const password = document.querySelector("#login-password").value;

    if (!username || !password) {
        const form = document.querySelector("#login-form");
        form.classList.add('was-validated');
        loginButton.disabled = false;
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
        createAlert("You entered invalid credentials. Please try again with different username or password.");
        loginButton.disabled = false;
        throw new Error('Invalid credentials');
    }
}

// Let user know they can't submit cart when it is empty
function createAlert(msg, type = "danger") {
    const hasAlert = document.querySelector("#dupe-user");
    if (hasAlert) {
        return
    }
    const parentDiv = document.querySelector("#alert-space");
    const alert = document.createElement("div");
    alert.id = "dupe-user"
    const alertClasses = ["alert", `alert-${type}`, "alert-dismissable", "fade", "show", "mt-1"];
    alert.classList.add(...alertClasses);
    alert.role = "alert";
    alert.innerHTML = `
        ${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    parentDiv.appendChild(alert);
}