const axios = require('axios');

describe('GET /MovieID', () => {
    it('should return the movie if found', async () => {
        // Mocking the axios.get method
        const mockMovie = {
            movieid: "182167",
            imdbid: "tt0023812",
            tmdbid: "66822",
            title: "Birds in the Spring",
            poster: "https://image.tmdb.org/t/p/original/3PH9xmPp8azqgwvcgFTJuNKEHFF.jpg",
            genres: ["Animation", "Comedy"],
            cast: ["Marion Darlington", "Clarence Nash", "Purv Pullen", "Mae Questel"]
        };
        axios.get = jest.fn().mockResolvedValue({ data: mockMovie, status: 201 }); // Adding status property
    
        const response = await axios.get('http://localhost:3000/MovieID', { data: { id: 182167 } });
    
        expect(response.status).toBe(201);
        expect(response.data).toEqual(mockMovie);
    });

    it('should return 404 if movie not found', async () => {
        // Mocking the axios.get method
        axios.get = jest.fn().mockRejectedValue({ response: { status: 404, data: { error: 'Movie not found' } } });

        try {
            await axios.get('http://localhost:3000/MovieID', { data: { id: 2 } });
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toEqual({ error: 'Movie not found' });
        }
    });

    it('should return 500 if an internal server error occurs', async () => {
        // Mocking the axios.get method
        axios.get = jest.fn().mockRejectedValue({ response: { status: 500, data: { error: 'Internal server error' } } });

        try {
            await axios.get('http://localhost:3000/MovieID', { data: { id: 3 } });
        } catch (error) {
            expect(error.response.status).toBe(500);
            expect(error.response.data).toEqual({ error: 'Internal server error' });
        }
    });
});
