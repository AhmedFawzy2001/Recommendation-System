const { searchMovies } = require('../../controller/searchController'); // Assuming the file is named searchMovies.js
const pool = require('../../database');

// Mocking pool.query
jest.mock('../../database', () => ({
    query: jest.fn(),
}));

describe('searchMovies function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return movies when they are found', async () => {
        const mockRows = [
            { title: 'Movie 1', poster: 'poster_url_1', genres: ['Action', 'Adventure'] },
            { title: 'Movie 2', poster: null },
        ];
        pool.query.mockResolvedValueOnce({ rows: mockRows });

        const req = { body: { title: 'Movie' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await searchMovies(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            `SELECT * FROM movies WHERE title ILIKE $1 LIMIT 20`,
            ['%Movie%']
        );
        expect(res.json).toHaveBeenCalledWith([
            { title: 'Movie 1', poster: 'poster_url_1', genres: ['Action', 'Adventure'], cast: ['hady'] },
            { title: 'Movie 2', poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10', genres: ['Drama'], cast: ['hady'] },
        ]);
    });

    test('should return 404 error when no movies are found', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        const req = { body: { title: 'Non-existent Movie' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await searchMovies(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Movie not found' });
    });

    test('should return 500 error when an error occurs', async () => {
        const mockError = new Error('Database error');
        console.error = jest.fn(); // Mocking console.error
        pool.query.mockRejectedValueOnce(mockError);

        const req = { body: { title: 'Movie' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await searchMovies(req, res);

        expect(console.error).toHaveBeenCalledWith('Error executing query', mockError);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});
