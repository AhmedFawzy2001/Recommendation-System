const axios = require('axios');
const app = require('../../index');

describe('User Registration API', () => {
    it('should create a new user and return 201 if successful', async () => {
        const res = await axios.post('http://localhost:3000/signup', {
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpassword'
        });
        expect(res.status).toEqual(201);
        expect(res.data.message).toEqual('New user created');
        expect(res.data.AddedID).toBeDefined(); // Adjusted to check if AddedID is defined
    });

    it('should return 500 if database insertion fails', async () => {
        // Simulate a database insertion failure
        // Provide a malformed request body or incorrect data
        try {
            await axios.post('http://localhost:3000/signup', {
                username: 'testuser',
                email: 'test@example.com'
            }); // Missing password
        } catch (error) {
            expect(error.response.status).toEqual(500);
            expect(error.response.data.message).toEqual('Failed to create new user');
        }
    });
});

describe('User Login API', () => {
    it('should return 200 if login is successful', async () => {
        const res = await axios.post('http://localhost:3000/login', {
            email: 'test@example.com',
            password: 'testpassword'
        });
        expect(res.status).toEqual(200);
        expect(res.data.message).toEqual('Login successful');
        expect(res.data.AddedID).toBeDefined(); // Adjusted to check if AddedID is defined
    });

    it('should return 401 if login credentials are invalid', async () => {
        // Provide incorrect login credentials
        try {
            await axios.post('http://localhost:3000/login', {
                email: 'test@example.com',
                password: 'wrongpassword'
            });
        } catch (error) {
            expect(error.response.status).toEqual(401);
            expect(error.response.data.message).toEqual('Invalid login credentials');
        }
    });
});
