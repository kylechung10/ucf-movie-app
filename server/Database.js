import MongoClient from "mongodb";

// Deleted inactive mongoDB connection

export default class Database {
  constructor() {
    // Setup a default value for connection
    this.connection = null;
    // Setup a default value for database
    this.database = null;
    // Setup a default value for collection
    this.collection = null;
    //URL using our login
  }

  async connect(data, collect) {
    // Wait for the connect() method to finish.
    this.connection = await MongoClient.connect(url, {
      useUnifiedTopology: true,
    });
    // Select the database
    this.database = this.connection.db(data);
    // Select the collection
    this.collection = this.database.collection(collect);
  }

  // readMany() Search for multiple movies within the movie database
  async readMany(title) {
    if (this.collection != null) {
      let movieArray = [];
      let searchMovies = this.collection.find({
        title: {
          // Use regex to provide boundaries
          $regex: `\\b${title}\\b`,
          // Case insensitive
          $options: "i",
        },
      });
      // Create array based on results
      await searchMovies
        // Limit results shown
        .limit(16)
        // Sort the results by IMBD rating
        .sort({ "imbd.rating": 1 })
        // Create array from results
        .forEach((doc) => {
          movieArray.push(doc);
        });
      return movieArray;
    }
  }

  // readOne() Search for users based on "username"
  async readOne(user) {
    if (this.collection != null) {
      let userReturn = null;
      let results = await this.collection.findOne({
        // Search the database for username that is NOT case sensitive
        username: { $regex: user, $options: "i" },
      });
      if (results != null) {
        userReturn = results;
      }
      return userReturn;
    }
  }

  // createOne() Create a new account in personal database
  async createOne(createAccount) {
    if (this.collection != null) {
      let newAccount = {
        username: createAccount,
        favorite_movies: [],
      };
      // Insert new account into database
      await this.collection.insertOne(newAccount);
      // Reponse with username
      return newAccount;
    }
  }

  // updateOne() Add new or remove favorite movie in the personal user account
  async updateOne(user, favMovie, removeMovie) {
    if (this.collection != null) {
      let completeUpdate = { favorite: "Failed" };
      // Check if the favorite movie field is defined, if it is add the movie
      if (favMovie !== undefined) {
        let updateMovie = await this.collection.updateOne(
          // Find user account based on input
          { username: user },
          // Push the new movie to the existing array
          { $push: { favorite_movies: favMovie } }
        );
        // If update completed return with the added movie
        if (updateMovie.modifiedCount > 0) {
          completeUpdate = { favorite: favMovie };
        }
      }
      // Check if the remove movie field is undefined, if it is remove the movie
      if (removeMovie !== undefined) {
        let updateMovie = await this.collection.updateOne(
          // Find user account based on input
          { username: user },
          // Pull the movie from the existing array based on id
          { $pull: { favorite_movies: { _id: removeMovie } } },
          false,
          true
        );
        // If update completed return with the removed movie
        if (updateMovie.modifiedCount > 0) {
          completeUpdate = { removed: removeMovie };
        }
      }
      return completeUpdate;
    }
  }

  // deleteOne() Delete account from personal database
  async deleteOne(accountDelete) {
    if (this.collection != null) {
      let deleteMessage = null;
      let resultsDelete = await this.collection.deleteOne({
        username: accountDelete,
      });
      // Check if an account was deleted
      if (resultsDelete.deletedCount > 0) {
        // If the deletion was complete, show the deleted account username
        deleteMessage = { deleted: accountDelete };
      }
      return deleteMessage;
    }
  }

  close() {
    if (this.connection != null) {
      this.connection.close();
    }
  }
}
