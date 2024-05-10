
require('dotenv').config(); // Load environment variables from .env file

const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false // For development purposes, may need to be configured properly in production
    }
});

module.exports = pool;
  // Connect to the PostgreSQL database
  pool.connect((err, client, done) => {
    if (err) {
      console.error('Error connecting to PostgreSQL database', err);
    } else {
      console.log('Successfully connected to PostgreSQL database');
      done(); // Release the client back to the pool
    }
  });

 module.exports = pool



 // const { Pool } = require('pg')

// const pool = new Pool({
//     user: 'vercel_db_35rb_user',
//     host: 'dpg-coku3qud3nmc739lls40-a.oregon-postgres.render.com',
//     database: 'vercel_db_35rb',
//     password: 'dSYKqdUoLtuKhljWHsE4I0lcl29UxIni',
//     port: 5432, // Default PostgreSQL port
//     ssl: {
//         // You may need to provide SSL certificate options here
//         // Consult your PostgreSQL server documentation for details
//         rejectUnauthorized: false // For development purposes, may need to be configured properly in production
//       }
//   });
  

 // const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// })

// pool.connect((err) => {
//     if (err) throw err
//     console.log("Connect to PostgreSQL successfully!")
// })

// module.exports = pool


// Define your PostgreSQL connection parameters