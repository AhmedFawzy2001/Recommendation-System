const { addRating } = require('../../controller/ratingController');
const pool = require('../../database');

jest.mock('../../database');

describe('addRating function', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        userid: 1,
        movieid: 1,
        rating: 4.5,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    pool.query.mockReset();
  });

  it('should add a new rating successfully', async () => {
    const mockExistingRatingResult = {
      rows: [],
    };

    pool.query
      .mockResolvedValueOnce({}) // Mock the update flag query
      .mockResolvedValueOnce(mockExistingRatingResult); // Mock the existing rating query

    pool.query.mockResolvedValueOnce({ // Mock the insert rating query
      rows: [{ userid: 1 }],
    });

    await addRating(req, res);

    expect(pool.query).toHaveBeenCalledTimes(3); // Expect three queries to be called
    expect(res.status).toHaveBeenCalledWith(200); // Expect status 200
    expect(res.send).toHaveBeenCalledWith({ message: 'Rating Added Successfully', Userid: 1 });
  });

  it('should update an existing rating successfully', async () => {
    const mockExistingRatingResult = {
      rows: [{ userid: 1 }],
    };

    pool.query
      .mockResolvedValueOnce({}) // Mock the update flag query
      .mockResolvedValueOnce(mockExistingRatingResult); // Mock the existing rating query

    pool.query.mockResolvedValueOnce({ // Mock the update rating query
      rows: [{ userid: 1 }],
    });

    await addRating(req, res);

    expect(pool.query).toHaveBeenCalledTimes(3); // Expect three queries to be called
    expect(res.status).toHaveBeenCalledWith(200); // Expect status 200
    expect(res.send).toHaveBeenCalledWith({ message: 'Rating Updated Successfully', Userid: 1 });
  });

  it('should handle database errors', async () => {
    const mockError = new Error('Database error');

    pool.query.mockRejectedValueOnce(mockError); // Mock a database error

    await addRating(req, res);

    expect(pool.query).toHaveBeenCalledTimes(1); // Expect one query to be called
    expect(res.status).toHaveBeenCalledWith(500); // Expect status 500
    expect(res.send).toHaveBeenCalledWith('An error occurred during rating'); // Expect error message
  });
});
