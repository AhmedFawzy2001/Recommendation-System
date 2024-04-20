

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Database connection pool
const pool = new Pool({
    connectionString: "postgres://default:I6v0XghdjVAW@ep-nameless-forest-a4upu4jj.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
  })
  
  pool.connect((err) => {
      if (err) throw err
      console.log("Connect to PostgreSQL successfully!")
  })

// Database connection configuration


// User Registration API
function generateUniqueId() {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substr(2, 5);
    return timestamp + randomString;
}

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const uniqueId = generateUniqueId();
    try {
        const query = 'INSERT INTO users (userid, username, email, password) VALUES ($1, $2, $3, $4) RETURNING userid';
        const result = await pool.query(query, [uniqueId, username, email, password]);
        if (result.rows.length > 0) {
            res.status(201).send({ message: 'New user created', AddedID: result.rows[0].userid });
        } else {
            res.status(500).send({ message: 'Failed to create new user' });
        }
    } catch (err) {
        console.error('Error creating new user:', err);
        res.status(500).send({ message: 'Failed to create new user' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
        const result = await pool.query(query, [email, password]);
        if (result.rows.length > 0) {
            res.status(200).send({ message: 'Login successful',AddedID: result.rows[0].userid });
        } else {
            res.status(401).send({ message: 'Invalid login credentials' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('An error occurred during login');
    }
});

function generateTimestamp()
{
// Create a new Date object
const currentDate = new Date();

// Get individual components of the date and time
const year = currentDate.getFullYear(); // Get the current year
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1
const day = String(currentDate.getDate()).padStart(2, '0'); // Get the day of the month
const hours = String(currentDate.getHours()).padStart(2, '0'); // Get the hours (0-23)
const minutes = String(currentDate.getMinutes()).padStart(2, '0'); // Get the minutes (0-59)
const seconds = String(currentDate.getSeconds()).padStart(2, '0'); // Get the seconds (0-59)

// Get the timezone offset in hours
const timeZoneOffset = currentDate.getTimezoneOffset();
const timeZoneOffsetHours = Math.abs(Math.floor(timeZoneOffset / 60)).toString().padStart(2, '0');
const timeZoneSign = timeZoneOffset >= 0 ? '-' : '+';

// Combine date and time components
const formattedDate = `${year}-${month}-${day}`;
const formattedTime = `${hours}:${minutes}:${seconds}`;
const timeZone = `${timeZoneSign}${timeZoneOffsetHours}`;

// Concatenate date, time, and timezone
const dateTimeWithTimeZone = `${formattedDate} ${formattedTime}${timeZone}`;

// Output the current date and time with timezone
return dateTimeWithTimeZone;
}
app.post('/rating', async (req, res) => {
    const { userid, moviename ,rating } = req.body;
    const Movie='SELECT * FROM movies WHERE title =$1; ';
    const movieResult = await pool.query(Movie,[moviename]);
    const movieID = movieResult.rows[0].movieid;
    const timestamp=generateTimestamp();
    try {
        const query = 'INSERT INTO ratings (userid, movieid, rating, timestamp) VALUES ($1, $2, $3, $4) RETURNING userid';
        const result = await pool.query(query, [userid, movieID,rating,timestamp]);
        if (result.rows.length > 0) {
            res.status(200).send({ message: 'Rating Successful',Userid: result.rows[0].userid });
        } else {
            res.status(401).send({ message: 'Invalid rating credentials' });
        }
    } catch (err) {
        console.error('Error during rating:', err);
        res.status(500).send('An error occurred during rating');
    }
});

// app.get('/search', async (req, res) => {
//     const { title } = req.query;
//     try {
//       const result = await pool.query(`SELECT * FROM movies WHERE title ILIKE $1`, ['%' + title + '%']);
//       if (result.rows.length > 0) {
//         res.json(result.rows[0]); // Return the first matching movie
//       } else {
//         res.status(404).json({ error: 'Movie not found' });
//       }
//     } catch (error) {
//       console.error('Error executing query', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

app.get('/search', async (req, res) => {
    const { title } = req.query;
    try {
      const result = await pool.query(`SELECT * FROM movies WHERE title ILIKE $1`, ['%' + title + '%']);
      if (result.rows.length > 0) {
        res.json(result.rows); // Return all matching movies
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  


app.post('/recommend',async (req, res) => {
    const flutterData = req.body;
    // Send data to Python script
   // axios.post('http://127.0.0.1:5000/process-data', flutterData)
     // .then(async (response) => {
        // Extract the list of IDs from the response
       // const ids = response.data;
       const ids=["77","69","6969"];
        try {
          // Fetch movies with the retrieved IDs from the database
          const query = {
            text: 'SELECT * FROM movies WHERE id = ANY($1)',
            values: [ids],
          };
          const result = await pool.query(query);
          // Send the fetched movies back to Flutter
          res.json(result.rows);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error fetching movies');
        }
     // })
    //   .catch((error) => {
    //     console.error(error);
    //     res.status(500).send('Error processing data');
    //   });
  });
  
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);0
});

