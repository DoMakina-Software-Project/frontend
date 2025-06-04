import axios from "./axios";

export const createSellerProfile = (formData) =>
	axios.post("/seller/profile", formData);

export const getCars = () => axios.get("/seller/cars");

export const deleteCar = ({ id }) => axios.delete(`/seller/cars/${id}`);

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
