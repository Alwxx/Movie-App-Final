const express = require('express');
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { userAuth } = require('../middlewares/authMiddleware');

const userRouter = express.Router();

userRouter.post('/signup', registerUser);
userRouter.post('/login', loginUser);
userRouter.route('/profile')
    .get(userAuth, getUserProfile)
    .put(userAuth, updateUserProfile);

module.exports = { userRouter };
