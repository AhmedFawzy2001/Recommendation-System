const express = require("express");
const router = express.Router();
const searchController = require("../controller/searchController");

// Route for searching movies
router.post("/search", searchController.searchMovies);

module.exports = router;