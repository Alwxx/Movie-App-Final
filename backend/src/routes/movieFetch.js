const axios = require("axios");


app.get("/api/movie", async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}`);
        res.json(response.data.results);
    } catch (error) {
        res.status(500).json({error: "Failed to fetch movie"})
    };
});