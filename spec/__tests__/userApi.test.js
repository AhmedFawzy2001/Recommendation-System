


const { signUp, login } = require("../../controller/userController");
const pool = require('../../database');
const bcrypt = require('bcrypt');

// Mocking pool.query
jest.mock('../../database', () => ({
    query: jest.fn(),
}));

// Mocking bcrypt.hash
jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe('signUp function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a new user when provided valid input', async () => {
        const req = { body: { username: 'testUser', email: 'test@example.com', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    
        const uniqueId = 'lwcbwowdjlgwc'; // Updated uniqueId
        const hashedPassword = 'hashedPassword';
        pool.query.mockResolvedValueOnce({ rows: [] });
        pool.query.mockResolvedValueOnce({ rows: [{ userid: uniqueId }] });
        bcrypt.hash.mockResolvedValueOnce(hashedPassword);
    
        await signUp(req, res);
    
        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), [req.body.email]);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), [expect.any(String), req.body.username, req.body.email, hashedPassword]); // Updated expectation
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ message: 'New user created', addedID: uniqueId });
    });
    
    test('should return 400 when email format is invalid', async () => {
        const req = { body: { username: 'testUser', email: 'invalid-email', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        await signUp(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({ message: 'Invalid email format' });
    });

    test('should return 409 when email already exists', async () => {
        const req = { body: { username: 'testUser', email: 'existing@example.com', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        pool.query.mockResolvedValueOnce({ rows: [{ email: 'existing@example.com' }] });

        await signUp(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.send).toHaveBeenCalledWith({ message: 'Email already exists' });
    });

    test('should return 500 when an error occurs', async () => {
        const req = { body: { username: 'testUser', email: 'test@example.com', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        pool.query.mockRejectedValueOnce(new Error('Database error'));

        await signUp(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ message: 'Failed to create new user' });
    });
});

describe('login function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should login successfully with correct credentials', async () => {
        const req = { body: { email: 'test@example.com', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        const hashedPassword = 'hashedPassword';
        const userid = 'userid';
        pool.query.mockResolvedValueOnce({ rows: [{ email: req.body.email, password: hashedPassword, userid }] });
        bcrypt.compare.mockResolvedValueOnce(true);

        await login(req, res);

        expect(pool.query).toHaveBeenCalledWith(expect.any(String), [req.body.email]);
        expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password, hashedPassword);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({ message: 'Login successful', AddedID: userid });
    });

    test('should return 401 with incorrect credentials', async () => {
        const req = { body: { email: 'test@example.com', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        pool.query.mockResolvedValueOnce({ rows: [] });

        await login(req, res);

        expect(pool.query).toHaveBeenCalledWith(expect.any(String), [req.body.email]);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith({ message: 'Invalid login credentials' });
    });

    test('should return 500 when an error occurs', async () => {
        const req = { body: { email: 'test@example.com', password: 'password' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };

        pool.query.mockRejectedValueOnce(new Error('Database error'));

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('An error occurred during login');
    });
});
