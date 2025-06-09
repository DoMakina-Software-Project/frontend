import axios from "./axios";

// Client booking operations
export const createBooking = (bookingData) =>
	axios.post("/client/bookings", bookingData);

export const getClientBookings = (status = null) => {
	const params = status ? { status } : {};
	return axios.get("/client/bookings", { params });
};

export const getBookingById = (bookingId) =>
	axios.get(`/client/bookings/${bookingId}`);

export const cancelBooking = (bookingId) =>
	axios.patch(`/client/bookings/${bookingId}/cancel`);

export const completeBooking = (bookingId) =>
	axios.patch(`/client/bookings/${bookingId}/complete`);

export const checkBookingAvailability = (availabilityData) =>
	axios.post("/public/bookings/check-availability", availabilityData);

export const getClientUpcomingBookings = () =>
	axios.get("/client/bookings/upcoming", { params: { userType: "client" } });

// Seller booking operations
export const getSellerBookings = (status = null) => {
	const params = status ? { status } : {};
	return axios.get("/seller/bookings", { params });
};

export const getSellerBookingById = (bookingId) =>
	axios.get(`/seller/bookings/${bookingId}`);

export const confirmBooking = (bookingId) =>
	axios.patch(`/seller/bookings/${bookingId}/confirm`);

export const rejectBooking = (bookingId) =>
	axios.patch(`/seller/bookings/${bookingId}/reject`);

export const sellerCancelBooking = (bookingId) =>
	axios.patch(`/seller/bookings/${bookingId}/cancel`);

export const sellerCompleteBooking = (bookingId) =>
	axios.patch(`/seller/bookings/${bookingId}/complete`);

export const updateBookingStatus = ({ bookingId, status }) =>
	axios.patch(`/seller/bookings/${bookingId}/status`, { status });

export const updatePaymentStatus = ({ bookingId, paymentStatus }) =>
	axios.patch(`/seller/bookings/${bookingId}/payment`, { paymentStatus });

export const refundBooking = (bookingId) =>
	axios.patch(`/seller/bookings/${bookingId}/refund`);

export const getSellerUpcomingBookings = () =>
	axios.get("/seller/bookings/upcoming", { params: { userType: "seller" } });

export const getSellerBookingStats = () => axios.get("/seller/bookings/stats");
