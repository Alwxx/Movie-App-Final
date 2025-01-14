const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
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
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    }, // For replies
  },
  { timestamps: true }
);

// Ensure either "movie" or "tmdbMovieId" is provided
commentSchema.path("movie").validate(function (value) {
  if (!value && !this.tmdbMovieId) {
    throw new Error("Either 'movie' or 'tmdbMovieId' must be provided.");
  }
  return true;
});

module.exports = mongoose.model("Comment", commentSchema);
