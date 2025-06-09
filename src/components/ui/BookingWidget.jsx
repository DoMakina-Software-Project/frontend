import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "./";
import { createBooking, checkBookingAvailability } from "../../api/booking";
import { useApi, useAuth, useConfirmation } from "../../hooks";
import { FaCalendarAlt, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";

const BookingWidget = ({ car, initialDates }) => {
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const { showConfirmation } = useConfirmation();
	const [startDate, setStartDate] = useState(initialDates?.startDate || "");
	const [endDate, setEndDate] = useState(initialDates?.endDate || "");
	const [paymentMethod, setPaymentMethod] = useState("CASH");
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalDays, setTotalDays] = useState(0);
	const [showBookingModal, setShowBookingModal] = useState(false);
	const [isAvailable, setIsAvailable] = useState(null);

	// API hooks
	const {
		handleApiCall: checkAvailabilityApiCall,
		loading: loadingAvailability,
	} = useApi(checkBookingAvailability);

	const { handleApiCall: createBookingApiCall, loading: loadingBooking } =
		useApi(createBooking, {
			disableSuccessToast: false,
			successMessage: "Booking created successfully!",
		});

	// Update dates when initialDates prop changes
	useEffect(() => {
		if (initialDates?.startDate && initialDates?.endDate) {
			setStartDate(initialDates.startDate);
			setEndDate(initialDates.endDate);
		}
	}, [initialDates]);

	useEffect(() => {
		if (startDate && endDate) {
			calculatePrice();
			checkAvailability();
		} else {
			setTotalPrice(0);
			setTotalDays(0);
			setIsAvailable(null);
		}
	}, [startDate, endDate, car]);

	const calculatePrice = () => {
		if (!startDate || !endDate || !car) return;

		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

		setTotalDays(diffDays);
		setTotalPrice(parseFloat((car.price * diffDays).toFixed(2)));
	};

	const checkAvailability = async () => {
		if (!startDate || !endDate || !car) return;

		const data = await checkAvailabilityApiCall({
			carId: car.id,
			startDate,
			endDate,
		});

		if (data) {
			setIsAvailable(data.isAvailable);
		} else {
			setIsAvailable(false);
		}
	};

	const handleBookNow = () => {
		if (!currentUser) {
			toast.error("Please login to make a booking");
			navigate("/login");
			return;
		}

		if (currentUser.id === car.sellerId) {
			toast.error("You cannot book your own car");
			return;
		}

		if (!startDate || !endDate) {
			toast.error("Please select pickup and return dates");
			return;
		}

		if (isAvailable === false) {
			toast.error("Selected dates are not available");
			return;
		}

		setShowBookingModal(true);
	};

	const handleConfirmBooking = async () => {
		if (!startDate || !endDate || !currentUser) return;

		showConfirmation({
			title: "Confirm Booking",
			message: `Are you sure you want to book this ${car.brand} ${car.model} for ${totalDays} day${totalDays > 1 ? "s" : ""} at $${totalPrice}?`,
			confirmText: "Yes, Book Now",
			cancelText: "Cancel",
			onConfirm: async () => {
				const data = await createBookingApiCall({
					carId: car.id,
					startDate,
					endDate,
					paymentMethod,
				});

				if (data) {
					setShowBookingModal(false);
					navigate("/client/bookings");
				}
			},
		});
	};

	const getMinDate = () => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	};

	const getMaxDate = () => {
		const today = new Date();
		const maxDate = new Date(today);
		maxDate.setMonth(maxDate.getMonth() + 6);
		return maxDate.toISOString().split("T")[0];
	};

	if (!car || car.listingType !== "RENT") {
		return null;
	}

	return (
		<div className="space-y-6">
			{/* Price Display */}
			<div className="rounded-lg bg-theme-blue p-4 text-white">
				<h3 className="text-xl font-bold">${car.price}/day</h3>
				<p className="text-blue-100">Available for rent</p>
			</div>

			{/* Date Selection */}
			<div className="space-y-4">
				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Pickup Date
					</label>
					<input
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						min={getMinDate()}
						max={getMaxDate()}
						className="w-full rounded-lg border border-gray-300 p-3 focus:border-theme-blue focus:outline-none"
					/>
				</div>

				<div>
					<label className="mb-2 block text-sm font-medium text-gray-700">
						Return Date
					</label>
					<input
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						min={startDate || getMinDate()}
						max={getMaxDate()}
						className="w-full rounded-lg border border-gray-300 p-3 focus:border-theme-blue focus:outline-none"
					/>
				</div>
			</div>

			{/* Availability Status */}
			{startDate && endDate && (
				<div className="rounded-lg border p-3">
					{loadingAvailability ? (
						<div className="flex items-center gap-2 text-gray-600">
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-theme-blue border-t-transparent"></div>
							Checking availability...
						</div>
					) : isAvailable === true ? (
						<div className="flex items-center gap-2 text-green-600">
							<FaCheckCircle />
							Available for selected dates
						</div>
					) : isAvailable === false ? (
						<div className="flex items-center gap-2 text-red-600">
							<FaInfoCircle />
							Not available for selected dates
						</div>
					) : null}
				</div>
			)}

			{/* Price Calculation */}
			{totalPrice > 0 && (
				<div className="rounded-lg border border-gray-200 p-4">
					<h4 className="mb-3 font-semibold text-gray-900">
						Price Breakdown
					</h4>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span>
								${car.price} × {totalDays} days
							</span>
							<span>${totalPrice}</span>
						</div>
						<hr />
						<div className="flex justify-between font-semibold">
							<span>Total</span>
							<span className="text-theme-blue">
								${totalPrice}
							</span>
						</div>
					</div>
				</div>
			)}

			{/* Book Now Button */}
			<Button
				onClick={handleBookNow}
				disabled={
					!startDate ||
					!endDate ||
					isAvailable === false ||
					loadingAvailability
				}
				className="w-full"
				size="large"
			>
				<FaCalendarAlt className="mr-2" />
				{currentUser ? "Book Now" : "Login to Book"}
			</Button>

			{/* Info */}
			<div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
				<div className="flex items-start gap-2">
					<FaInfoCircle className="mt-0.5 flex-shrink-0" />
					<div>
						<p className="mb-1 font-medium">Booking Information:</p>
						<ul className="space-y-1 text-blue-700">
							<li>• Free cancellation before pickup</li>
							<li>• Owner will confirm your booking</li>
							<li>• Payment on pickup or through PayPal</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Booking Confirmation Modal */}
			<Modal
				isOpen={showBookingModal}
				onClose={() => setShowBookingModal(false)}
				title="Confirm Booking"
				size="medium"
			>
				<div className="space-y-6">
					{/* Booking Summary */}
					<div className="rounded-lg border border-gray-200 p-4">
						<h3 className="mb-3 font-semibold text-gray-900">
							Booking Summary
						</h3>
						<div className="space-y-2">
							<div className="flex justify-between">
								<span>Car:</span>
								<span className="font-medium">
									{car.brand?.name} {car.model}
								</span>
							</div>
							<div className="flex justify-between">
								<span>Pickup Date:</span>
								<span className="font-medium">
									{new Date(startDate).toLocaleDateString()}
								</span>
							</div>
							<div className="flex justify-between">
								<span>Return Date:</span>
								<span className="font-medium">
									{new Date(endDate).toLocaleDateString()}
								</span>
							</div>
							<div className="flex justify-between">
								<span>Duration:</span>
								<span className="font-medium">
									{totalDays} days
								</span>
							</div>
							<hr />
							<div className="flex justify-between font-semibold">
								<span>Total Price:</span>
								<span className="text-theme-blue">
									${totalPrice}
								</span>
							</div>
						</div>
					</div>

					{/* Payment Method */}
					<div>
						<label className="mb-2 block text-sm font-medium text-gray-700">
							Payment Method
						</label>
						<select
							value={paymentMethod}
							onChange={(e) => setPaymentMethod(e.target.value)}
							className="w-full rounded-lg border border-gray-300 p-3 focus:border-theme-blue focus:outline-none"
						>
							<option value="CASH">Cash on Pickup</option>
							<option value="PAYPAL">PayPal</option>
						</select>
					</div>

					{/* Buttons */}
					<div className="flex gap-3">
						<Button
							variant="outline"
							onClick={() => setShowBookingModal(false)}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirmBooking}
							disabled={loadingBooking}
							className="flex-1"
						>
							{loadingBooking ? "Creating..." : "Confirm Booking"}
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default BookingWidget;
