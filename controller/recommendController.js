

const axios = require('axios');

const pool = require("../database"); // Assuming database.js is in the parent directory

const recommendMovies = async (req, res) => {
    try {
        const flutterData = req.body;

        // Send data to Python script
        const pythonResponse = await axios.post('https://movie-recommendation-api-jyof.onrender.com/process-data', flutterData);
        const ids = pythonResponse.data.recommendations;
        console.log(ids);

        // Fetch movies with the retrieved IDs from the database
        const query = {
            text: 'SELECT * FROM movies WHERE movieid = ANY($1)',
            values: [ids],
        };
        const result = await pool.query(query);

        // Send the fetched movies back to Flutter
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing data');
    }
};

module.exports = {
    recommendMovies
};
