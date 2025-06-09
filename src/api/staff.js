import axios from "./axios";

//Brands
export const getBrands = (page = 1) =>
	axios.get("/staff/brands", { params: { page } });

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

// User Management (Staff)
export const getAllUsers = ({ page = 1, role = null }) => {
	const params = { page };
	if (role) params.role = role;
	return axios.get("/staff/users", { params });
};

export const getUserById = (id) => axios.get(`/staff/users/${id}`);

export const getUsersByRole = ({ role, page = 1 }) =>
	axios.get(`/staff/users/role/${role}`, { params: { page } });

export const updateUser = ({ id, userData }) =>
	axios.put(`/staff/users/${id}`, userData);

export const updateUserStatus = ({ id, status }) =>
	axios.patch(`/staff/users/${id}/status`, { status });

export const getUserStatistics = () => axios.get("/staff/users/statistics");
