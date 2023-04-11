const form = document.getElementById('login');


form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const elements = form.elements;
    const email = elements['email'].value
    const password = elements['password'].value
    console.log(email);
    console.log(password);

    const login = await fetch("https://valenciacollege.store/authenticate", {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: email,
            password: password
        })
    });
    const response = await login.json();
    localStorage.setItem("jwt", response.token);
    console.log(response.token);
    // window.location.href = "hello.html";


});

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}