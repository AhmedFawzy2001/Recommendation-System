const pool = require("../database"); 
const { generateTimestamp } = require("../controller/userController");

const addRating = async (req, res) => {
  const { userid, movieid, rating } = req.body;
  const parsedRating = Math.round(parseFloat(rating)); 
  const timestamp = generateTimestamp();
  try {
    const updateFlagQuery = {
      text: "UPDATE users SET flag = false WHERE userid = $1 RETURNING *",
      values: [userid],
    };
    await pool.query(updateFlagQuery);
    // Check if the user has already rated the movie
    const existingRatingQuery =
      "SELECT * FROM ratings WHERE userid = $1 AND movieid = $2";
    const existingRatingResult = await pool.query(existingRatingQuery, [
      userid,
      movieid,
    ]);

    if (existingRatingResult.rows.length > 0) {
      // If user has already rated the movie, update the existing rating
      const updateRatingQuery =
        "UPDATE ratings SET rating = $1, timestamp = $2 WHERE userid = $3 AND movieid = $4 RETURNING userid";
      const updateRatingResult = await pool.query(updateRatingQuery, [
        parseInt(parsedRating),
        timestamp,
        userid,
        movieid,
      ]);

      if (updateRatingResult.rows.length > 0) {
        res
          .status(200)
          .send({
            message: "Rating Updated Successfully",
            Userid: updateRatingResult.rows[0].userid,
          });
      } else {
        res.status(500).send({ message: "Failed to update rating" });
      }
    } else {
      // If user has not rated the movie before, insert a new rating
      const insertRatingQuery =
        "INSERT INTO ratings (userid, movieid, rating, timestamp) VALUES ($1, $2, $3, $4) RETURNING userid";
      const insertRatingResult = await pool.query(insertRatingQuery, [
        userid,
        movieid,
        parseInt(parsedRating),
        timestamp,
      ]);

      if (insertRatingResult.rows.length > 0) {
        res
          .status(200)
          .send({
            message: "Rating Added Successfully",
            Userid: insertRatingResult.rows[0].userid,
          });
      } else {
        res.status(500).send({ message: "Failed to add rating" });
      }
    }
  } catch (err) {
    console.error("Error during rating:", err);
    res.status(500).send("An error occurred during rating");
  }
};


module.exports = {
  addRating,
};
