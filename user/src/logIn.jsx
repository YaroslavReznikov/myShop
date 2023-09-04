import React, { useState, useRef } from "react";
import './loginInStyle.css';
import SignUp from "./signUp";

function LogIn() {
    const emailRef = useRef();
    const passwordRef = useRef();

    const loginUser = () => {
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        fetch('/login', {
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

    const [showSignUp, setShowSignUp] = useState(false);

    if (showSignUp) {
        return <SignUp />;
    }

    return (
        <div className="Wrapper">
            <form>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="email" placeholder="email" ref={emailRef} required />
                </div>
                <div className="input-box">
                    <input type="password" placeholder="Password" ref={passwordRef} required />
                </div>
                <div className="remember-forgot">
                    <label>
                        <input type="checkbox" /> Remember me
                    </label>
                    <span>Forgot password</span> {/* Changed from <a> to <span> */}
                </div>
                <button
                    type="button"
                    className="btn"
                    onClick={loginUser} // Simplified this since email and password are now using useRef
                >
                    Login
                </button>
                <div className="register-link">
                    <p>
                        Don't have an account? 
                        <button onClick={() => setShowSignUp(true)}>Register</button>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default LogIn;