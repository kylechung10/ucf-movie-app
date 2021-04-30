import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./FavoriteMovies.css";

export default function FavoriteMovies(props) {
  const { username } = props;

  // Current favorites of the user
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // Grab user data on load of the component, only run once and store it to the useState array
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

  // Remove movie from account favorites
  const removeMovie = (movieId) => {
    Axios.patch("http://localhost:45030/account/" + username, {
      remove: movieId,
    }).then(() => {
      // When a movie is removed from the database, remove from displayed array
      setFavoriteMovies(
        favoriteMovies.filter((movie) => {
          return movie._id !== movieId;
        })
      );
    });
  };

  return (
    <div className="favorite-page">
      <h1>Your Favorite Movies</h1>
      {favoriteMovies.length !== 0 ? (
        <div className="movie-results">
          {favoriteMovies.map((movie, key) => {
            return (
              <div key={key} className="movie-panel">
                <div className="img-container">
                  <img src={movie.poster} alt="Poster" />
                </div>
                <p>
                  <strong>Title:</strong> {movie.title}
                </p>
                <p>
                  <strong>Director:</strong> {movie.directors[0]}
                </p>
                <p>
                  <strong>Rated:</strong> {movie.rated}
                </p>
                <button onClick={() => removeMovie(movie._id)}>Remove</button>
              </div>
            );
          })}
        </div>
      ) : (
        <h2>You don't have any favorite movies saved</h2>
      )}
    </div>
  );
}
