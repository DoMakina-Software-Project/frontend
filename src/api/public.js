import axios from "./axios";

export const getCar = (id) => axios.get(`/public/cars/${id}`);

export const fetchCars = () => axios.get("/public/cars");

export const fetchFiveLatestPromotionCars = () =>
	axios.get("/public/cars/latest-promotions");

export const searchCars = ({ minPrice, maxPrice, brandIds, page }) =>
	axios.get("/public/cars/search", {
		params: {
			minPrice,
			maxPrice,
			brandIds,
			page,
		},
	});

export const fetchBrands = () => axios.get("/public/brands");

export const fetchHomeCars = () => axios.get("/public/cars/home");

export const getAllBrands = () => axios.get("/public/brands");

export const getWishlistCars = ({ ids }) =>
	axios.get("/public/cars/wishlist", {
		params: {
			ids,
		},
	});

export const getPromotionPrice = () => axios.get(`/public/promotion-price`);
