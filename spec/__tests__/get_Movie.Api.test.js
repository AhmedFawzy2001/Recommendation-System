const { getMovieById } = require('../../controller/movieController'); // Adjust the path to your module
const pool = require('../../database'); // Adjust the path to your database module

jest.mock('../../database'); // Mock the database module

describe('getMovieById API', () => {
    let req, res;

    beforeEach(() => {
        req = { body: { id: 1 } };
        res = {
            json: jest.fn(),
            status: jest.fn(() => res),
        };
        pool.query.mockReset();
    });

    it('should return the movie with default values and cast details applied', async () => {
        pool.query
            .mockResolvedValueOnce({ rows: [{ movieid: 1, title: 'Test Movie', poster: null, genres: ['Drama'], cast: null }] })
            .mockResolvedValueOnce({ rows: [{ cast_names: ['Actor 1', 'Actor 2'], photo_links: ['http://photo1', 'http://photo2'] }] });

        await getMovieById(req, res);

        expect(pool.query).toHaveBeenCalledTimes(2);
        expect(res.json).toHaveBeenCalledWith({
            movieid: 1,
            title: 'Test Movie',
            poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUac6GqZPOX113dy-FfGX6NrDLsp1qEvN1LrkX-GewqK1-Kz8J_PTM2y6&s=10",
            genres: ['Drama'],
            cast: ['Actor 1', 'Actor 2'],
            cast_photos: ['http://photo1', 'http://photo2'],
        });
    });

    it('should return 404 if the movie is not found', async () => {
        pool.query.mockResolvedValueOnce({ rows: [] });

        await getMovieById(req, res);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Movie not found' });
    });

    it('should return 500 if there is an internal server error', async () => {
        pool.query.mockRejectedValueOnce(new Error('Database error'));

        await getMovieById(req, res);

        expect(pool.query).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});
