import { useState, useEffect } from "react";
import { BsBookmarkDash, BsBookmarkDashFill } from "react-icons/bs";
import { LocalStorageUtils } from "../../../utils";
import CarExampleImage from "../../../assets/images/car-example.png";
import { useNavigate } from "react-router-dom";

const CarCard = ({ car, removeWishlistCar = () => {} }) => {
	const navigate = useNavigate();

	const [isInWishlist, setIsInWishlist] = useState(false);

	useEffect(() => {
		const wishlist = LocalStorageUtils.getItem("wishlist") || [];
		setIsInWishlist(wishlist.includes(car?.id));
	}, [car?.id]);

	const toggleFavorite = () => {
		const wishlist = LocalStorageUtils.getItem("wishlist") || [];
		let newWishlist;
		if (isInWishlist) {
			newWishlist = wishlist.filter((id) => id !== car.id);
			removeWishlistCar(car.id);
		} else {
			newWishlist = [...wishlist, car.id];
		}
		LocalStorageUtils.setItem("wishlist", newWishlist);
		setIsInWishlist(!isInWishlist);
	};

	return (
		<div className="overflow-hidden rounded-xl bg-white">
			<div className="relative">
				<img
					src={car?.images?.[0] || CarExampleImage}
					alt={car?.brand}
					className="h-72 w-full object-cover"
					onClick={() => navigate(`/car/${car.id}`)}
				/>
				<button
					onClick={toggleFavorite}
					className="absolute right-4 top-4 rounded-full bg-white p-2"
				>
					{isInWishlist ? (
						<BsBookmarkDashFill size={20} />
					) : (
						<BsBookmarkDash size={20} />
					)}
				</button>
			</div>
			<div className="p-4">
				<div className="mb-2 flex items-start justify-between">
					<div>
						<h3 className="font-medium">{car?.brand}</h3>
						<p className="text-sm text-gray-500">{car?.model}</p>
					</div>
					<span className="font-semibold">
						{car?.price?.toLocaleString()}$
					</span>
				</div>
				<div className="flex gap-2">
					{car?.promoted && (
						<span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-600">
							Promoted
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default CarCard;
