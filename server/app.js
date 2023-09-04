function loginUser(email, password) {
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "main.html";
        } else {
            console.log(data.message);
            alert(data.message);
        }
    });
}

function signUpUser(username, email, password, passwordCopy){
    fetch('http://localhost:3000/signUp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email,password, passwordCopy })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "logInPage.html";
        } else {
            alert(data.message);
        }
    });

}
