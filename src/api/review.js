import axios from "./axios";

/**
 * @typedef {Object} CreateReviewData
 * @property {number} carId - The ID of the car being reviewed
 * @property {number} bookingId - The ID of the booking being reviewed
 * @property {number} rating - The rating (1-5)
 * @property {string} comment - The review comment
 */

/**
 * Creates a new review for a completed booking
 * @param {CreateReviewData} data - The review data
 * @returns {Promise<any>} The created review data
 */
export const createReview = (data) => axios.post("/client/reviews", data);

/**
 * Gets reviews for a car with pagination
 * @param {number} carId - The car ID
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Items per page
 * @returns {Promise<any>} The reviews data with pagination
 */
export const getCarReviews = (carId, params) =>
	axios.get(`/public/reviews/car/${carId}`, { params });

/**
 * Gets the average rating and total reviews for a car
 * @param {number} carId - The car ID
 * @returns {Promise<{averageRating: number, totalReviews: number}>} The rating data
 */
export const getCarRating = (carId) =>
	axios.get(`/public/reviews/car/${carId}/rating`);

/**
 * Checks if a user can review a specific booking
 * @param {number} bookingId - The booking ID
 * @returns {Promise<{canReview: boolean}>} Whether the user can review
 */
export const canReviewBooking = (bookingId) =>
	axios.get(`/client/reviews/can-review/${bookingId}`); 