const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: String, required: true }, // TMDB Movie ID
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, // For replies
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
