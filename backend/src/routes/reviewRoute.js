const express = require('express');
const { getReviewsForMovie, addReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { userAuth } = require('../middlewares/authMiddleware');

const reviewRouter = express.Router();

reviewRouter.get('/:movieId', getReviewsForMovie);
reviewRouter.post('/:movieId', userAuth, addReview);
reviewRouter.put('/update/:id', userAuth, updateReview);
reviewRouter.delete('/delete/:id', userAuth, deleteReview);

module.exports = { reviewRouter };
