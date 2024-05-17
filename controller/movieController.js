const pool = require("../database"); // Assuming database.js is in the parent directory

const getMovieById = async (req, res) => {
    const { id } = req.body; // Extract the movie ID from the request body
    try {
        const result = await pool.query('SELECT * FROM movies WHERE movieid = $1', [id]);

        const defaultPosterUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10";
        const defaultGenres = "Drama";
        const defaultCast = "hady";

        if (result.rows.length > 0) {
            const movie = result.rows[0];
            if (!movie.poster) {
                movie.poster = defaultPosterUrl;
            }
            if (!movie.cast) {
                movie.cast = [defaultCast];
            }
            if (!movie.genres) {
                movie.genres = [defaultGenres];
            }
            res.json(movie); // Return the movie with defaults applied
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
