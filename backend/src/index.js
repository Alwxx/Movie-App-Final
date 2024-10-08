const express = require("express");
const { connectDB } = require("../config/db");
const { reviewRouter } = require("./routes/reviewRoute");
const { movieRouter } = require("./routes/movieRoute");
const { genreRouter } = require("./routes/genreRoute");
const { userRouter } = require("./routes/userRoute");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = 3001;

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "https://movie-app-client-ashy.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/movies", movieRouter);
app.use("/api/genre", genreRouter);

app.get("/", (req, res) => {
  res.send("Welcome to movie review and rating app - By Alwin Sunny");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
