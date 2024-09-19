const Review = require('../models/Review');

const getReviewsForMovie = async (req, res) => {
    try {
        const reviews = await Review.find({ movie: req.params.movieId });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addReview = async (req, res) => {
    try {
        const review = new Review({
            user: req.user._id,
            movie: req.params.movieId,
            ...req.body,
        });
        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getReviewsForMovie, addReview, updateReview, deleteReview };
