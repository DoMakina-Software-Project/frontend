import axios from "./axios";

// Staff Management
export const getAllStaff = ({ page = 1 }) =>
	axios.get("/admin/staff", { params: { page } });

export const createStaff = (staffData) => axios.post("/admin/staff", staffData);

export const getStaffById = ({ id }) => axios.get(`/admin/staff/${id}`);

export const updateStaff = ({ id, data }) =>
	axios.put(`/admin/staff/${id}`, data);

export const deleteStaff = ({ id }) => axios.delete(`/admin/staff/${id}`);
