const form = document.getElementById('register');


form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const elements = form.elements;
    const email = elements['email'].value
    const password = elements['password'].value
    console.log(email);
    console.log(password);

    const register = await fetch("https://valenciacollege.store/register", {
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
    const response = await register.json();
    console.log(response);
    window.location.href = "login.html";


});