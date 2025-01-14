const express = require("express");
const {
  viewMovies,
  viewUsers,
  editComment,
  deleteComment,
  deleteUser,
  editUserDetails,
  editMovie,
  deleteMovie,
  createMovie,
  createUser,
  viewCommentsWithMovies,
} = require("../controllers/adminController");
const isAdmin = require("../middlewares/isAdmin");
const { userAuth } = require("../middlewares/authMiddleware");

const adminRouter = express.Router();

// Ensure only authenticated admin users can access these routes
adminRouter.use(userAuth, isAdmin);

// View all created movies (custom)
adminRouter.get("/movies", viewMovies);
// Edit movie
adminRouter.post("/movies", createMovie);
adminRouter.put("/movies/:id", editMovie);
adminRouter.delete("/movies/:id", deleteMovie);

// View all non-admin users
adminRouter.get("/users", viewUsers);
adminRouter.post("/users", createUser);

// Edit/Delete comments
adminRouter.get("/comments-with-movies", viewCommentsWithMovies);
adminRouter.put("/comments/:id", editComment);
adminRouter.delete("/comments/:id", deleteComment);

// Edit/Delete/Block users
adminRouter.put("/users/:id", editUserDetails); // Edit user details
adminRouter.delete("/users/:id", deleteUser); // Delete user

module.exports = { adminRouter };
