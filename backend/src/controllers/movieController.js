const Movie = require("../models/Movies");
const uploadImage = require("../utils/imageUpload");
const Favorite = require("../models/Favorite");
const Email = require("../utils/Email");
const Rating = require("../models/Rating");
const Comment = require("../models/Comment");
const User = require("../models/User");

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const savedMovie = await movie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json({ message: "Movie deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        message: "Movie ID is required",
        data: {},
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      movieId,
    });

    if (existingFavorite) {
      //Remove from favorites

      await existingFavorite.deleteOne();
      return res.status(201).json({
        success: true,
        message: "Movie removed from favorites",
        data: {},
      });
    } else {
      // Create new favorite
      const favorite = new Favorite({
        user: req.user.id,
        movieId,
      });

      await favorite.save();

      res.status(201).json({
        success: true,
        message: "Movie added to favorites",
        data: favorite,
      });
    }
  } catch (error) {
    console.error("Add favorite error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while adding movie to favorites",
      data: {},
    });
  }
};

const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      message: "Favorites retrieved successfully",
      data: favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const shareWishlist = async (req, res) => {
  const { email, movies } = req.body;
  const name = req.user.name; // Assuming user's name is stored in the JWT payload

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (!email || !movies || movies.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or empty wishlist" });
  }

  try {
    await Email.sendWishlistEmail({ email, name: user.username, movies });
    res.json({ success: true, message: "Wishlist shared successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};

const getMovieDetails = async (req, res) => {
  try {
    const { id: movieId } = req.params;
    const userId = req.user?.id;

    // Fetch all comments for the movie
    const comments = await Comment.find({ movieId })
      .populate("user", "username")
      .populate({
        path: "parentComment",
        populate: { path: "user", select: "username" },
      })
      .sort({ createdAt: -1 });

    // Fetch the user's rating
    const userRating = userId
      ? await Rating.findOne({ movieId, user: userId }).select("rating")
      : null;

    // Check if the movie is in the user's wishlist
    const inWishlist = userId
      ? !!(await Favorite.findOne({ movieId, user: userId }))
      : false;

    res.json({
      success: true,
      data: {
        comments,
        userRating: userRating?.rating || 0,
        inWishlist,
      },
    });
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch movie details.",
    });
  }
};
const addComment = async (req, res) => {
  try {
    const { movieId, content, parentComment } = req.body;
    const userId = req.user.id;

    if (!content || !movieId) {
      return res.status(400).json({
        success: false,
        message: "Content and movie ID are required.",
      });
    }

    // Create new comment
    const newComment = await Comment.create({
      content,
      movieId,
      user: userId,
      parentComment,
    });

    // Populate the user field to get the username instead of just the user ID
    const populatedComment = await newComment.populate("user", "username");

    // If it's a reply, notify the original commenter
    if (parentComment) {
      const parent = await Comment.findById(parentComment).populate(
        "user",
        "email"
      );

      if (parent?.user?.email) {
        await Email.sendReplyNotification({
          email: parent.user.email,
          movieId,
          movieTitle: req.body.movieTitle, // Pass the movie title from the client
        });
      }
    }

    res.json({
      success: true,
      message: "Comment added successfully.",
      data: populatedComment, // Send the populated comment with user details
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add comment.",
    });
  }
};

const rateMovie = async (req, res) => {
  try {
    const { movieId, rating } = req.body;
    const userId = req.user.id;

    if (!movieId || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Movie ID and rating are required.",
      });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5.",
      });
    }

    // Update or create a rating
    const userRating = await Rating.findOneAndUpdate(
      { movieId, user: userId },
      { rating },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: "Rating submitted successfully.",
      data: userRating,
    });
  } catch (error) {
    console.error("Error rating movie:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit rating.",
    });
  }
};

module.exports = {
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
};
