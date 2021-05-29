import React, { useState } from "react";
import Axios from "axios";
import "./Search.css";

export default function SearchMovies(props) {
  // If user is logged in, set variable
  const { username } = props;
  // Movie results
  const [movieResults, setMovieResults] = useState([]);
  // User input for search
  const [inputMovie, setInputMovie] = useState("");
  // If the search has been ran
  const [ranSearch, setRanSearch] = useState(false);
  // Current favorites of the user
  const [currentFavorites, setCurrentFavorites] = useState([]);
  // Run search for favorites in user account once to avoid looping if user has no favorites
  const [ranFavorites, setRanFavorites] = useState(false);

  // If the current favorites array is 0 and the user is logged in get the stored user favorites
  if (
    currentFavorites.length === 0 &&
    username !== "" &&
    ranFavorites === false
  ) {
    Axios.get(`api/account/${username}`).then((response) => {
      // Only add titles to the array
      setCurrentFavorites(
        response.data.favorite_movies.map((movie) => movie._id)
      );
      setRanFavorites(true);
    });
  }

  // Search the movie database based on the user input
  const searchMovies = () => {
    Axios.get(`api/movies/${inputMovie}`).then((response) => {
      setMovieResults(response.data);
      setRanSearch(true);
    });
  };

  // Add movie from search
  const addMovie = (movieTitle) => {
    Axios.patch(`api/account/${username}`, {
      movie: movieTitle,
    }).then((response) => {
      // When a movie is added to the database, push it to the current favorites array
      setCurrentFavorites([...currentFavorites, response.data.favorite._id]);
    });
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search for Movies</h1>
        {username === "" ? (
          <>
            <p>
              You are not currently signed in. <br />
              You can still search for movies, but will not be able to save them
              to your favorites.
            </p>
          </>
        ) : (
          <>
            <h2>Welcome, {username}</h2>
            <p>Search for movies and add them directly to your favorites!</p>
          </>
        )}
        <div className="search-bar">
          <input
            onChange={(e) => setInputMovie(e.target.value)}
            value={inputMovie}
            placeholder="Type to search..."
          ></input>
          <button onClick={() => searchMovies()}>Search</button>
        </div>
      </div>
      <div className="movie-results">
        {ranSearch
          ? // Display the movies from the search
            movieResults.map((movie, key) => {
              return (
                <div key={key} className="movie-panel">
                  <div className="img-container">
                    <img src={movie.poster} alt="Poster" />
                  </div>
                  <div>
                    <p>
                      <strong>Title:</strong> {movie.title}
                    </p>
                    <p>
                      <strong>Director:</strong> {movie.directors[0]}
                    </p>
                    <p>
                      <strong>Rated:</strong> {movie.rated}
                    </p>
                  </div>
                  {/* Only display the add button if the user is logged in */}
                  {username === "" ? undefined : (
                    <button
                      onClick={() => addMovie(movie)}
                      // Disable the button if the favorites include this movie to prevent adding it again
                      disabled={currentFavorites.includes(movie._id)}
                      className={
                        currentFavorites.includes(movie._id) ? "saved" : "add"
                      }
                    >
                      {/* Change the text if the user has the current movie added to their favorites */}
                      {currentFavorites.includes(movie._id)
                        ? "🗸 Saved to Favorites"
                        : "+ Add to Favorites"}
                    </button>
                  )}
                </div>
              );
            })
          : undefined}
      </div>
      {/* If the search is ran and the array is still 0, display no results were found */}
      {ranSearch && movieResults.length === 0 ? (
        <h2 className="no-results">No Results Found!</h2>
      ) : undefined}
    </div>
  );
}
