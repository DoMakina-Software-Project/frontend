import axios from "./axios";

//Brands
export const getBrands = (page = 1) => axios.get("/staff/brands", { params: { page } });

export const createBrand = (formData) =>
	axios.post("/staff/brands", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const updateBrand = ({ id, formData }) =>
	axios.put(`/staff/brands/${id}`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

export const getBrand = ({ id }) => axios.get(`/staff/brands/${id}`);

export const deleteBrand = ({ id }) => axios.delete(`/staff/brands/${id}`);
export const getPromotionPrice = () => axios.get("/staff/promotion-prices");

export const createPromotionPrice = ({ price }) =>
	axios.post("/staff/promotion-prices", { price });

export const updatePromotionPrice = ({ price }) =>
	axios.put(`/staff/promotion-prices`, { price });

export const getDashboardData = () => axios.get("/staff/dashboard");

// Car Verification
export const getUnverifiedCars = ({
	page = 1,
	limit = 10,
	status = "PENDING",
}) =>
	axios.get(
		`/staff/cars/unverified?page=${page}&limit=${limit}&status=${status}`,
	);

export const getCarForVerification = ({ id }) =>
	axios.get(`/staff/cars/${id}/verification`);

export const approveCar = ({ id }) => axios.put(`/staff/cars/${id}/approve`);

export const rejectCar = ({ id, reason }) =>
	axios.put(`/staff/cars/${id}/reject`, { reason });

export const getVerificationStats = () =>
	axios.get("/staff/cars/verification/stats");
