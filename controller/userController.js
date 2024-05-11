const pool = require('../database')

// User Registration API
const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substr(2, 5);
    return timestamp + randomString;
};

const signUp = async (req, res) => {
    const { username, email, password } = req.body;   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send({ message: 'Invalid email format' });
    }
    try {
        const emailCheckQuery = 'SELECT * FROM users WHERE email = $1';
        const emailCheckResult = await pool.query(emailCheckQuery, [email]);
        if (emailCheckResult.rows.length > 0) {
            return res.status(409).send({ message: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10); // Adjust the salt rounds as needed
        const uniqueId = generateUniqueId();
        const insertQuery = 'INSERT INTO users (userid, username, email, password) VALUES ($1, $2, $3, $4) RETURNING userid';
        const result = await pool.query(insertQuery, [uniqueId, username, email, hashedPassword]);
        if (result.rows.length > 0) {
            res.status(201).send({ message: 'New user created', addedID: result.rows[0].userid });
        } else {
            res.status(500).send({ message: 'Failed to create new user' });
        }
    } catch (err) {
        console.error('Error creating new user:', err);
        res.status(500).send({ message: 'Failed to create new user' });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                res.status(200).send({ message: 'Login successful', AddedID: user.userid });
            } else {
                res.status(401).send({ message: 'Invalid login credentials' });
            }
        } else {
            res.status(401).send({ message: 'Invalid login credentials' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('An error occurred during login');
    }
};

// Timestamp Generation Function
const generateTimestamp = () => {
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
};

module.exports = {
    signUp,
    login,
    generateTimestamp
};
