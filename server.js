import Database from "./database/Database.js";
import Express from "express";
import CORS from "cors";
import Path from "path";

const App = Express();
const port = process.env.PORT || 5000;

App.use(Express.json());
App.use(CORS());

// Connect to the movie database
const movieDB = new Database();
movieDB.connect("movie-app", "movies");

// Connect to the user database
const usersDB = new Database();
usersDB.connect("movie-app", "users");

// GET ROUTE: Search for movie in the movie collection
App.get("/api/movies/:title", async (req, res) => {
  let movieSearch = req.params.title;
  // Search the movie collection
  const response = await movieDB.readMany(movieSearch);
  res.json(response);
});

// GET ROUTE: Search user collection for user account
App.get("/api/account/:user", async (req, res) => {
  let userSearch = req.params.user;
  // Search the user database
  const response = await usersDB.readOne(userSearch);
  res.json(response);
});

// PUT ROUTE: Create new account on the user collection
App.put("/api/account/:create", async (req, res) => {
  let createAccount = req.params.create;
  const response = await usersDB.createOne(createAccount);
  res.json(response);
});

// PATCH ROUTE: Add/Remove a favorite movie to an existing users account
App.patch("/api/account/:user", async (req, res) => {
  let username = req.params.user;
  let favoriteMovie = req.body.movie;
  let removeMovie = req.body.remove;
  const response = await usersDB.updateOne(
    username,
    favoriteMovie,
    removeMovie
  );
  res.json(response);
});

// DELETE ROUTE: Delete user account from user collection
App.delete("/api/account/:user", async (req, res) => {
  let accountDelete = req.params.user;
  const response = await usersDB.deleteOne(accountDelete);
  res.json(response);
});

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  const __dirname = Path.resolve();
  // Set static folder
  App.use(Express.static("client/build"));
  App.get("*", (req, res) => {
    res.sendFile(Path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//Listen port
App.listen(port, () => {
  console.log("Server is active");
});
