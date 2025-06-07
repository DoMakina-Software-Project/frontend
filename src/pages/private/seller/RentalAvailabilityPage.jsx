import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "../../../components/layouts";
import {
	DateRangePicker,
	AvailabilityPeriodsList,
	Button,
} from "../../../components/ui";
import {
	getCars,
	addRentalAvailability,
	removeRentalAvailability,
	getAvailableDatesInRange,
} from "../../../api/seller";
import { useApi } from "../../../hooks";
import {
	FaCar,
	FaArrowLeft,
	FaCalendarAlt,
	FaInfoCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

const RentalAvailabilityPage = () => {
	const { carId } = useParams();
	const navigate = useNavigate();

	const [selectedCar, setSelectedCar] = useState(null);
	const [cars, setCars] = useState([]);
	const [availabilityPeriods, setAvailabilityPeriods] = useState([]);
	const [showDateRange, setShowDateRange] = useState({ start: "", end: "" });

	// API hooks
	const { handleApiCall: getCarsApiCall, loading: loadingCars } =
		useApi(getCars);
	const { handleApiCall: addAvailabilityApiCall, loading: loadingAdd } =
		useApi(addRentalAvailability, {
			disableSuccessToast: false,
			successMessage: "Availability period added successfully!",
		});
	const { handleApiCall: removeAvailabilityApiCall, loading: loadingRemove } =
		useApi(removeRentalAvailability, {
			disableSuccessToast: false,
			successMessage: "Availability period removed successfully!",
		});
	const {
		handleApiCall: getAvailabilityApiCall,
		loading: loadingAvailability,
	} = useApi(getAvailableDatesInRange);

	// Fetch cars on component mount
	useEffect(() => {
		fetchCars();
	}, []);

	// Fetch availability when car is selected
	useEffect(() => {
		if (selectedCar && selectedCar.listingType === "RENT") {
			fetchAvailability();
		}
	}, [selectedCar]);

	// Set selected car from URL parameter
	useEffect(() => {
		if (carId && cars.length > 0) {
			const car = cars.find((c) => c.id === parseInt(carId));
			if (car && car.listingType === "RENT") {
				setSelectedCar(car);
			} else if (car && car.listingType !== "RENT") {
				toast.error("This car is not listed for rent");
				navigate("/seller");
			}
		}
	}, [carId, cars, navigate]);

	const fetchCars = async () => {
		const data = await getCarsApiCall();
		if (data) {
			// Filter only rental cars
			const rentalCars = data.filter((car) => car.listingType === "RENT");
			setCars(rentalCars);
		}
	};

	const fetchAvailability = async () => {
		if (!selectedCar) return;

		// Get availability for the next 12 months
		const startDate = new Date();
		const endDate = new Date();
		endDate.setFullYear(endDate.getFullYear() + 1);

		setShowDateRange({
			start: startDate.toISOString().split("T")[0],
			end: endDate.toISOString().split("T")[0],
		});

		const data = await getAvailabilityApiCall({
			carId: selectedCar.id,
			startDate: startDate.toISOString().split("T")[0],
			endDate: endDate.toISOString().split("T")[0],
		});

		if (data) {
			setAvailabilityPeriods(data);
		}
	};

	const handleAddAvailability = async (dateRange) => {
		if (!selectedCar) return;

		const data = await addAvailabilityApiCall({
			carId: selectedCar.id,
			periods: [dateRange],
		});

		if (data) {
			await fetchAvailability();
		}
	};

	const handleRemoveAvailability = async (period) => {
		if (!selectedCar) return;

		const data = await removeAvailabilityApiCall({
			carId: selectedCar.id,
			periods: [period],
		});

		if (data) {
			await fetchAvailability();
		}
	};

	const handleCarSelection = (car) => {
		setSelectedCar(car);
		navigate(`/seller/rental-availability/${car.id}`);
	};

	const renderCarSelector = () => (
		<div className="mb-8">
			<h2 className="mb-4 text-xl font-semibold text-gray-800">
				Select Rental Car
			</h2>
			{loadingCars ? (
				<div className="flex items-center justify-center py-8">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
				</div>
			) : cars.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
					<FaCar className="mx-auto mb-3 text-4xl text-gray-400" />
					<p className="text-gray-600">No rental cars found</p>
					<p className="mb-6 text-sm text-gray-500">
						You need to have cars listed for rent to manage
						availability.
					</p>
					<Button onClick={() => navigate("/seller/list-car")}>
						List a Car for Rent
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{cars.map((car) => (
						<div
							key={car.id}
							onClick={() => handleCarSelection(car)}
							className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
								selectedCar?.id === car.id
									? "border-theme-blue bg-blue-50"
									: "border-gray-200 hover:border-gray-300"
							}`}
						>
							<div className="mb-3">
								{car.images && car.images.length > 0 ? (
									<img
										src={car.images[0]}
										alt={`${car.brand?.name} ${car.model}`}
										className="h-32 w-full rounded-md object-cover"
									/>
								) : (
									<div className="flex h-32 items-center justify-center rounded-md bg-gray-200">
										<FaCar className="text-4xl text-gray-400" />
									</div>
								)}
							</div>
							<h3 className="font-semibold text-gray-800">
								{car.brand?.name} {car.model}
							</h3>
							<p className="text-sm text-gray-600">{car.year}</p>
							<p className="font-medium text-theme-blue">
								${car.price}/day
							</p>
						</div>
					))}
				</div>
			)}
		</div>
	);

	const renderAvailabilityManagement = () => (
		<div className="space-y-6">
			{/* Car Info Header */}
			<div className="flex items-center gap-4 rounded-lg bg-theme-blue p-4 text-white">
				<div className="flex-shrink-0">
					{selectedCar.images && selectedCar.images.length > 0 ? (
						<img
							src={selectedCar.images[0]}
							alt={`${selectedCar.brand?.name} ${selectedCar.model}`}
							className="h-16 w-16 rounded-md object-cover"
						/>
					) : (
						<div className="flex h-16 w-16 items-center justify-center rounded-md bg-white/20">
							<FaCar className="text-2xl" />
						</div>
					)}
				</div>
				<div>
					<h2 className="text-xl font-semibold">
						{selectedCar.brand?.name} {selectedCar.model} (
						{selectedCar.year})
					</h2>
					<p className="text-blue-100">${selectedCar.price}/day</p>
				</div>
			</div>

			{/* Info Banner */}
			<div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
				<FaInfoCircle className="mt-0.5 text-theme-blue" />
				<div className="text-sm text-blue-800">
					<p className="mb-1 font-medium">
						Availability Management Tips:
					</p>
					<ul className="space-y-1 text-blue-700">
						<li>
							• Add date ranges when your car is available for
							rent
						</li>
						<li>
							• Overlapping periods will be automatically merged
						</li>
						<li>
							• You can remove periods that are no longer
							available
						</li>
						<li>• Past dates cannot be selected</li>
					</ul>
				</div>
			</div>

			{/* Date Range Display */}
			{showDateRange.start && showDateRange.end && (
				<div className="rounded-lg bg-gray-50 p-4">
					<div className="mb-2 flex items-center gap-2">
						<FaCalendarAlt className="text-gray-600" />
						<span className="font-medium text-gray-700">
							Viewing Availability:
						</span>
					</div>
					<p className="text-gray-600">
						{new Date(showDateRange.start).toLocaleDateString()} -{" "}
						{new Date(showDateRange.end).toLocaleDateString()}
					</p>
				</div>
			)}

			{/* Availability Management */}
			<DateRangePicker
				onAddRange={handleAddAvailability}
				onRemoveRange={handleRemoveAvailability}
				disabled={loadingAdd || loadingRemove}
			/>

			{/* Current Availability */}
			{loadingAvailability ? (
				<div className="flex items-center justify-center py-8">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
				</div>
			) : (
				<AvailabilityPeriodsList
					periods={availabilityPeriods}
					onRemovePeriod={handleRemoveAvailability}
					loading={loadingRemove}
				/>
			)}
		</div>
	);

	return (
		<MainLayout mainOptions={{ paddingVertical: false }}>
			<div className="min-h-screen w-full items-center justify-center bg-gray-50">
				<div className="mx-auto max-w-6xl px-6 py-8">
					{/* Header */}
					<div className="mb-8 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/seller")}
								className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-50"
							>
								<FaArrowLeft />
							</button>
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									Rental Availability Management
								</h1>
								<p className="text-gray-600">
									Manage when your rental cars are available
									for booking
								</p>
							</div>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => navigate("/seller/bookings")}
								className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
							>
								<FaCalendarAlt size={16} />
								View Bookings
							</button>
						</div>
					</div>

					{/* Content */}
					{!selectedCar
						? renderCarSelector()
						: renderAvailabilityManagement()}
				</div>
			</div>
		</MainLayout>
	);
};

export default RentalAvailabilityPage;
