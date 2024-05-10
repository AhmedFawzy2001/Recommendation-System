const express = require("express");
const router = express.Router();
const ratingController = require("../controller/ratingController");

// Route for adding a rating
router.post("/rating", ratingController.addRating);

module.exports = router;