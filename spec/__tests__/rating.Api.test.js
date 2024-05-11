
const axios = require('axios');

describe('Rating API', () => {
    it('should add a new rating and return 200 if successful', async () => {
        const requestBody = {
            userid: 'userIdHere',
            movieid: 'movieIdHere',
            rating: 4.5
        };

        const res = await axios.post('http://localhost:3000/rating', requestBody);

        expect(res.status).toEqual(200);
        expect(res.data.message).toEqual('Rating Added Successfully');
        expect(res.data.Userid).toBeDefined(); // Adjust based on the actual response structure
    });

    it('should update an existing rating and return 200 if successful', async () => {
        const requestBody = {
            userid: 'userIdHere',
            movieid: 'movieIdHere',
            rating: 3.5
        };

        const res = await axios.post('http://localhost:3000/rating', requestBody);

        expect(res.status).toEqual(200);
        expect(res.data.message).toEqual('Rating Updated Successfully');
        expect(res.data.Userid).toBeDefined(); // Adjust based on the actual response structure
    });

    it('should return 400 if userid is missing', async () => {
        const requestBody = {
            movieid: 'movieIdHere',
            rating: 4.5
        };

        try {
            await axios.post('http://localhost:3000/rating', requestBody);
        } catch (error) {
            expect(error.response.status).toEqual(400);
            expect(error.response.data.message).toEqual('User ID is required');
        }
    });

    it('should return 400 if movieid is missing', async () => {
        const requestBody = {
            userid: 'userIdHere',
            rating: 4.5
        };

        try {
            await axios.post('http://localhost:3000/rating', requestBody);
        } catch (error) {
            expect(error.response.status).toEqual(400);
            expect(error.response.data.message).toEqual('Movie ID is required');
        }
    });

    it('should return 400 if rating is missing', async () => {
        const requestBody = {
            userid: 'userIdHere',
            movieid: 'movieIdHere'
        };

        try {
            await axios.post('http://localhost:3000/rating', requestBody);
        } catch (error) {
            expect(error.response.status).toEqual(400);
            expect(error.response.data.message).toEqual('Rating is required');
        }
    });

    it('should return 400 if rating is not a number', async () => {
        const requestBody = {
            userid: 'userIdHere',
            movieid: 'movieIdHere',
            rating: 'notANumber'
        };

        try {
            await axios.post('http://localhost:3000/rating', requestBody);
        } catch (error) {
            expect(error.response.status).toEqual(400);
            expect(error.response.data.message).toEqual('Rating must be a number');
        }
    });

    it('should return 400 if rating is out of range (less than 0)', async () => {
        const requestBody = {
            userid: 'userIdHere',
            movieid: 'movieIdHere',
            rating: -1
        };

        try {
            await axios.post('http://localhost:3000/rating', requestBody);
        } catch (error) {
            expect(error.response.status).toEqual(400);
            expect(error.response.data.message).toEqual('Rating must be between 0 and 5');
        }
    });

    it('should return 400 if rating is out of range (greater than 5)', async () => {
        const requestBody = {
            userid: 'userIdHere',
            movieid: 'movieIdHere',
            rating: 6
        };

        try {
            await axios.post('http://localhost:3000/rating', requestBody);
        } catch (error) {
            expect(error.response.status).toEqual(400);
            expect(error.response.data.message).toEqual('Rating must be between 0 and 5');
        }
    });
});
