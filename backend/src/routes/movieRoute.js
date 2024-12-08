const express = require("express");
const {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
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

movieRouter.post("/", userAuth, admin, createMovie);
movieRouter.put("/update/:id", userAuth, admin, updateMovie);
movieRouter.delete("/delete/:id", userAuth, admin, deleteMovie);
movieRouter.post("/movies", upload.single("poster"), createMovie);

// Favorites routes
movieRouter.post("/favorites", userAuth, updateFavorite); // Add to favorites
movieRouter.get("/favorites", userAuth, getFavorites); // Get user's favorites

movieRouter.post("/share", userAuth, shareWishlist);

// Movie Page:
movieRouter.get("/:id", userAuth, getMovieDetails);
movieRouter.post("/:id/comments", userAuth, addComment); // Add a comment
movieRouter.post("/:id/rate", userAuth, rateMovie); // Rate a movie

module.exports = { movieRouter };
