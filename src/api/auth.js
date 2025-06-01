import axios from "./axios";

export const login = ({ email, password }) =>
	axios.post("/auth/login", { email, password });

export const register = ({
	name,
	surname,
	email,
	password,
	confirmPassword,
	acceptTerms,
}) =>
	axios.post("/auth/register", {
		name,
		surname,
		email,
		password,
		confirmPassword,
		acceptTerms,
	});

export const getUser = () => axios.get("/auth/user");

export const logout = () => axios.get("/auth/logout");

export const verifyEmail = ({ token }) =>
	axios.get(`/auth/verify-email/${token}`);

export const generateEmailVerificationToken = () =>
	axios.get("/auth/generate-email-verification-token");

export const forgetPassword = ({ email }) =>
	axios.post("/auth/forget-password", { email });

export const resetPassword = ({ token, password, confirmPassword }) =>
	axios.post(`/auth/reset-password`, { password, confirmPassword, token });
