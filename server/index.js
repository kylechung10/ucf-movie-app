import Database from "./Database.js";

import Express from "express";
import CORS from "cors";

const App = Express();
const port = 45030;

App.use(Express.json());
App.use(CORS());

// Connect to the movie database
const movieDB = new Database();
movieDB.connect("sample_mflix", "movies");

// Connect to my personal database in portfolio 2
const personalDB = new Database();
personalDB.connect("portfolio2", "KyleChung");

// GET ROUTE: Search for movie in the movie database
App.get("/movies/:title", async (req, res) => {
  let movieSearch = req.params.title;
  // Search the movie database
  const response = await movieDB.readMany(movieSearch);
  res.json(response);
});

// GET ROUTE: Search personal database for user account
App.get("/account/:user", async (req, res) => {
  let userSearch = req.params.user;
  // Search the personal database
  const response = await personalDB.readOne(userSearch);
  res.json(response);
});

// PUT ROUTE: Create new account on personal database
App.put("/account/:create", async (req, res) => {
  let createAccount = req.params.create;
  const response = await personalDB.createOne(createAccount);
  res.json(response);
});

// PATCH ROUTE: Add/Remove a favorite movie to an existing users account
App.patch("/account/:user", async (req, res) => {
  let username = req.params.user;
  let favoriteMovie = req.body.movie;
  let removeMovie = req.body.remove;
  const response = await personalDB.updateOne(
    username,
    favoriteMovie,
    removeMovie
  );
  res.json(response);
});

// DELETE ROUTE: Delete user account from personal database
App.delete("/account/:user", async (req, res) => {
  let accountDelete = req.params.user;
  const response = await personalDB.deleteOne(accountDelete);
  res.json(response);
});

//Listen port
App.listen(port, () => {
  console.log("Server is active");
});
