import axios from "./axios";

// Import brands function from public API for use in car editing
export { getAllBrandsSimple } from "./public";

export const createSellerProfile = (formData) =>
	axios.post("/seller/profile", formData);

export const getCars = () => axios.get("/seller/cars");

export const getCar = ({ id }) => axios.get(`/seller/cars/${id}`);

export const getVerificationStats = () =>
	axios.get("/seller/cars/verification/stats");

export const deleteCar = ({ id }) => axios.delete(`/seller/cars/${id}`);

export const updateCar = (carData) => {
	// Always use FormData for updates to support image operations
	const formData = new FormData();

	// Add all car fields to FormData
	Object.keys(carData).forEach((key) => {
		if (key === "newImages") {
			// Handle new image files if they exist
			if (carData.newImages && carData.newImages.length > 0) {
				carData.newImages.forEach((image) => {
					formData.append("images", image);
				});
			}
		} else if (key === "removedImageIds") {
			// Handle removed image IDs
			if (carData.removedImageIds && carData.removedImageIds.length > 0) {
				formData.append(
					"removedImageIds",
					JSON.stringify(carData.removedImageIds),
				);
			}
		} else if (carData[key] !== undefined && carData[key] !== null) {
			formData.append(key, carData[key]);
		}
	});

	return axios.put(`/seller/cars/${carData.id}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

/**
 * @typedef {Object} CreateCarData
 * @property {string} brandId - The ID of the car brand
 * @property {string} model - The car model
 * @property {string} year - The car year
 * @property {string} price - The car price
 * @property {string} description - The car description
 * @property {string} listingType - The listing type (SALE/RENT)
 * @property {string} fuelType - The fuel type (PETROL/DIESEL/ELECTRIC/HYBRID/OTHER)
 * @property {string} transmission - The transmission type (MANUAL/AUTOMATIC/SEMI_AUTOMATIC)
 * @property {string} mileage - The car mileage
 * @property {File[]} images - The car images
 */

/**
 * Creates a new car listing
 * @param {FormData} formData - The form data containing car details
 * @returns {Promise<any>} The created car data
 */
export const createCar = (formData) =>
	axios.post("/seller/cars", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const updateIsSold = ({ id, isSold }) =>
	axios.put(`/seller/cars/${id}/is-sold`, { isSold });

export const deletePromotion = ({ id }) =>
	axios.delete(`/seller/cars/${id}/promotion`);

export const createPromotion = ({
	carId,
	promotionDays,
	cardNumber,
	cardName,
	expiryDate,
	cvv,
}) =>
	axios.post(`/seller/promotions`, {
		carId,
		promotionDays,
		cardNumber,
		cardName,
		expiryDate,
		cvv,
	});

/**
 * Rental Availability Management API Functions
 */

/**
 * Add availability periods for a rental car
 * @param {number} carId - The car ID
 * @param {Array} periods - Array of date ranges {startDate, endDate}
 * @returns {Promise<any>} The response data
 */
export const addRentalAvailability = ({ carId, periods }) =>
	axios.post("/seller/rental-availability/add", { carId, periods });

/**
 * Remove availability periods for a rental car
 * @param {number} carId - The car ID
 * @param {Array} periods - Array of date ranges {startDate, endDate}
 * @returns {Promise<any>} The response data
 */
export const removeRentalAvailability = ({ carId, periods }) =>
	axios.post("/seller/rental-availability/remove", { carId, periods });

/**
 * Get available dates for a rental car within a specific range
 * @param {number} carId - The car ID
 * @param {string} startDate - Start date (ISO string)
 * @param {string} endDate - End date (ISO string)
 * @returns {Promise<any>} The available date ranges
 */
export const getAvailableDatesInRange = ({ carId, startDate, endDate }) =>
	axios.post("/seller/rental-availability/available-dates", {
		carId,
		startDate,
		endDate,
	});

// Booking Management (Re-export from booking.js for convenience)
export {
	getSellerBookings,
	getSellerBookingById,
	confirmBooking,
	rejectBooking,
	sellerCancelBooking,
	sellerCompleteBooking,
	updateBookingStatus,
	updatePaymentStatus,
	getSellerUpcomingBookings,
	getSellerBookingStats,
} from "./booking";
