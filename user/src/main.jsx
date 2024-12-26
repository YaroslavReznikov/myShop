import React, { useState, useEffect } from "react";
import './mainStyle.css';
import LogIn from "./logIn";
import {getUserName } from "./GetFunctions"
function MainPage() {
    const [searchValue, setSearchValue] = useState("");
    const [username, setUsername] = useState("");
    const [showLogInPage, setShowLogInPage] = useState(false);
   
    useEffect(() => {
        getDatabase(searchValue);
        const fetchUsername = async () => {
            try {
                const name = await getUserName(); 
                setUsername(name);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };
        fetchUsername();
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
            localStorage.clear();
            setShowLogInPage(true);
            }
         else {
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
    return showLogInPage ? (<LogIn></LogIn>)
    :(
        <>
           
            <div className="globalWrapper">
                <div className="MainWrapper">
                    <div className="add-good-btn">
                        <button>
                            add manager
                        </button>
                    </div>
                    <div className="searchBar">
                        <input 
                            type="text" 
                            id="search-bar" 
                            placeholder="find worker"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            onKeyDown={handleKeyDown} 
                        />
                    </div>
                    <div className="userPersonalData">
                        <div className="user-data">
                            <label>{username}</label>
                        </div>
                        <div className="userbtn">
                            <button  className="btn" onClick={logOut}>Log out</button>
                        </div>
                    </div>
                </div>
                <div className="user-seen-part">
                    <div className="goods-field">
                        <label>Workers</label>
                    </div>
                </div>
            </div>
            
        </>
    );
}

export default MainPage;