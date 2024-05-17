// const axios = require("axios");

// const pool = require("../database"); // Assuming database.js is in the parent directory

// const recommendMovies = async (req, res) => {
//   try {
//     const flutterData = req.body;
//     const ID = req.body.id;
//     const userQuery = {
//       text: "SELECT flag FROM users WHERE userid = $1",
//       values: [ID],
//     };
//     const userResult = await pool.query(userQuery);
//     if (userResult.rowCount === 0) {
//       return res.status(404).send("User not found");
//     }
//     const userFlag = userResult.rows[0].flag;
//     if (userFlag) {
//       const userRecommendationQuery = {
//         text: "SELECT recommendation FROM users WHERE userid = $1",
//         values: [ID],
//       };
//       const userRecommendationResult = await pool.query(
//         userRecommendationQuery
//       );
//        // Fetch movies with the retrieved IDs from the database
//        const query = {
//         text: "SELECT * FROM movies WHERE movieid = ANY($1)",
//         values: [userRecommendationResult.rows[0].recommendation],
//       };
//       console.log(userRecommendationResult.rows[0].recommendation);
//       const result = await pool.query(query);
//       res.json(result.rows);
//     } else {
//       // Send data to Python script
//       const pythonResponse = await axios.post(
//         "https://movie-recommendation-api-jyof.onrender.com/process-data",
//         flutterData
//       );
//       const ids = pythonResponse.data.recommendations;
//       console.log(ids);
//       // Fetch movies with the retrieved IDs from the database
//       const query = {
//         text: "SELECT * FROM movies WHERE movieid = ANY($1)",
//         values: [ids],
//       };
//       const result = await pool.query(query);
//       const defaultPosterUrl =
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
//       const defaultGenres = "{{Drama}}";
//       const defaultCast = "{{hady}}";
//       result.rows.forEach((movie) => {
//         if (!movie.poster) {
//           movie.poster = defaultPosterUrl;
//         }
//         if (!movie.cast) {
//           movie.cast = defaultCast;
//         }
//         if (!movie.genres) {
//           movie.genres = defaultGenres;
//         }
//       });
//       const updateFlagtrue = {
//         text: "UPDATE users SET flag = true WHERE userid = $1 RETURNING *",
//         values: [ID],
//       };
//       await pool.query(updateFlagtrue);
//       // Send the fetched movies back to Flutter
//       res.json(result.rows);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error processing data");
//   }
// };

// module.exports = {
//   recommendMovies,
// };
// const axios = require("axios");
// const pool = require("../database"); // Assuming database.js is in the parent directory

// const defaultPosterUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
// const defaultGenres = "Drama";
// const defaultCast = "hady";

// const setDefaultValues = (movie) => {
//     if (!movie.poster) {
//         movie.poster = defaultPosterUrl;
//     }
//     if (!movie.cast) {
//         movie.cast = defaultCast;
//     }
//     if (!movie.genres) {
//         movie.genres = defaultGenres;
//     }
//     return movie;
// };

// const recommendMovies = async (req, res) => {
//   try {
//     const flutterData = req.body;
//     const ID = req.body.id;
//     const userQuery = {
//       text: "SELECT flag FROM users WHERE userid = $1",
//       values: [ID],
//     };
//     const userResult = await pool.query(userQuery);
//     if (userResult.rowCount === 0) {
//       return res.status(404).send("User not found");
//     }
//     const userFlag = userResult.rows[0].flag;
//     if (userFlag) {
//       const userRecommendationQuery = {
//         text: "SELECT recommendation FROM users WHERE userid = $1",
//         values: [ID],
//       };
//       const userRecommendationResult = await pool.query(userRecommendationQuery);

//       // Fetch movies with the retrieved IDs from the database
//       const query = {
//         text: "SELECT * FROM movies WHERE movieid = ANY($1)",
//         values: [userRecommendationResult.rows[0].recommendation],
//       };
//       console.log(userRecommendationResult.rows[0].recommendation);
//       const result = await pool.query(query);

//       // Apply default values
//       const moviesWithDefaults = result.rows.map(setDefaultValues);
//       res.json(moviesWithDefaults);
//     } else {
//       // Send data to Python script
//       const pythonResponse = await axios.post(
//         "https://movie-recommendation-api-jyof.onrender.com/process-data",
//         flutterData
//       );
//       const ids = pythonResponse.data.recommendations;
//       console.log(ids);

//       // Fetch movies with the retrieved IDs from the database
//       const query = {
//         text: "SELECT * FROM movies WHERE movieid = ANY($1)",
//         values: [ids],
//       };
//       const result = await pool.query(query);

//       // Apply default values
//       const moviesWithDefaults = result.rows.map(setDefaultValues);

//       const updateFlagTrue = {
//         text: "UPDATE users SET flag = true WHERE userid = $1 RETURNING *",
//         values: [ID],
//       };
//       await pool.query(updateFlagTrue);

//       // Send the fetched movies back to Flutter
//       res.json(moviesWithDefaults);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error processing data");
//   }
// };

// module.exports = {
//   recommendMovies,
// };


const axios = require("axios");
const pool = require("../database"); // Assuming database.js is in the parent directory

const defaultPosterUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
const defaultGenres = ["Drama"];
const defaultCast = ["hady"];

const setDefaultValues = (movie) => {
    if (!movie.poster) {
        movie.poster = defaultPosterUrl;
    }
    if (!movie.cast) {
        movie.cast = defaultCast;
    }
    if (!movie.genres) {
        movie.genres = defaultGenres;
    }
    return movie;
};

const getCastDetails = async (movieID) => {
  const query = {
    text: `
      SELECT
        array_agg(c.name ORDER BY array_position(m.cast, c.name)) AS cast_names,
        array_agg(c.photo ORDER BY array_position(m.cast, c.name)) AS photo_links
      FROM
        public.movies m,
        unnest(m.cast) AS cast_name
      JOIN
        public.cast c ON cast_name = c.name
      WHERE
        m.movieid = $1
      GROUP BY
        m.movieid;
    `,
    values: [movieID],
  };
  const result = await pool.query(query);
  return result.rows[0] || { cast_names: defaultCast, photo_links: [] };
};

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
      const userRecommendationResult = await pool.query(userRecommendationQuery);

      // Fetch movies with the retrieved IDs from the database
      const query = {
        text: "SELECT * FROM movies WHERE movieid = ANY($1)",
        values: [userRecommendationResult.rows[0].recommendation],
      };
      console.log(userRecommendationResult.rows[0].recommendation);
      const result = await pool.query(query);

      // Apply default values and fetch cast details
      const moviesWithDefaultsAndCast = await Promise.all(result.rows.map(async (movie) => {
        const movieWithDefaults = setDefaultValues(movie);
        const castDetails = await getCastDetails(movie.movieid);
        movieWithDefaults.cast = castDetails.cast_names;
        movieWithDefaults.cast_photos = castDetails.photo_links;
        return movieWithDefaults;
      }));

      res.json(moviesWithDefaultsAndCast);
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

      // Apply default values and fetch cast details
      const moviesWithDefaultsAndCast = await Promise.all(result.rows.map(async (movie) => {
        const movieWithDefaults = setDefaultValues(movie);
        const castDetails = await getCastDetails(movie.movieid);
        movieWithDefaults.cast = castDetails.cast_names;
        movieWithDefaults.cast_photos = castDetails.photo_links;
        return movieWithDefaults;
      }));

      const updateFlagTrue = {
        text: "UPDATE users SET flag = true WHERE userid = $1 RETURNING *",
        values: [ID],
      };
      await pool.query(updateFlagTrue);

      // Send the fetched movies back to Flutter
      res.json(moviesWithDefaultsAndCast);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing data");
  }
};

module.exports = {
  recommendMovies,
};




// const axios = require("axios");
// const pool = require("../database"); // Assuming database.js is in the parent directory

// const defaultPosterUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
// const defaultGenres = ["Drama"];
// const defaultCast = ["hady"];
// const defaultCastPhoto = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";

// const setDefaultValues = (movie) => {
//     if (!movie.poster) {
//         movie.poster = defaultPosterUrl;
//     }
//     if (!movie.cast) {
//         movie.cast = defaultCast;
//     }
//     if (!movie.genres) {
//         movie.genres = defaultGenres;
//     }
//     return movie;
// };

// const getCastDetails = async (movieID) => {
//     const query = {
//         text: `
//             SELECT
//                 array_agg(c.name ORDER BY array_position(m.cast, c.name)) AS cast_names,
//                 array_agg(
//                     CASE
//                         WHEN c.photo IS NULL THEN $2
//                         ELSE c.photo
//                     END
//                     ORDER BY array_position(m.cast, c.name)
//                 ) AS photo_links
//             FROM
//                 public.movies m
//             JOIN
//                 unnest(m.cast) AS cast_name ON true
//             LEFT JOIN
//                 public.cast c ON cast_name = c.name
//             WHERE
//                 m.movieid = $1
//             GROUP BY
//                 m.movieid;
//         `,
//         values: [movieID, defaultCastPhoto],
//     };
//     const result = await pool.query(query);
//     return result.rows[0] || { cast_names: defaultCast, photo_links: [defaultCastPhoto] };
// };

// const recommendMovies = async (req, res) => {
//     try {
//         const flutterData = req.body;
//         const ID = req.body.id;
//         const userQuery = {
//             text: "SELECT flag FROM users WHERE userid = $1",
//             values: [ID],
//         };
//         const userResult = await pool.query(userQuery);
//         if (userResult.rowCount === 0) {
//             return res.status(404).send("User not found");
//         }
//         const userFlag = userResult.rows[0].flag;
//         if (userFlag) {
//             const userRecommendationQuery = {
//                 text: "SELECT recommendation FROM users WHERE userid = $1",
//                 values: [ID],
//             };
//             const userRecommendationResult = await pool.query(userRecommendationQuery);

//             // Fetch movies with the retrieved IDs from the database
//             const query = {
//                 text: "SELECT * FROM movies WHERE movieid = ANY($1)",
//                 values: [userRecommendationResult.rows[0].recommendation],
//             };
//             console.log(userRecommendationResult.rows[0].recommendation);
//             const result = await pool.query(query);

//             // Apply default values and fetch cast details
//             const moviesWithDefaultsAndCast = await Promise.all(result.rows.map(async (movie) => {
//                 const movieWithDefaults = setDefaultValues(movie);
//                 const castDetails = await getCastDetails(movie.movieid);
//                 movieWithDefaults.cast = castDetails.cast_names;
//                 movieWithDefaults.cast_photos = castDetails.photo_links;
//                 return movieWithDefaults;
//             }));

//             res.json(moviesWithDefaultsAndCast);
//         } else {
//             // Send data to Python script
//             const pythonResponse = await axios.post(
//                 "https://movie-recommendation-api-jyof.onrender.com/process-data",
//                 flutterData
//             );
//             const ids = pythonResponse.data.recommendations;
//             console.log(ids);

//             // Fetch movies with the retrieved IDs from the database
//             const query = {
//                 text: "SELECT * FROM movies WHERE movieid = ANY($1)",
//                 values: [ids],
//             };
//             const result = await pool.query(query);

//             // Apply default values and fetch cast details
//             const moviesWithDefaultsAndCast = await Promise.all(result.rows.map(async (movie) => {
//                 const movieWithDefaults = setDefaultValues(movie);
//                 const castDetails = await getCastDetails(movie.movieid);
//                 movieWithDefaults.cast = castDetails.cast_names;
//                 movieWithDefaults.cast_photos = castDetails.photo_links;
//                 return movieWithDefaults;
//             }));

//             const updateFlagTrue = {
//                 text: "UPDATE users SET flag = true WHERE userid = $1 RETURNING *",
//                 values: [ID],
//             };
//             await pool.query(updateFlagTrue);

//             // Send the fetched movies back to Flutter
//             res.json(moviesWithDefaultsAndCast);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error processing data");
//     }
// };

// module.exports = {
//     recommendMovies,
// };



// const axios = require("axios");
// const pool = require("../database"); // Assuming database.js is in the parent directory

// const defaultPosterUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
// const defaultGenres = ["Drama"];
// const defaultCast = ["hady"];
// const defaultCastPhoto = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOEWS6pdLp3FnvWINa2xcberjTeh4i-_R5aA";

// const setDefaultValues = (movie) => {
//     if (!movie.poster) {
//         movie.poster = defaultPosterUrl;
//     }
//     if (!movie.cast) {
//         movie.cast = defaultCast;
//         movie.cast_photos = [defaultCastPhoto];
//     }
//     if (!movie.genres) {
//         movie.genres = defaultGenres;
//     }
//     return movie;
// };

// const getCastDetails = async (movieID) => {
//     const query = {
//         text: `
//             SELECT
//                 array_agg(c.name ORDER BY array_position(m.cast, c.name)) AS cast_names,
//                 array_agg(
//                     CASE
//                         WHEN c.photo IS NULL THEN $2
//                         ELSE c.photo
//                     END
//                     ORDER BY array_position(m.cast, c.name)
//                 ) AS photo_links
//             FROM
//                 public.movies m
//             JOIN
//                 unnest(m.cast) AS cast_name ON true
//             LEFT JOIN
//                 public.cast c ON cast_name = c.name
//             WHERE
//                 m.movieid = $1
//             GROUP BY
//                 m.movieid;
//         `,
//         values: [movieID, defaultCastPhoto],
//     };
//     const result = await pool.query(query);
//     return result.rows[0] || { cast_names: defaultCast, photo_links: [defaultCastPhoto] };
// };

// const recommendMovies = async (req, res) => {
//     try {
//         const flutterData = req.body;
//         const ID = req.body.id;
//         const userQuery = {
//             text: "SELECT flag FROM users WHERE userid = $1",
//             values: [ID],
//         };
//         const userResult = await pool.query(userQuery);
//         if (userResult.rowCount === 0) {
//             return res.status(404).send("User not found");
//         }
//         const userFlag = userResult.rows[0].flag;
//         if (userFlag) {
//             const userRecommendationQuery = {
//                 text: "SELECT recommendation FROM users WHERE userid = $1",
//                 values: [ID],
//             };
//             const userRecommendationResult = await pool.query(userRecommendationQuery);

//             // Fetch movies with the retrieved IDs from the database
//             const query = {
//                 text: "SELECT * FROM movies WHERE movieid = ANY($1)",
//                 values: [userRecommendationResult.rows[0].recommendation],
//             };
//             console.log(userRecommendationResult.rows[0].recommendation);
//             const result = await pool.query(query);

//             // Apply default values and fetch cast details
//             const moviesWithDefaultsAndCast = await Promise.all(result.rows.map(async (movie) => {
//                 const movieWithDefaults = setDefaultValues(movie);
//                 const castDetails = await getCastDetails(movie.movieid);

//                 // Remove duplicates from cast and cast_photos
//                 const uniqueCastSet = new Set();
//                 const uniqueCastPhotos = [];
//                 const uniqueCast = castDetails.cast_names.filter((name, index) => {
//                     if (uniqueCastSet.has(name)) {
//                         return false;
//                     } else {
//                         uniqueCastSet.add(name);
//                         uniqueCastPhotos.push(castDetails.photo_links[index]);
//                         return true;
//                     }
//                 });

//                 movieWithDefaults.cast = uniqueCast;
//                 movieWithDefaults.cast_photos = uniqueCastPhotos;

//                 return movieWithDefaults;
//             }));

//             res.json(moviesWithDefaultsAndCast);
//         } else {
//             // Send data to Python script
//             const pythonResponse = await axios.post(
//                 "https://movie-recommendation-api-jyof.onrender.com/process-data",
//                 flutterData
//             );
//             const ids = pythonResponse.data.recommendations;
//             console.log(ids);

//             // Fetch movies with the retrieved IDs from the database
//             const query = {
//                 text: "SELECT * FROM movies WHERE movieid = ANY($1)",
//                 values: [ids],
//             };
//             const result = await pool.query(query);

//             // Apply default values and fetch cast details
//             const moviesWithDefaultsAndCast = await Promise.all(result.rows.map(async (movie) => {
//                 const movieWithDefaults = setDefaultValues(movie);
//                 const castDetails = await getCastDetails(movie.movieid);

//                 // Remove duplicates from cast and cast_photos
//                 const uniqueCastSet = new Set();
//                 const uniqueCastPhotos = [];
//                 const uniqueCast = castDetails.cast_names.filter((name, index) => {
//                     if (uniqueCastSet.has(name)) {
//                         return false;
//                     } else {
//                         uniqueCastSet.add(name);
//                         uniqueCastPhotos.push(castDetails.photo_links[index]);
//                         return true;
//                     }
//                 });

//                 movieWithDefaults.cast = uniqueCast;
//                 movieWithDefaults.cast_photos = uniqueCastPhotos;

//                 return movieWithDefaults;
//             }));

//             const updateFlagTrue = {
//                 text: "UPDATE users SET flag = true WHERE userid = $1 RETURNING *",
//                 values: [ID],
//             };
//             await pool.query(updateFlagTrue);

//             // Send the fetched movies back to Flutter
//             res.json(moviesWithDefaultsAndCast);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error processing data");
//     }
// };

// module.exports = {
//     recommendMovies,
// };
