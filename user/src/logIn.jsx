import React, { useEffect, useRef, useState } from "react";
import './loginInStyle.css';
import IMAGES from "./Pictures";
import MainPage from "./main";
import { Link } from "react-router-dom";

function LogIn() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [showMainPage, setShowMainPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Ensure the checkbox state is boolean and not null/undefined
    const initialRememberState = localStorage.getItem("remember") === "true"; 
    const [checkbox, setCheckBox] = useState(initialRememberState);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!localStorage.getItem("remember")) {
            localStorage.setItem("remember", false);
        }
        fetch('/loginWithToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
        }).then(response => response.json())
        .then(data => {
            console.log(data.message);
            if (data.success){
                setShowMainPage(true);
            }
        })
    }, []);

    const loginUser = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const rememberMe = checkbox;

        setLoading(true);
        setError("");

        fetch('/loginWithoutToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, rememberMe })
        })
        .then(response => response.json())
        .then(data => {
            setLoading(false);
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                setShowMainPage(true);
            } else {
                setError(data.message);
                alert(data.message);
            }
        })
        .catch((error) => {
            setLoading(false);
            setError("An error occurred. Please try again.");
            console.error("Error:", error);
        });
    }

    const cookiesHandle = () => {
        const newRemember = !checkbox;
        localStorage.setItem("remember", newRemember.toString()); // Store it as a string
        setCheckBox(newRemember);
    }

    return showMainPage ? (
        <MainPage />
    ) : (
        <div className="logInWrapper" style={{ backgroundSize: "cover", backgroundImage: `url(${IMAGES.logInPicture})` }}>
            <div className="Wrapper">
                <form>
                    <h1>Login</h1>
                    {error && <p className="error-message">{error}</p>}
                    <div className="input-box">
                        <input type="email" placeholder="Email" ref={emailRef} aria-label="Email" required />
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" ref={passwordRef} aria-label="Password" required />
                    </div>
                    <div className="remember-forgot">
                        <label>
                            <input 
                                type="checkbox" 
                                onChange={cookiesHandle} 
                                checked={checkbox || false} // Ensure checked is a boolean value
                            /> Remember me
                        </label>
                        <span role="button" tabIndex="0">Forgot password?</span>
                    </div>
                    <button
                        type="button"
                        className="btn"
                        onClick={loginUser}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <div className="register-link">
                        <p>
                            Don't have an account? 
                            <Link to='/sign_up_page'>Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LogIn;