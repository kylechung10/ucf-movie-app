import React, { useState } from "react";
import Axios from "axios";
import Displays from "../Displays";
import "./Home.css";

export default function Home() {
  // Store user input for logging in or creating account
  const [inputUser, setInputUser] = useState("");
  // To log the user in
  const [username, setUsername] = useState("");
  // To select the page being viewed and displays home as default
  const [switchComponent, setSwitchComponent] = useState("home");
  // Switch which form is active
  const [loginSwitch, setLoginSwitch] = useState(true);

  // Create a new account
  const createAccount = () => {
    Axios.put("http://localhost:45030/account/" + inputUser)
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((error) => {
        alert("Fill out the field!");
        console.log(error);
      });
  };

  // Logs the user in
  const loginUser = () => {
    Axios.get("http://localhost:45030/account/" + inputUser)
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((error) => {
        alert("Enter a valid username!");
        setInputUser("");
        console.log(error);
      });
  };

  // Logs the user out
  const logOut = () => {
    setUsername("");
    setInputUser("");
    // Displays home page after logging out
    setSwitchComponent("home");
  };

  return (
    <>
      <nav>
        <ul>
          <li>
            <button onClick={() => setSwitchComponent("home")} className="logo">
              Movie Finder
            </button>
          </li>
          <li>
            <button onClick={() => setSwitchComponent("home")}>Home</button>
          </li>
          <li>
            <button onClick={() => setSwitchComponent("search")}>Search</button>
          </li>
          {username ? (
            // Display these menu items only if the user is logged in
            <>
              <li>
                <button onClick={() => setSwitchComponent("favorite")}>
                  Favorites
                </button>
              </li>
              <li>
                <button onClick={() => setSwitchComponent("account")}>
                  Account
                </button>
              </li>
              <li>
                <button className="red-btn" onClick={() => logOut()}>
                  Log Out
                </button>
              </li>
            </>
          ) : undefined}
        </ul>
      </nav>
      <Displays display={switchComponent} userLogin={username} />
      {switchComponent === "home" ? (
        <div className="home">
          <div className="welcome">
            <h1>Movie Finder</h1>
            <p className="greeting">
              Welcome {username ? <strong>{username} </strong> : undefined}to
              Movie Finder!
            </p>
            <p>
              Search for movies from the database of over 23,000 movies! If you
              create an account you will gain the ability to save your favorite
              movies to your personal account.
              <br />
              <strong>
                {username
                  ? "Head to the Search tab to begin!"
                  : "Register or Sign In to begin!"}
              </strong>
            </p>
          </div>
          {username ? undefined : (
            // If the user is signed in, hide the sign in/create account fields
            <div className="signup">
              <h2>{loginSwitch ? "Login" : "Create Account"}</h2>
              <div className="input-field">
                <label>Username</label>
                <input
                  onChange={(e) => setInputUser(e.target.value)}
                  value={inputUser}
                  placeholder="Enter Username"
                ></input>
              </div>
              {loginSwitch ? undefined : (
                // Email is displayed if account creation is selected
                // Email is not stored in the database
                <div className="input-field">
                  <label>Email</label>
                  <input type="text" placeholder="Enter Email"></input>
                </div>
              )}
              {/* Passwords are NOT stored within the database
              Just added here for visual purposes */}
              <div className="input-field">
                <label>Password</label>
                <input type="password" placeholder="Enter Password"></input>
              </div>
              {loginSwitch ? (
                // Switch between login and create account form
                <>
                  <button onClick={() => loginUser()} className="main-btn">
                    LOGIN
                  </button>
                  <div className="form-switch">
                    <p>Don't have an account?</p>
                    <button onClick={() => setLoginSwitch(false)}>
                      Create Account
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => createAccount()} className="main-btn">
                    CREATE ACCOUNT
                  </button>
                  <div className="form-switch">
                    <p>Already have an account?</p>
                    <button onClick={() => setLoginSwitch(true)}>Login</button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : undefined}
    </>
  );
}
