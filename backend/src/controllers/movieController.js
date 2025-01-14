const Favorite = require("../models/Favorite");
const Email = require("../utils/Email");
const Rating = require("../models/Rating");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Movie = require("../models/Movie");

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().select(
      "title overview release_date genres poster_path vote_average"
    );

    res.json({
      success: true,
      message: "Movies retrieved successfully",
      data: movies,
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch movies.",
    });
  }
};

const updateFavorite = async (req, res) => {
  try {
    const { movieId, tmdbMovieId } = req.body;

    if (!movieId && !tmdbMovieId) {
      return res.status(400).json({
        success: false,
        message: "Either Movie ID or TMDB Movie ID is required",
        data: {},
      });
    }

    // Check if already favorited

    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      ...(tmdbMovieId && { tmdbMovieId }),
      ...(movieId && { movie: movieId }),
    });

    if (existingFavorite) {
      // Remove from favorites
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
        movie: movieId || null,
        tmdbMovieId: tmdbMovieId || null,
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
    const favorites = await Favorite.find({ user: req.user.id })
      .populate("movie", "title description releaseDate") // Populate local movie details
      .exec();

    const response = favorites.map((favorite) => {
      if (favorite.movie) {
        // Local movie favorite
        return {
          id: favorite.movie._id,
          title: favorite.movie.title,
          description: favorite.movie.description,
          releaseDate: favorite.movie.releaseDate,
          type: "local", // Distinguish between local and TMDB favorites
        };
      } else if (favorite.tmdbMovieId) {
        // TMDB movie favorite
        return {
          id: favorite.tmdbMovieId,
          title: null, // TMDB title must be fetched on the frontend using TMDB API
          description: null,
          releaseDate: null,
          type: "tmdb", // Distinguish between local and TMDB favorites
        };
      } else {
        return {};
      }
    });

    res.status(200).json({
      success: true,
      message: "Favorites retrieved successfully",
      data: response,
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
    const { id: movieId } = req.  params; // `local` indicates if this is a local movie
    const { local } = req.query;
    const userId = req.user?.id;

    let movieDetails = null;

    // If it's a local movie, fetch details from the database
    if (local === "true") {
      movieDetails = await Movie.findById(movieId).select(
        "title description releaseDate genres averageRating"
      );

      if (!movieDetails) {
        return res.status(404).json({
          success: false,
          message: "Local movie not found.",
        });
      }
    }

    // Fetch all comments for the movie
    const comments = await Comment.find(
      local === "true" ? { movie: movieId } : { tmdbMovieId: movieId }
    )
      .populate("user", "username")
      .populate({
        path: "parentComment",
        populate: { path: "user", select: "username" },
      })
      .sort({ createdAt: -1 });

    // Fetch the user's rating
    const userRating = userId
      ? await Rating.findOne(
          local === "true"
            ? { movie: movieId, user: userId }
            : { tmdbMovieId: movieId, user: userId }
        ).select("rating")
      : null;

    // Check if the movie is in the user's wishlist
    const inWishlist = userId
      ? !!(await Favorite.findOne(
          local === "true"
            ? { movie: movieId, user: userId }
            : { tmdbMovieId: movieId, user: userId }
        ))
      : false;

    res.json({
      success: true,
      data: {
        movieDetails, // Only included if it's a local movie
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
    const { content, movieId, tmdbMovieId, parentComment } = req.body;
    const userId = req.user.id;

    if (!content || (!movieId && !tmdbMovieId)) {
      return res.status(400).json({
        success: false,
        message: "Content and either Movie ID or TMDB Movie ID are required.",
      });
    }

    // Create new comment
    const newComment = await Comment.create({
      content,
      user: userId,
      movie: movieId || null,
      tmdbMovieId: tmdbMovieId || null,
      parentComment: parentComment || null,
    });

    // Populate the user field to include the username
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
          movieId: movieId || tmdbMovieId, // Pass the appropriate movie ID
          movieTitle: req.body.movieTitle, // Pass the movie title from the client
        });
      }
    }

    res.json({
      success: true,
      message: "Comment added successfully.",
      data: populatedComment,
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
    const { movieId, tmdbMovieId, rating } = req.body;
    const userId = req.user.id;

    // Validate input
    if ((!movieId && !tmdbMovieId) || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Either Movie ID or TMDB Movie ID, and rating are required.",
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
      {
        user: userId,
        $or: [{ movie: movieId }, { tmdbMovieId }],
      },
      {
        rating,
        movie: movieId || null,
        tmdbMovieId: tmdbMovieId || null,
      },
      { new: true, upsert: true } // Create if not found, update if found
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
  updateFavorite,
  getFavorites,
  shareWishlist,
  getMovieDetails,
  addComment,
  rateMovie,
};
