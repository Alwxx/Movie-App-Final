const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie", // Reference to a locally stored movie object
      required: false,
    },
    tmdbMovieId: {
      type: String, // TMDB Movie ID as a string
      required: false,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
  },
  { timestamps: true }
);

// Ensure either "movie" or "tmdbMovieId" is provided
ratingSchema.path("movie").validate(function (value) {
  if (!value && !this.tmdbMovieId) {
    throw new Error("Either 'movie' or 'tmdbMovieId' must be provided.");
  }
  return true;
});

module.exports = mongoose.model("Rating", ratingSchema);
