const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    movies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
    }],
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Watchlist = mongoose.model('Watchlist', WatchlistSchema);

module.exports = Watchlist;
