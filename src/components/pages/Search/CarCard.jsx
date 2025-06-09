import { useState, useEffect } from "react";
import { BsBookmarkDash, BsBookmarkDashFill } from "react-icons/bs";
import CarExampleImage from "../../../assets/images/car-example.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
	addToWishlist,
	removeFromWishlist,
	isCarInWishlist,
} from "../../../api/client";
import { useApi, useAuth } from "../../../hooks";

const CarCard = ({ car, removeWishlistCar = () => {} }) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { currentUser, selectedRole } = useAuth();

	const [isInWishlist, setIsInWishlist] = useState(false);

	const { handleApiCall: addToWishlistApiCall } = useApi(addToWishlist);
	const { handleApiCall: removeFromWishlistApiCall } =
		useApi(removeFromWishlist);
	const { handleApiCall: isCarInWishlistApiCall } = useApi(isCarInWishlist);

	// Check if user is logged in and has CLIENT role
	const isClient = currentUser && selectedRole === "CLIENT";

	useEffect(() => {
		// Only check wishlist status if user is a client
		if (isClient && car?.id) {
			isCarInWishlistApiCall(car.id)
				.then((data) => {
					if (data) {
						setIsInWishlist(data.isInWishlist);
					}
				})
				.catch(() => {
					setIsInWishlist(false);
				});
		} else {
			setIsInWishlist(false);
		}
	}, [car?.id, isClient]);

	const toggleFavorite = () => {
		// Only allow wishlist operations for clients
		if (!isClient) {
			navigate("/login");
			return;
		}

		if (isInWishlist) {
			removeFromWishlistApiCall(car.id)
				.then(() => {
					setIsInWishlist(false);
					removeWishlistCar(car.id);
				})
				.catch(() => {
					// Handle error - maybe show a toast
				});
		} else {
			addToWishlistApiCall(car.id)
				.then(() => {
					setIsInWishlist(true);
				})
				.catch(() => {
					// Handle error - maybe show a toast
				});
		}
	};

	return (
		<div className="overflow-hidden rounded-xl bg-white">
			<div className="relative">
				<img
					src={car?.images?.[0] || CarExampleImage}
					alt={car?.brand}
					className="h-72 w-full cursor-pointer object-cover"
					onClick={() => {
						// For rental cars, include the search dates in the URL
						if (car?.listingType === "RENT") {
							const startDate = searchParams.get("startDate");
							const endDate = searchParams.get("endDate");
							if (startDate && endDate) {
								navigate(
									`/car/${car.id}?startDate=${startDate}&endDate=${endDate}`,
								);
							} else {
								navigate(`/car/${car.id}`);
							}
						} else {
							navigate(`/car/${car.id}`);
						}
					}}
				/>
				{/* Only show wishlist button for logged-in clients */}
				{isClient && (
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
				)}
			</div>
			<div className="p-4">
				<div className="mb-2 flex items-start justify-between">
					<div>
						<h3 className="font-medium">{car?.brand}</h3>
						<p className="text-sm text-gray-500">{car?.model}</p>
					</div>
					<span className="font-semibold">
						{car?.price?.toLocaleString()}$
						{car?.listingType === "RENT" && (
							<span className="text-sm text-gray-500">/day</span>
						)}
					</span>
				</div>
				<div className="flex gap-2">
					{car?.promoted && (
						<span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-600">
							Promoted
						</span>
					)}
					{car?.listingType === "RENT" && (
						<span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600">
							For Rent
						</span>
					)}
					{car?.listingType === "SALE" && (
						<span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-600">
							For Sale
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default CarCard;
