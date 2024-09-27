const express = require('express');
const { getMovies, createMovie, updateMovie, deleteMovie } = require('../controllers/movieController');
const { userAuth, admin } = require('../middlewares/authMiddleware');
const movieRouter = express.Router();
const upload = require('../middlewares/multer')


movieRouter.get('/', getMovies);
movieRouter.post('/', userAuth, admin, createMovie);
movieRouter.put('/update/:id', userAuth, admin, updateMovie);
movieRouter.delete('/delete/:id', userAuth, admin, deleteMovie);
movieRouter.post('/movies', upload.single('poster'),createMovie);
module.exports = { movieRouter };
