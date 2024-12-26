


document.addEventListener('DOMContentLoaded', function() {
    
    function search(searchValue) {
        console.log(searchValue);
    }

    document.getElementById("search-bar").addEventListener("keydown", function(event) {
        if (event.keyCode === 13) { 
            search(document.getElementById('search-bar').value);
        }
    });



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