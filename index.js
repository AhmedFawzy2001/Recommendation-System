// const express = require("express")
// const app = express()

// require('dotenv').config()

// app.use(express.json())


// const bookRouter = require('./routes/book.router')

// app.use("/api/v1/books", bookRouter)

// app.listen(process.env.PORT, () => console.log("Server is running on port 5000"))

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
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  })
  
  pool.connect((err) => {
      if (err) throw err
      console.log("Connect to PostgreSQL successfully!")
  })
  
// User Registration API
// app.post('/register', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert user data into the database
//         const query = `
//             INSERT INTO users (username, email, password)
//             VALUES ($1, $2, $3)
//             RETURNING id, username, email;
//         `;
//         const { rows } = await pool.query(query, [username, email, hashedPassword]);

//         res.status(201).json(rows[0]);
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ error: 'An internal server error occurred' });
//     }
// });

// // User Login API
// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Retrieve user from the database
//         const query = `
//             SELECT * FROM users
//             WHERE username = $1;
//         `;
//         const { rows } = await pool.query(query, [username]);
//         const user = rows[0];

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Compare hashed password with provided password
//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) {
//             return res.status(401).json({ error: 'Invalid password' });
//         }

//         res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ error: 'An internal server error occurred' });
//     }
// });


// User Registration API
// app.post('/register', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert user data into the database
//         const query = `
//             INSERT INTO users (username, email, password)
//             VALUES ($1, $2, $3)
//             RETURNING id, username, email;
//         `;
//         const { rows } = await pool.query(query, [username, email, hashedPassword]);

//         const newUser = rows[0];
//         res.status(201).json({ user: newUser });
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ error: 'An internal server error occurred' });
//     }
// });

// // User Login API
// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Retrieve user from the database
//         const query = `
//             SELECT * FROM users
//             WHERE username = $1;
//         `;
//         const { rows } = await pool.query(query, [username]);
//         const user = rows[0];

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Compare hashed password with provided password
//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) {
//             return res.status(401).json({ error: 'Invalid password' });
//         }

//         res.status(200).json({ user: { id: user.id, username: user.username, email: user.email } });
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ error: 'An internal server error occurred' });
//     }
// });


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
            res.status(200).send({ message: 'Login successful' });
        } else {
            res.status(401).send({ message: 'Invalid login credentials' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('An error occurred during login');
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);0
});

