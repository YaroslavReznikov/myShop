import React, { useState, useEffect } from "react";
import './mainStyle.css';
import LogIn from "./logIn";

function MainPage() {
    const [searchValue, setSearchValue] = useState("");
    const [username, setUsername] = useState("");
    const [showLogIn, setShowLogIn] = useState(false);

    useEffect(() => {
        getDatabase(searchValue);
        let savedUsername = getCookie('username');
        setUsername(savedUsername);
    }, [searchValue]);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            search(searchValue);
        }
    };

    const search = (value) => {
        console.log(value);
    };

    const logOut = () => {
        const result = window.confirm("Are you sure you want to log out?");
        if (result) {
            setShowLogIn(true);
        } else {
            console.log("User chose not to logout.");
        }
    };

    const getDatabase = (search = "") => {
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
    };

    const getCookie = (name) => {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return decodeURIComponent(parts.pop().split(";").shift());
    };

    if (showLogIn) {
        return <LogIn />;
    }

    return (
        <div className="MainWrapper">
            <div className="searchBar">
                <input 
                    type="text" 
                    id="search-bar" 
                    placeholder="search bar"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    onKeyDown={handleKeyDown} 
                />
            </div>
            <div className="userDatacon">
                <div className="user-data">
                    <label>{username}</label>
                </div>
                <div className="userbtn">
                    <button className="btn" onClick={logOut}>Log out</button>
                </div>
            </div>
            <div className="user-seen-part">
                <div className="goods-field">
                    <label>There should be data</label>
                </div>
            </div>
        </div>
    );
}

export default MainPage;