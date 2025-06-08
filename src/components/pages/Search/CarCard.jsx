import { useState, useEffect } from "react";
import { BsBookmarkDash, BsBookmarkDashFill } from "react-icons/bs";
import CarExampleImage from "../../../assets/images/car-example.png";
import { useNavigate } from "react-router-dom";
import { addToWishlist, removeFromWishlist, isCarInWishlist } from "../../../api/client";
import { useApi } from "../../../hooks";

const CarCard = ({ car, removeWishlistCar = () => {} }) => {
	const navigate = useNavigate();

	const [isInWishlist, setIsInWishlist] = useState(false);

	const { handleApiCall: addToWishlistApiCall } = useApi(addToWishlist);
	const { handleApiCall: removeFromWishlistApiCall } = useApi(removeFromWishlist);
	const { handleApiCall: isCarInWishlistApiCall } = useApi(isCarInWishlist);

	useEffect(() => {
		if (car?.id) {
			isCarInWishlistApiCall(car.id).then((data) => {
				if (data) {
					setIsInWishlist(data.isInWishlist);
				}
			}).catch(() => {
				// If user is not authenticated, default to false
				setIsInWishlist(false);
			});
		}
	}, [car?.id]);

	const toggleFavorite = () => {
		if (isInWishlist) {
			removeFromWishlistApiCall(car.id).then(() => {
				setIsInWishlist(false);
				removeWishlistCar(car.id);
			}).catch(() => {
				// Handle error - maybe show a toast
			});
		} else {
			addToWishlistApiCall(car.id).then(() => {
				setIsInWishlist(true);
			}).catch(() => {
				// Handle error - maybe show a toast or redirect to login
			});
		}
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
