import React, { useEffect, useState } from "react";
import './signUpStyle.css';  // Assuming the CSS is in the same directory
function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const signUpUser = () => {
      if (password !== repeatPassword) {
          alert('Passwords do not match!');
          return;
      }
  };

  return (
      <div className="Wrapper">
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
  );
}
export default SignUp;
