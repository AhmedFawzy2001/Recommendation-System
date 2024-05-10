const express = require("express");
const router = express.Router();
const recommendController = require("../controller/recommendController");

// Route for recommending movies
router.post("/recommend", recommendController.recommendMovies);

module.exports = router;