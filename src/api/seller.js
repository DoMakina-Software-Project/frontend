import axios from "./axios";

export const createSellerProfile = (formData) =>
	axios.post("/seller/profile", formData);

export const getCars = () => axios.get("/seller/cars");

export const deleteCar = ({ id }) => axios.delete(`/seller/cars/${id}`);

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
