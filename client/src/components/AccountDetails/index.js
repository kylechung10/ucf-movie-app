import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./AccountDetails.css";

export default function Account(props) {
  const { username } = props;

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [verifyDelete, setVerifyDelete] = useState("");
  const [accountDeletedReponse, setAccountDeletedResponse] = useState("");

  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // Grab the user data from the database when account details is opened
  // useEffect so Axios runs only once
  useEffect(() => {
    const grabData = () => {
      Axios.get("http://localhost:45030/account/" + username).then(
        (response) => {
          setFavoriteMovies(response.data.favorite_movies);
        }
      );
    };
    grabData();
  }, [username]);

  // Delete account from personal portfolio2 database based on input
  // CASE SENSITIVE
  const removeAccount = () => {
    Axios.delete("http://localhost:45030/account/" + verifyDelete)
      .then((reponse) => {
        setAccountDeletedResponse(reponse.data.deleted);
        setDeleteConfirm(true);
      })
      .catch((error) => {
        alert("Enter username to verify, (Case sensitive)");
        setVerifyDelete("");
        console.log(error);
      });
  };

  // Refresh the page and return home to reset page after deleting account
  const refreshPage = () => {
    window.location.reload(false);
  };

  return (
    <div className="account-page">
      <h1>Account Details</h1>
      <p>Welcome, {username}!</p>
      <p>Number of favorite movies: {favoriteMovies.length}</p>
      <div className="delete-box">
        <label htmlFor="deleteInput">Verify Username</label>
        {/* Require the user to verify their account username before deleting */}
        <input
          value={verifyDelete}
          className="deleteInput"
          type="text"
          placeholder="Username"
          onChange={(e) => setVerifyDelete(e.target.value)}
        />
        <button onClick={() => removeAccount()}>Delete Account</button>
      </div>
      {/* If the delete function has been run, check the values */}
      {deleteConfirm ? (
        // If the returned value from the delete function matches input, force the user to reload the page
        verifyDelete === accountDeletedReponse ? (
          <div className="refresh-page">
            <p>Successful delete</p>
            <button onClick={() => refreshPage()} className="refresh-button">
              Return to Home
            </button>
          </div>
        ) : undefined
      ) : undefined}
    </div>
  );
}
