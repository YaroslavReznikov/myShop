import React from "react";
import './mainStyle.css';
function MainPage(){

    const logOut = () => {
        // Add your logout logic here
        console.log('Logged out!');
    }

    return (
        <>
            <div className="MainWrapper">
                <div className="searchBar">
                    <input type="text" id="search-bar" placeholder="search bar" />
                </div>

                <div className="userDatacon">
                    <div className="user-data">
                        <label id="username"></label>
                    </div>
                    <div className="userbtn">
                        <button className="btn" onClick={logOut}>Log out</button>
                    </div>
                </div>
            </div>
            <div className="user-seen-part">
                <div className="goods-field">
                    <label>There should be data</label>
                </div>
            </div>
        </>
    );
}

export default MainPage;