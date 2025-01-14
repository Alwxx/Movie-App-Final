const mongoose = require("mongoose");
const Comment = require("./Comment");
const Rating = require("./Rating");
const Favorite = require("./Favorite");

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  overview: {
    type: String, // Matches the "overview" used on the frontend
    required: true,
  },
  release_date: {
    type: Date, // Matches the "release_date" used on the frontend
    required: true,
  },
  genres: [
    {
      id: { type: Number, required: true }, // TMDB genre ID for mapping
      name: { type: String, required: true }, // TMDB genre name
    },
  ],
  poster_path: {
    type: String, // Path to the poster image used in the frontend
    required: true,
  },
  vote_average: {
    type: Number, // For "TMDB Rating" on the frontend
    required: false,
    default: 0,
  },
});

MovieSchema.pre("remove", async function (next) {
  try {
    await Favorite.deleteMany({ movie: this._id });
    await Comment.deleteMany({ movie: this._id });
    await Rating.deleteMany({ movie: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = Movie;
