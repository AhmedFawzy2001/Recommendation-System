const axios = require("axios");

const pool = require("../database"); // Assuming database.js is in the parent directory

const recommendMovies = async (req, res) => {
  try {
    const flutterData = req.body;
    const ID = req.body.id;
    const userQuery = {
      text: "SELECT flag FROM users WHERE userid = $1",
      values: [ID],
    };
    const userResult = await pool.query(userQuery);
    if (userResult.rowCount === 0) {
      return res.status(404).send("User not found");
    }
    const userFlag = userResult.rows[0].flag;
    if (userFlag) {
      const userRecommendationQuery = {
        text: "SELECT recommendation FROM users WHERE userid = $1",
        values: [ID],
      };
      const userRecommendationResult = await pool.query(
        userRecommendationQuery
      );
       // Fetch movies with the retrieved IDs from the database
       const query = {
        text: "SELECT * FROM movies WHERE movieid = ANY($1)",
        values: [userRecommendationResult.rows[0].recommendation],
      };
      const result = await pool.query(query);
      res.json(result.rows);
    } else {
      // Send data to Python script
      const pythonResponse = await axios.post(
        "https://movie-recommendation-api-jyof.onrender.com/process-data",
        flutterData
      );
      const ids = pythonResponse.data.recommendations;
      console.log(ids);
      // Fetch movies with the retrieved IDs from the database
      const query = {
        text: "SELECT * FROM movies WHERE movieid = ANY($1)",
        values: [ids],
      };
      const result = await pool.query(query);
      const defaultPosterUrl =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
      const defaultGenres = "{{Drama}}";
      const defaultCast = "{{hady}}";
      result.rows.forEach((movie) => {
        if (!movie.poster) {
          movie.poster = defaultPosterUrl;
        }
        if (!movie.cast) {
          movie.cast = defaultCast;
        }
        if (!movie.genres) {
          movie.genres = defaultGenres;
        }
      });
      const updateFlagtrue = {
        text: "UPDATE users SET flag = true WHERE userid = $1 RETURNING *",
        values: [ID],
      };
      await pool.query(updateFlagtrue);
      // Send the fetched movies back to Flutter
      res.json(result.rows);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing data");
  }
};

module.exports = {
  recommendMovies,
};
