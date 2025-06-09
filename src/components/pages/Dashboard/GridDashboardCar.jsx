import { useApi, useConfirmation } from "../../../hooks";
import { CarCardDash } from ".";
import { useState, useEffect } from "react";
import {
	getCars,
	deleteCar,
	updateIsSold,
	deletePromotion,
} from "../../../api/seller";
import { useNavigate } from "react-router-dom";

export default function GridDashboardCar({ hasPromotionPrice }) {
	const navigate = useNavigate();
	const { showConfirmation } = useConfirmation();
	const [cars, setCars] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [listingType, setListingType] = useState("");
	const [loading, setLoading] = useState(false);
	const [initialLoad, setInitialLoad] = useState(true);

	const { handleApiCall: deletePromotionApiCall } = useApi(deletePromotion, {
		disableSuccessToast: false,
	});
	const { handleApiCall: getCarsApiCalls } = useApi(getCars);

	const { handleApiCall: deleteCarApiCall } = useApi(deleteCar, {
		disableSuccessToast: false,
	});

	const { handleApiCall: updateIsSoldApiCall } = useApi(updateIsSold, {
		disableSuccessToast: false,
	});

	const fetchCars = async (page, type) => {
		setLoading(true);
		try {
			const data = await getCarsApiCalls({ page, listingType: type });
			setCars(data.results);
			setTotalPages(data.totalPages);
			setInitialLoad(false);
		} catch (error) {
			console.error("Error fetching cars:", error);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchCars(currentPage, listingType);
	}, [currentPage, listingType]);

	const handlePageChange = (newPage) => {
		setCurrentPage(newPage);
		window.scrollTo(0, 0);
	};

	const handleListingTypeChange = (type) => {
		setListingType(type);
		setCurrentPage(1);
	};

	const handleDeleteCar = (id) => {
		const car = cars.find((c) => c.id === id);
		showConfirmation({
			title: "Hide Car",
			message: `Are you sure you want to hide "${car?.brand} ${car?.model} (${car?.year})"? This will remove the car from all listings.`,
			confirmText: "Yes, Hide",
			cancelText: "Cancel",
			onConfirm: () => {
				deleteCarApiCall({ id }).then(() => {
					setCars((prev) => prev.filter((car) => car.id !== id));
				});
			},
		});
	};

	const handleIsSold = (id, currentStatus) => {
		const newStatus = currentStatus === "SOLD" ? "ACTIVE" : "SOLD";
		const car = cars.find((c) => c.id === id);

		const action =
			currentStatus === "SOLD" ? "mark as available" : "mark as sold";

		showConfirmation({
			title:
				currentStatus === "SOLD"
					? "Mark Car as Available"
					: "Mark Car as Sold",
			message: `Are you sure you want to ${action} "${car?.brand} ${car?.model} (${car?.year})"?`,
			confirmText: `Yes, ${currentStatus === "SOLD" ? "Mark as Available" : "Mark as Sold"}`,
			cancelText: "Cancel",
			onConfirm: () => {
				updateIsSoldApiCall({ id, status: newStatus }).then((data) => {
					if (data)
						setCars((prev) =>
							prev.map((car) => {
								if (car.id === id) {
									return { ...car, status: newStatus };
								}
								return car;
							}),
						);
				});
			},
		});
	};

	const handlePromote = (id, promoted) => {
		if (promoted) {
			const car = cars.find((c) => c.id === id);
			showConfirmation({
				title: "Remove Promotion",
				message: `Are you sure you want to remove the promotion for "${car?.brand} ${car?.model} (${car?.year})"?`,
				confirmText: "Yes, Remove",
				cancelText: "Cancel",
				onConfirm: () => {
					deletePromotionApiCall({ id }).then((data) => {
						if (data)
							setCars((prev) =>
								prev.map((car) =>
									car.id === id
										? { ...car, promoted: !car.promoted }
										: car,
								),
							);
					});
				},
			});
		} else {
			navigate(`/seller/promotion/${id}`);
		}
	};

	const handleManageAvailability = (carId) => {
		navigate(`/seller/car-details/${carId}`);
	};

	const getEmptyStateMessage = () => {
		if (listingType === "SALE") {
			return "No cars for sale yet.";
		} else if (listingType === "RENT") {
			return "No cars for rent yet.";
		}
		return "No cars listed yet.";
	};

	const getActionButtonText = () => {
		if (listingType === "RENT") {
			return "List a Car for Rent";
		}
		return "List a Car for Sale";
	};

	return (
		<div className="flex w-full flex-col items-center justify-center gap-6 px-6 lg:px-14">
			<div className="flex w-full max-w-7xl flex-col items-center justify-center gap-6">
				{/* Listing Type Filter - Always visible */}
				<div className="flex w-full items-center justify-start gap-4">
					<button
						onClick={() => handleListingTypeChange("")}
						className={`rounded-lg px-4 py-2 text-sm font-medium ${
							listingType === ""
								? "bg-blue-100 text-blue-700"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						All
					</button>
					<button
						onClick={() => handleListingTypeChange("SALE")}
						className={`rounded-lg px-4 py-2 text-sm font-medium ${
							listingType === "SALE"
								? "bg-blue-100 text-blue-700"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						For Sale
					</button>
					<button
						onClick={() => handleListingTypeChange("RENT")}
						className={`rounded-lg px-4 py-2 text-sm font-medium ${
							listingType === "RENT"
								? "bg-blue-100 text-blue-700"
								: "bg-gray-100 text-gray-700 hover:bg-gray-200"
						}`}
					>
						For Rent
					</button>
				</div>

				{loading ? (
					<div className="flex h-96 items-center justify-center">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
					</div>
				) : cars.length === 0 ? (
					<div className="flex w-full flex-col items-center justify-center space-y-6 py-12">
						<h2 className="text-center text-xl font-semibold text-gray-700">
							{getEmptyStateMessage()}
						</h2>
						<button
							onClick={() => {
								navigate(
									`list-car?type=${listingType || "SALE"}`,
								);
							}}
							className="flex items-center gap-2 rounded bg-blue-100 px-4 py-2 font-semibold text-blue-700 duration-150 hover:bg-blue-500 hover:text-white"
						>
							{getActionButtonText()}
						</button>
					</div>
				) : (
					<>
						{/* Car Cards Grid */}
						<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
							{cars.map((car) => (
								<CarCardDash
									key={car.id}
									car={car}
									hasPromotionPrice={hasPromotionPrice}
									onDelete={() => handleDeleteCar(car.id)}
									onEdit={() =>
										navigate(`/edit-car/${car.id}`)
									}
									onPromote={() => {
										handlePromote(car.id, car.promoted);
									}}
									updateIsSold={() =>
										handleIsSold(car.id, car.status)
									}
									onImageClick={() => {
										navigate(
											`/seller/car-details/${car.id}`,
										);
									}}
									onManageAvailability={() =>
										handleManageAvailability(car.id)
									}
								/>
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div className="flex items-center justify-center gap-2">
								<button
									onClick={() =>
										handlePageChange(currentPage - 1)
									}
									disabled={currentPage === 1}
									className={`rounded-lg px-4 py-2 text-sm font-medium ${
										currentPage === 1
											? "cursor-not-allowed bg-gray-100 text-gray-400"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									Previous
								</button>
								{Array.from(
									{ length: totalPages },
									(_, i) => i + 1,
								).map((page) => (
									<button
										key={page}
										onClick={() => handlePageChange(page)}
										className={`rounded-lg px-4 py-2 text-sm font-medium ${
											currentPage === page
												? "bg-blue-100 text-blue-700"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}
									>
										{page}
									</button>
								))}
								<button
									onClick={() =>
										handlePageChange(currentPage + 1)
									}
									disabled={currentPage === totalPages}
									className={`rounded-lg px-4 py-2 text-sm font-medium ${
										currentPage === totalPages
											? "cursor-not-allowed bg-gray-100 text-gray-400"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}
								>
									Next
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
