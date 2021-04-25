import React, { useState } from "react";
import Axios from "axios";
import "./FavoriteMovies.css";

export default function FavoriteMovies(props) {
  const { username } = props;

  // Current favorites of the user
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  // Run favorite search once
  const [runFavorite, setRunFavorite] = useState(false);

  // If the current favorites array is 0 and the user is logged in get the stored user favorites
  if (favoriteMovies.length === 0 && runFavorite === false) {
    Axios.get("http://localhost:45030/account/" + username).then((response) => {
      setFavoriteMovies(response.data.favorite_movies);
      setRunFavorite(true);
    });
  }

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
      <h1>Favorite Movies</h1>
      <div className="movie-results">
        {favoriteMovies !== 0
          ? favoriteMovies.map((movie, key) => {
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
                  <button onClick={() => removeMovie(movie._id)}>Delete</button>
                </div>
              );
            })
          : undefined}
      </div>
    </div>
  );
}
