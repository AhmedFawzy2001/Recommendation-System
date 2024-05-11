const axios = require('axios');

describe('POST /search', () => {
    it('should return matching movies if found', async () => {
        const mockTitle = 'Mock';
        const mockMovies = [
            { 
                id: '1', 
                title: 'Mock Movie 1', 
                poster: 'https://example.com/poster1.jpg', 
                genres: ['Genre1', 'Genre2'], 
                cast: ['Actor1', 'Actor2'] 
            },
            { 
                id: '2', 
                title: 'Mock Movie 2', 
                poster: 'https://example.com/poster2.jpg', 
                genres: ['Genre3', 'Genre4'], 
                cast: ['Actor3', 'Actor4'] 
            }
        ];
        axios.post = jest.fn().mockResolvedValue({ data: mockMovies, status: 200 });
    
        const response = await axios.post('http://localhost:3000/search', { title: mockTitle });
    
        expect(response.status).toBe(200);
        expect(response.data).toEqual(mockMovies);
    });
    
    

    it('should return 404 if no matching movies found', async () => {
        const mockTitle = 'Non-existing Movie';
        axios.post = jest.fn().mockRejectedValue({ response: { status: 404, data: { error: 'Movie not found' } } });

        try {
            await axios.post('http://localhost:3000/search', { title: mockTitle });
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toEqual({ error: 'Movie not found' });
        }
    });

    it('should return 500 if an internal server error occurs', async () => {
        const mockTitle = 'Mock Movie';
        axios.post = jest.fn().mockRejectedValue({ response: { status: 500, data: { error: 'Internal server error' } } });

        try {
            await axios.post('http://localhost:3000/search', { title: mockTitle });
        } catch (error) {
            expect(error.response.status).toBe(500);
            expect(error.response.data).toEqual({ error: 'Internal server error' });
        }
    });
});
