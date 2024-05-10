const pool = require("../database"); // Assuming database.js is in the parent directory

const getMovieById = async (req, res) => {
    const { id } = req.body; // Extract the movie ID from the request body
    try {
        const result = await pool.query('SELECT * FROM movies WHERE movieid = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Return the first (and only) movie found
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