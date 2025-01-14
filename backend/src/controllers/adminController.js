const Comment = require("../models/Comment");
const Movie = require("../models/Movie");
const User = require("../models/User");
const Email = require("../utils/Email");
const bcrypt = require("bcrypt");

const viewMovies = async (req, res) => {
  try {
    const movies = await Movie.find(); // Fetch all custom movies
    res.json({ success: true, data: movies });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;

    if (!username || !email || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    const defaultPassword = "password";

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(defaultPassword, salt);
    const newUser = new User({ username, email, role, password: hashedPass });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
const editMovie = async (req, res) => {
  try {
    const { id } = req.params; // Movie ID from the route parameter
    const updates = req.body; // Updates provided in the request body

    // Validate required fields
    const requiredFields = ["title", "overview", "release_date", "poster_path"];
    const missingFields = requiredFields.filter((field) => !updates[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation
    });

    if (!updatedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (error) {
    console.error("Error editing movie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to edit movie",
    });
  }
};

const createMovie = async (req, res) => {
  try {
    const { title, overview, release_date, poster_path, vote_average } =
      req.body;

    // Validate required fields
    const requiredFields = ["title", "overview", "release_date", "poster_path"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate poster_path is a valid URL
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(poster_path)) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format for poster_path.",
      });
    }

    // Create new movie
    const newMovie = new Movie({
      title,
      overview,
      release_date,
      poster_path,
      vote_average: vote_average || 0, // Optional field with default value
    });

    await newMovie.save();

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: newMovie,
    });
  } catch (error) {
    console.error("Error creating movie:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A movie with this title already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create movie",
    });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params; // Movie ID from the route parameter

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete movie",
    });
  }
};

const viewRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate("user", "username email") // Include user details
      .populate("movie", "title"); // Include local movie title if applicable

    res.json({ success: true, data: ratings });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const viewComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("user", "username email") // Include user details
      .populate("movie", "title") // Include local movie title if applicable
      .sort({ createdAt: -1 }); // Sort by latest first

    res.json({ success: true, data: comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const viewUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }) // Exclude admins
      .select("username email role"); // Include only relevant fields

    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );

    if (!updatedComment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    res.json({ success: true, data: updatedComment });
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    await Comment.findByIdAndDelete(id);

    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeRating = async (req, res) => {
  try {
    const { id } = req.params;

    await Rating.findByIdAndDelete(id);

    res.json({ success: true, message: "Rating removed successfully" });
  } catch (error) {
    console.error("Error removing rating:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const editUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (role) updates.role = role;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error editing user details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const viewCommentsWithMovies = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate({
        path: "movie",
        select: "title poster_path tmdbId",
      })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    const formattedComments = comments.map((comment) => {
      const { movie } = comment;
      return {
        ...comment.toObject(),
        movieDetails:
          comment.tmdbMovieId || comment._doc.movieId
            ? { tmdbId: comment._doc.movieId || comment.tmdbMovieId }
            : {
                title: movie.title,
                poster_path: movie.poster_path,
              },
      };
    });

    res.json({ success: true, data: formattedComments });
  } catch (error) {
    console.error("Error fetching comments with movies:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch comments." });
  }
};

module.exports = {
  viewMovies,
  viewUsers,
  viewCommentsWithMovies,
  editComment,
  deleteComment,
  editUserDetails,
  deleteUser,
  editMovie,
  createMovie,
  deleteMovie,
  createUser,
};
