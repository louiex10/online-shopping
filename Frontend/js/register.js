// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {
    // Register Button
    const registerButton = document.querySelector("#register-btn");
    registerButton.addEventListener('click', async(evt) => {
        evt.preventDefault();
        await register();
        //this.window.location.href = "login.html";
    });

});

async function register() {
    const fname = document.querySelector("#register-fname").value;
    const lname = document.querySelector("#register-lname").value;
    const name = fname + " " + lname;
    const email = document.querySelector("#register-email").value;
    const password = document.querySelector("#register-password").value;

    if (!fname || !lname || !email || !password) {
        console.log("fill in input")
        const form = document.querySelector("#register-form");
        form.classList.add('was-validated');
        return;
    }

    if (email && !validEmail(email)) {
        const form = document.querySelector("#register-form");
        form.classList.add('was-validated');
        return;
    }

    const response = await fetch('https://valenciashopping.store/api/register', {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify({ name, email, password })
    });
    console.log(response.status);
    if (response.status === 200) {
        this.window.location.href = "login.html?registered=true";
    } else {
        createAlert();
        //console.log("username already exists");
    }
}

function validEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Let user know they can't submit cart when it is empty
function createAlert() {
    const hasAlert = document.querySelector("#dupe-user");
    if (hasAlert) {
        return
    }
    const parentDiv = document.querySelector("#alert-space");
    const alert = document.createElement("div");
    alert.id = "dupe-user"
    const alertClasses = ["alert", "alert-danger", "alert-dismissable", "fade", "show", "mt-1"];
    alert.classList.add(...alertClasses);
    alert.role = "alert";
    alert.innerHTML = `
        An account is already registered with this email address. Please use a different email address.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    parentDiv.appendChild(alert);
}