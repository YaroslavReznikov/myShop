import React, { useEffect, useState } from "react";
import LogIn from "./logIn";
import './signUpStyle.css';
import IMAGES from "./Pictures"
function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showLogIn, setshowLogIn] = useState(false);
    const signUpUser = () => {
      if (password !== repeatPassword) {
          alert('Passwords do not match!');
          return;
      }
      fetch('/signUp', {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })

      })
      .then(response => response.json())
      .then(data => {
        if (data.success){
            setshowLogIn(true);
        }
        else {
            alert(data.message);
        }
      });
  };
  if (showLogIn){
    return <LogIn/>
  }
  return (
    <div className="generalWrapperForSignUp" style={{backgroundsize: "cover", backgroundImage:`url(${IMAGES.logInPicture})`}}>
        <div className="signUpWrapper">
            <div className="text-field">
                <h1 className="text">Sign up</h1>
            </div>
            <div className="input-box">
                    <input 
                        type="text" 
                        placeholder="username" 
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required 
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="text" 
                        placeholder="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="input-box">
                    <input 
                        type="password" 
                        placeholder="Repeat Password" 
                        value={repeatPassword}
                        onChange={e => setRepeatPassword(e.target.value)}
                        required 
                    />
                </div>
                <div className="sign-up-button">
                <button onClick={signUpUser}>
                    sign up
                </button>
            </div>
        </div>
      </div>
  );
}
export default SignUp;
