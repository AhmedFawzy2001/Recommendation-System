// const pool = require("../database"); // Assuming database.js is in the parent directory

// const getMovieById = async (req, res) => {
//     const { id } = req.body; // Extract the movie ID from the request body
//     try {
//         const result = await pool.query('SELECT * FROM movies WHERE movieid = $1', [id]);

//         const defaultPosterUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
//         const defaultGenres = "Drama";
//         const defaultCast = "hady";

//         if (result.rows.length > 0) {
//             const movie = result.rows[0];
//             if (!movie.poster) {
//                 movie.poster = defaultPosterUrl;
//             }
//             if (!movie.cast) {
//                 movie.cast = [defaultCast];
//             }
//             if (!movie.genres) {
//                 movie.genres = [defaultGenres];
//             }
//             res.json(movie); // Return the movie with defaults applied
//         } else {
//             res.status(404).json({ error: 'Movie not found' });
//         }
//     } catch (error) {
//         console.error('Error executing query', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// module.exports = {
//     getMovieById
// };



// const pool = require("../database"); // Assuming database.js is in the parent directory

// const defaultPosterUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
// const defaultGenres = ["Drama"];
// const defaultCast = ["hady"];
// const defaultCastPhoto = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOEWS6pdLp3FnvWINa2xcberjTeh4i-_R5aA";

// const setDefaultValues = (movie) => {
//     if (!movie.poster) {
//         movie.poster = defaultPosterUrl;
//     }
//     if (!movie.genres || movie.genres.length === 0) {
//         movie.genres = defaultGenres;
//     }
//     return movie;
// };

// const getCastDetails = async (movieID) => {
//     const query = {
//         text: `
//             SELECT
//                 array_agg(DISTINCT c.name ORDER BY array_position(m.cast, c.name)) AS cast_names,
//                 array_agg(
//                     DISTINCT
//                     CASE
//                         WHEN c.photo IS NULL THEN $2
//                         ELSE c.photo
//                     END
//                     ORDER BY array_position(m.cast, c.name)
//                 ) AS photo_links
//             FROM
//                 public.movies m,
//                 unnest(m.cast) AS cast_name
//             JOIN
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

// const getMovieById = async (req, res) => {
//     const { id } = req.body; // Extract the movie ID from the request body
//     try {
//         const result = await pool.query('SELECT * FROM movies WHERE movieid = $1', [id]);

//         if (result.rows.length > 0) {
//             let movie = result.rows[0];
//             movie = setDefaultValues(movie);

//             const castDetails = await getCastDetails(movie.movieid);

//             // Combine movie data with cast details
//             movie.cast = castDetails.cast_names;
//             movie.cast_photos = castDetails.photo_links;

//             res.json(movie); // Return the movie with defaults and cast details applied
//         } else {
//             res.status(404).json({ error: 'Movie not found' });
//         }
//     } catch (error) {
//         console.error('Error executing query', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// module.exports = {
//     getMovieById
// };


// const pool = require("../database"); // Assuming database.js is in the parent directory

// const defaultPosterUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
// const defaultGenres = ["Drama"];
// const defaultCast = ["hady"];
// const defaultCastPhoto = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";

// const setDefaultValues = (movie) => {
//     if (!movie.poster) {
//         movie.poster = defaultPosterUrl;
//     }
//     if (!movie.genres || movie.genres.length === 0) {
//         movie.genres = defaultGenres;
//     }
//     return movie;
// };

// const getCastDetails = async (movieID) => {
//     const query = {
//         text: `
//             SELECT
//                 array_agg(DISTINCT c.name ORDER BY array_position(m.cast, c.name)) AS cast_names,
//                 array_agg(
//                     DISTINCT CASE
//                         WHEN c.photo IS NULL THEN $2
//                         ELSE c.photo
//                     END
//                     ORDER BY array_position(m.cast, c.name)
//                 ) AS photo_links
//             FROM
//                 public.movies m,
//                 unnest(m.cast) AS cast_name
//             JOIN
//                 public.cast c ON cast_name = c.name
//             WHERE
//                 m.movieid = $1;
//         `,
//         values: [movieID, defaultCastPhoto],
//     };
//     const result = await pool.query(query);
//     return result.rows[0] || { cast_names: defaultCast, photo_links: [defaultCastPhoto] };
// };

// const getMovieById = async (req, res) => {
//     const { id } = req.body; // Extract the movie ID from the request body
//     try {
//         const result = await pool.query('SELECT * FROM movies WHERE movieid = $1', [id]);

//         if (result.rows.length > 0) {
//             let movie = result.rows[0];
//             movie = setDefaultValues(movie);

//             const castDetails = await getCastDetails(movie.movieid);

//             // Combine movie data with cast details
//             movie.cast = castDetails.cast_names;
//             movie.cast_photos = castDetails.photo_links;

//             // Remove duplicates
//             const uniqueCast = [];
//             const uniqueCastPhotos = [];
//             const seenCast = new Set();

//             for (let i = 0; i < movie.cast.length; i++) {
//                 if (!seenCast.has(movie.cast[i])) {
//                     seenCast.add(movie.cast[i]);
//                     uniqueCast.push(movie.cast[i]);
//                     uniqueCastPhotos.push(movie.cast_photos[i]);
//                 }
//             }

//             movie.cast = uniqueCast;
//             movie.cast_photos = uniqueCastPhotos;

//             res.json(movie); // Return the movie with defaults and cast details applied
//         } else {
//             res.status(404).json({ error: 'Movie not found' });
//         }
//     } catch (error) {
//         console.error('Error executing query', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// module.exports = {
//     getMovieById
// };




// const pool = require("../database"); // Assuming database.js is in the parent directory

// const defaultPosterUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
// const defaultGenres = ["Drama"];
// const defaultCast = ["hady"];
// const defaultCastPhoto = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";

// const setDefaultValues = (movie) => {
//     if (!movie.poster) {
//         movie.poster = defaultPosterUrl;
//     }
//     if (!movie.genres || movie.genres.length === 0) {
//         movie.genres = defaultGenres;
//     }
//     return movie;
// };

// const getCastDetails = async (movieID) => {
//     const query = {
//         text: `
//             WITH cast_details AS (
//                 SELECT DISTINCT ON (c.name)
//                     c.name,
//                     COALESCE(c.photo, $2) AS photo,
//                     array_position(m.cast, c.name) AS position
//                 FROM
//                     public.movies m
//                 CROSS JOIN
//                     unnest(m.cast) AS cast_name
//                 JOIN
//                     public.cast c ON cast_name = c.name
//                 WHERE
//                     m.movieid = $1
//                 ORDER BY
//                     c.name, array_position(m.cast, c.name)
//             )
//             SELECT
//                 array_agg(c.name ORDER BY c.position) AS cast_names,
//                 array_agg(c.photo ORDER BY c.position) AS photo_links
//             FROM
//                 cast_details c;
//         `,
//         values: [movieID, defaultCastPhoto],
//     };
//     const result = await pool.query(query);
//     return result.rows[0] || { cast_names: defaultCast, photo_links: [defaultCastPhoto] };
// };

// const getMovieById = async (req, res) => {
//     const { id } = req.body; // Extract the movie ID from the request body
//     try {
//         const result = await pool.query('SELECT * FROM movies WHERE movieid = $1', [id]);

//         if (result.rows.length > 0) {
//             let movie = result.rows[0];
//             movie = setDefaultValues(movie);

//             const castDetails = await getCastDetails(movie.movieid);

//             // Combine movie data with cast details
//             movie.cast = castDetails.cast_names;
//             movie.cast_photos = castDetails.photo_links;

//             // Remove duplicates
//             const uniqueCast = [];
//             const uniqueCastPhotos = [];
//             const seenCast = new Set();

//             for (let i = 0; i < movie.cast.length; i++) {
//                 if (!seenCast.has(movie.cast[i])) {
//                     seenCast.add(movie.cast[i]);
//                     uniqueCast.push(movie.cast[i]);
//                     uniqueCastPhotos.push(movie.cast_photos[i]);
//                 }
//             }

//             movie.cast = uniqueCast;
//             movie.cast_photos = uniqueCastPhotos;

//             res.json(movie); // Return the movie with defaults and cast details applied
//         } else {
//             res.status(404).json({ error: 'Movie not found' });
//         }
//     } catch (error) {
//         console.error('Error executing query', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

// module.exports = {
//     getMovieById
// };


const pool = require("../database"); // Assuming database.js is in the parent directory

const defaultPosterUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
const defaultCastPhoto = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOEWS6pdLp3FnvWINa2xcberjTeh4i-_R5aA";
const defaultGenres = "Drama";
const defaultCast = "hady";

const setDefaultValues = (movie) => {
    if (!movie.poster) {
        movie.poster = defaultPosterUrl;
    }
    if (!movie.genres || movie.genres.length === 0) {
        movie.genres = [defaultGenres];
    }
    return movie;
};

const getCastDetails = async (movieID) => {
    const query = {
        text: `
            WITH cast_details AS (
                SELECT DISTINCT ON (c.name)
                    c.name,
                    COALESCE(c.photo, $2) AS photo,
                    array_position(m.cast, c.name) AS position
                FROM
                    public.movies m
                CROSS JOIN
                    unnest(m.cast) AS cast_name
                JOIN
                    public.cast c ON cast_name = c.name
                WHERE
                    m.movieid = $1
                ORDER BY
                    c.name, array_position(m.cast, c.name)
            ),
            aggregated_cast AS (
                SELECT
                    array_agg(c.name ORDER BY c.position) AS cast_names,
                    array_agg(c.photo ORDER BY c.position) AS photo_links
                FROM
                    cast_details c
            )
            SELECT
                COALESCE(cast_names, ARRAY[$3]) AS cast_names,
                COALESCE(photo_links, ARRAY[$2]) AS photo_links
            FROM
                aggregated_cast;
        `,
        values: [movieID, defaultCastPhoto, defaultCast],
    };
    const result = await pool.query(query);
    return result.rows[0] || { cast_names: [defaultCast], photo_links: [defaultCastPhoto] };
};

const getMovieById = async (req, res) => {
    const { id } = req.body; // Extract the movie ID from the request body
    try {
        const result = await pool.query('SELECT * FROM movies WHERE movieid = $1', [id]);

        if (result.rows.length > 0) {
            let movie = result.rows[0];
            movie = setDefaultValues(movie);

            const castDetails = await getCastDetails(movie.movieid);

            // Check if cast is empty and set default values if needed
            if (castDetails.cast_names.length === 0) {
                castDetails.cast_names = [defaultCast];
                castDetails.photo_links = [defaultCastPhoto];
            }

            // Combine movie data with cast details
            movie.cast = castDetails.cast_names;
            movie.cast_photos = castDetails.photo_links;

            // Remove duplicates
            const uniqueCast = [];
            const uniqueCastPhotos = [];
            const seenCast = new Set();

            for (let i = 0; i < movie.cast.length; i++) {
                if (!seenCast.has(movie.cast[i])) {
                    seenCast.add(movie.cast[i]);
                    uniqueCast.push(movie.cast[i]);
                    uniqueCastPhotos.push(movie.cast_photos[i]);
                }
            }

            movie.cast = uniqueCast;
            movie.cast_photos = uniqueCastPhotos;

            res.json(movie); // Return the movie with defaults and cast details applied
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getMovieById
};