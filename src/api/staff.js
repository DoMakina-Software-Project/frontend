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
