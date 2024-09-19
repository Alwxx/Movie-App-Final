const Genre = require('../models/Genre');

const getGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createGenre = async (req, res) => {
    try {
        const genre = new Genre(req.body);
        const savedGenre = await genre.save();
        res.status(201).json(savedGenre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateGenre = async (req, res) => {
    try {
        const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!genre) return res.status(404).json({ message: 'Genre not found' });
        res.json(genre);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteGenre = async (req, res) => {
    try {
        const genre = await Genre.findByIdAndDelete(req.params.id);
        if (!genre) return res.status(404).json({ message: 'Genre not found' });
        res.json({ message: 'Genre deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getGenres, createGenre, updateGenre, deleteGenre };
