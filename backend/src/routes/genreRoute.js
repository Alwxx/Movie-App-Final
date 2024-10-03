const express = require('express');
const { getGenres, createGenre, updateGenre, deleteGenre } = require('../controllers/genreController');
const { userAuth, admin } = require('../middlewares/authMiddleware');

const genreRouter = express.Router(); 

genreRouter.get('/', getGenres);
genreRouter.post('/', userAuth, admin, createGenre);
genreRouter.put('/:id', userAuth, admin, updateGenre);
genreRouter.delete('/:id', userAuth, admin, deleteGenre);

module.exports = { genreRouter };
