const express = require("express");
const {
  getMovies,
  updateFavorite,
  getFavorites,
  shareWishlist,
  getMovieDetails,
  addComment,
  rateMovie,
} = require("../controllers/movieController");
const { userAuth, admin } = require("../middlewares/authMiddleware");
const movieRouter = express.Router();
const upload = require("../middlewares/multer");

// Movies routes
movieRouter.get("/", getMovies);

// Favorites routes
movieRouter.post("/favorites", userAuth, updateFavorite); // Add to favorites
movieRouter.get("/favorites", userAuth, getFavorites); // Get user's favorites

movieRouter.post("/share", userAuth, shareWishlist);

// Movie Page:
movieRouter.get("/:id", userAuth, getMovieDetails);
movieRouter.post("/:id/comments", userAuth, addComment); // Add a comment
movieRouter.post("/:id/rate", userAuth, rateMovie); // Rate a movie

module.exports = { movieRouter };
