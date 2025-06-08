import { CarCard } from "../Search";
import { useState, useEffect } from "react";
import { getUserWishlist, removeFromWishlist } from "../../../api/client";
import { useApi } from "../../../hooks";

export default function WishlistGrid() {
	const [cars, setCars] = useState([]);

	const { handleApiCall: getUserWishlistApiCall } = useApi(getUserWishlist);
	const { handleApiCall: removeFromWishlistApiCall } = useApi(removeFromWishlist);

	const removeWishlistCar = (carId) => {
		removeFromWishlistApiCall(carId).then(() => {
			setCars((prevCars) => prevCars.filter((car) => car.Car.id !== carId));
		});
	};

	useEffect(() => {
		getUserWishlistApiCall().then((data) => {
			if (data) {
				setCars(data);
			}
		});
	}, []);

	return cars.length === 0 ? (
		<div className="flex w-full items-center justify-center px-6 lg:px-14">
			<div className="flex w-full max-w-7xl flex-col items-center justify-center">
				<h2 className="text-center text-2xl font-semibold text-gray-700">
					No wishlist items found. Start adding your favorite cars!
				</h2>
			</div>
		</div>
	) : (
		<div className="flex w-full items-center justify-center px-6 lg:px-14">
			<div className="flex w-full max-w-7xl flex-col items-center justify-center">
				{/* Wishlist Car Cards Grid */}
				<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
					{cars.map((wishlistItem, index) => (
						<CarCard
							key={index}
							car={wishlistItem.Car}
							removeWishlistCar={removeWishlistCar}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
