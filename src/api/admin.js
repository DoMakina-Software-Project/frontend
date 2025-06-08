import axios from "./axios";

export const getAllStaff = (page = 1) => axios.get("/admin/staff", { params: { page } });

export const createStaff = (data) => axios.post("/admin/staff", data);

export const updateStaff = ({ id, data }) =>
	axios.put(`/admin/staff/${id}`, data);

export const deleteStaff = ({ id }) => axios.delete(`/admin/staff/${id}`);

export const getStaffById = ({ id }) => {
	return axios.get(`/admin/staff/${id}`);
};
