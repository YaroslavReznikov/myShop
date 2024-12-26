
import React from "react";
import LogIn from './logIn.jsx';
import SignUp from "./signUp.jsx";
import MainPage from "./main.jsx";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  return (
    <Router>
      <div className="App">
        <div className="content">
          <Routes>
            <Route path="/" element = {<LogIn/>}> </Route>
            <Route path="/sign_up_page" element = {<SignUp/>}> </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;