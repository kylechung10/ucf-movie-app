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

  return (
    <>
      {/* If the delete function has been run, check the values */}
      {deleteConfirm ? (
        // If the returned value from the delete function matches input, force the user to logout and return home
        verifyDelete === accountDeletedReponse ? (
          <div className="refresh-page">
            <div>
              <h1>Successfully Deleted Account:</h1>
              <h2>{accountDeletedReponse}</h2>
              <button onClick={props.logout} className="refresh-button">
                Return to Home
              </button>
            </div>
          </div>
        ) : undefined
      ) : (
        <div className="account-page">
          <div className="account-container">
            <div className="account-details">
              <h1>Account Details</h1>
              <div>
                <h2>Welcome, {username}!</h2>
                <p>
                  Number of favorite movies:
                  <strong> {favoriteMovies.length}</strong>
                </p>
              </div>
            </div>
            <div className="delete-box">
              <h2>Delete Account</h2>
              <label>Verify Username:</label>
              {/* Require the user to verify their account username before deleting */}
              <input
                value={verifyDelete}
                className="deleteInput"
                type="text"
                placeholder="Username"
                onChange={(e) => setVerifyDelete(e.target.value)}
              />
              <button onClick={() => removeAccount()}>DELETE ACCOUNT</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
