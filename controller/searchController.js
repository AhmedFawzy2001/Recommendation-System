const pool = require("../database"); // Assuming database.js is in the parent directory

const searchMovies = async (req, res) => {
    const { title } = req.body; // Extract the title from the request body
    try {
        const result = await pool.query(`SELECT * FROM movies WHERE title ILIKE $1 LIMIT 20`, ['%' + title + '%']);
        if (result.rows.length > 0) {
            res.json(result.rows); // Return the first 20 matching movies
        } else {
            res.status(404).json({ error: 'Movie not found' });
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    searchMovies
};
