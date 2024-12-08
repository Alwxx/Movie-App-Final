const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true }, // TMDB Movie ID
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 0, max: 10 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
