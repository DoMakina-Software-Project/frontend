import axios from "./axios";

// Wishlist operations
export const getUserWishlist = (page = 1) => 
	axios.get("/client/wishlist", { params: { page } });

export const addToWishlist = (carId) => 
	axios.post("/client/wishlist", { carId });

export const removeFromWishlist = (carId) => 
	axios.delete(`/client/wishlist/${carId}`);

export const isCarInWishlist = (carId) => 
	axios.get(`/client/wishlist/check/${carId}`);

export const clearWishlist = () => 
	axios.delete("/client/wishlist");
