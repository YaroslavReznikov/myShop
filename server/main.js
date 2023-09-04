document.addEventListener('DOMContentLoaded', function() {
    
    function search(searchValue) {
        console.log(searchValue);
    }

    document.getElementById("search-bar").addEventListener("keydown", function(event) {
        if (event.keyCode === 13) { 
            search(document.getElementById('search-bar').value);
            console.log("enter was pressed");
        }
    });

    function logOut() {
        var result = confirm("Are you sure you want to log out?");
        if (result) {
            console.log("Logging out...");
            const cookies = document.cookie.split(";");

            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
            window.location.href = "logInPage.html";
        } else {
            console.log("User chose not to logout.");
        }
    }

    window.logOut = logOut;

    function getDatabase(search = "") {
        const url = `http://localhost:3000/getDatabase?search=${encodeURIComponent(search)}`;
        
        fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    getDatabase(document.getElementById("search-bar").value);

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return decodeURIComponent(parts.pop().split(";").shift());
    }

    var username = getCookie('username');
    document.getElementById("username").innerText = username;
});