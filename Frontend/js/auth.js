const user = localStorage.getItem("user");

if (!user) {
    window.location.href = "login.html";
}

const mytoken = localStorage.getItem("token");
if (mytoken) {
    // check if mytoken is expired
    const exp = parseJwt(mytoken).exp;
    if (exp) {
        // check if token is expired
        const now = new Date().getTime() / 1000;
        if (now > exp) {
            logout(true);
        }
        // set time to logout
        const timeToLogout = exp - now;
        console.log("Time to logout: " + timeToLogout);
        setTimeout(() => { logout(true) }, timeToLogout * 1000);
    } else {
        logout(true);
    }
} else {
    // no token, so logout
    window.location.href = "login.html";
}

// -- On Startup --
window.addEventListener('DOMContentLoaded', async function() {
    console.log("auth.js loaded")
        // Logout Button
    const logoutButton = document.querySelector("#logout-btn");
    if (logoutButton) {
        logoutButton.addEventListener('click', () => { logout(false) });
    }
});

function logout(expired = false) {
    console.log("logout");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (!expired) {
        window.location.href = "login.html";
    } else {
        window.location.href = "login.html?expired=true";
    }
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}