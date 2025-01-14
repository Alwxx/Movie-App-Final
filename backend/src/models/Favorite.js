const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie", // Reference to a locally stored movie object
      required: false, // Optional if using TMDB movie ID instead
    },
    tmdbMovieId: {
      type: String, // TMDB movie ID as a string
      required: false, // Optional if using local movie reference
    },
  },
  { timestamps: true }
);

// Ensure either "movie" or "tmdbMovieId" is provided
favoriteSchema.path("movie").validate(function (value) {
  if (!value && !this.tmdbMovieId) {
    throw new Error("Either 'movie' or 'tmdbMovieId' must be provided.");
  }
  return true;
});

module.exports = mongoose.model("Favorite", favoriteSchema);
