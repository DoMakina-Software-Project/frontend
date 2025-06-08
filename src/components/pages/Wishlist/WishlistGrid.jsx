import { CarCard } from "../Search";
import { useState, useEffect } from "react";
import { getUserWishlist, removeFromWishlist } from "../../../api/client";
import { useApi, useConfirmation } from "../../../hooks";

export default function WishlistGrid() {
	const { showConfirmation } = useConfirmation();

	const [cars, setCars] = useState([]);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [page, setPage] = useState(1);
	const [totalItems, setTotalItems] = useState(0);

	const { handleApiCall: getUserWishlistApiCall, loading } =
		useApi(getUserWishlist);
	const { handleApiCall: removeFromWishlistApiCall } =
		useApi(removeFromWishlist);

	const removeWishlistCar = (carId) => {
		const car = cars.find((c) => c.id === carId);

		showConfirmation({
			title: "Remove from Wishlist",
			message: `Are you sure you want to remove "${car?.Brand?.name} ${car?.model} (${car?.year})" from your wishlist?`,
			confirmText: "Yes, Remove",
			cancelText: "Cancel",
			onConfirm: async () => {
				await removeFromWishlistApiCall(carId);
				setCars((prevCars) =>
					prevCars.filter((car) => car.id !== carId),
				);
				setTotalItems((prev) => prev - 1);
			},
		});
	};

	const loadMoreWishlist = () => {
		setPage((prevPage) => prevPage + 1);
	};

	// Load initial wishlist data
	useEffect(() => {
		setPage(1);
		getUserWishlistApiCall(1).then((data) => {
			if (data) {
				setCars(data.results || []);
				setHasNextPage(data.hasNextPage);
				setTotalItems(data.totalItems);
			}
		});
	}, []);

	// Load more data when page changes
	useEffect(() => {
		if (page > 1) {
			getUserWishlistApiCall(page).then((data) => {
				if (data) {
					setCars((prev) => [...prev, ...data.results]);
					setHasNextPage(data.hasNextPage);
					setTotalItems(data.totalItems);
				}
			});
		}
	}, [page]);

	// Loading state for initial load
	if (loading && cars.length === 0) {
		return (
			<div className="flex w-full items-center justify-center px-6 lg:px-14">
				<div className="flex w-full max-w-7xl flex-col items-center justify-center">
					<div className="text-center">
						<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
						<p className="text-gray-600">
							Loading your wishlist...
						</p>
					</div>
				</div>
			</div>
		);
	}

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
				{/* Results Info */}
				<div className="mb-4 flex w-full items-center justify-between">
					<div className="text-sm text-gray-600">
						{totalItems > 0 && (
							<span>
								Showing {cars.length} of {totalItems} items in
								your wishlist
							</span>
						)}
					</div>
				</div>

				{/* Wishlist Car Cards Grid */}
				<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
					{cars.map((wishlistItem, index) => (
						<CarCard
							key={`${wishlistItem.id}-${index}`}
							car={wishlistItem.Car}
							removeWishlistCar={removeWishlistCar}
						/>
					))}
				</div>

				{/* Load More Button */}
				{hasNextPage && (
					<div className="mt-8 flex justify-center">
						<button
							onClick={loadMoreWishlist}
							className="rounded-full bg-theme-blue px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
							disabled={loading}
						>
							{loading ? "Loading..." : "Load More"}
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
