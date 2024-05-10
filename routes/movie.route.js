const express = require("express");
const router = express.Router();
const movieController = require("../controller/movieController");

// Route for fetching a movie by its ID
router.get("/MovieID", movieController.getMovieById);

module.exports = router;