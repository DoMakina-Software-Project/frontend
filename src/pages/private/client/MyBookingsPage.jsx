import { useState, useEffect, memo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "../../../components/layouts";
import { Button, Modal } from "../../../components/ui";
import {
	getClientBookings,
	getBookingById,
	cancelBooking,
} from "../../../api/booking";
import { createReview, canReviewBooking } from "../../../api/review";
import { useApi, useConfirmation } from "../../../hooks";
import {
	FaCalendarAlt,
	FaCar,
	FaClock,
	FaCheckCircle,
	FaTimesCircle,
	FaExclamationCircle,
	FaEye,
	FaArrowLeft,
	FaUser,
	FaEnvelope,
	FaStar,
} from "react-icons/fa";

const StarRating = memo(({ rating, onRatingChange }) => {
	return (
		<div className="flex items-center gap-1">
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type="button"
					onClick={() => onRatingChange(star)}
					className="focus:outline-none"
				>
					<FaStar
						className={`text-2xl ${
							star <= rating
								? "text-yellow-400"
								: "text-gray-300"
						}`}
					/>
				</button>
			))}
		</div>
	);
});

const ReviewModal = memo(({ isOpen, onClose, booking, onReviewSubmitted }) => {
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");
	const { handleApiCall: createReviewApiCall, loading: loadingReview } =
		useApi(createReview, {
			disableSuccessToast: false,
			successMessage: "Review submitted successfully",
		});

	const handleSubmit = async () => {
		if (booking && rating && comment.trim()) {
			const data = await createReviewApiCall({
				carId: booking.Car.id,
				bookingId: booking.id,
				rating,
				comment: comment.trim(),
			});

			if (data) {
				setRating(5);
				setComment("");
				onClose();
				onReviewSubmitted?.();
			}
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Write a Review"
			size="small"
		>
			<div className="space-y-6">
				<div className="text-center">
					<h4 className="mb-2 text-lg font-semibold">
						{booking?.Car.Brand?.name} {booking?.Car.model}
					</h4>
					<p className="text-sm text-gray-600">
						How was your experience with this car?
					</p>
				</div>

				<div className="flex justify-center">
					<StarRating rating={rating} onRatingChange={setRating} />
				</div>

				<div>
					<label
						htmlFor="comment"
						className="mb-2 block text-sm font-medium text-gray-700"
					>
						Your Review
					</label>
					<textarea
						id="comment"
						rows={4}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						placeholder="Share your experience with this car..."
						className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-theme-blue focus:outline-none"
					/>
				</div>

				<div className="flex gap-3">
					<Button
						variant="primary"
						onClick={handleSubmit}
						disabled={
							loadingReview ||
							!comment.trim() ||
							!rating
						}
						className="flex-1"
					>
						{loadingReview
							? "Submitting..."
							: "Submit Review"}
					</Button>
					<Button
						variant="outline"
						onClick={onClose}
						className="flex-1"
					>
						Cancel
					</Button>
				</div>
			</div>
		</Modal>
	);
});

const MyBookingsPage = () => {
	const navigate = useNavigate();
	const { showConfirmation } = useConfirmation();
	const [searchParams, setSearchParams] = useSearchParams();
	const [bookings, setBookings] = useState([]);
	const [filteredBookings, setFilteredBookings] = useState([]);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [showBookingModal, setShowBookingModal] = useState(false);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [canReview, setCanReview] = useState(false);
	const [statusFilter, setStatusFilter] = useState(
		searchParams.get("status") || "all"
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(6); // Show 6 bookings per page

	// API hooks
	const { handleApiCall: getBookingsApiCall, loading: loadingBookings } =
		useApi(getClientBookings);

	const { handleApiCall: getBookingApiCall } = useApi(getBookingById);

	const { handleApiCall: cancelBookingApiCall, loading: loadingCancel } =
		useApi(cancelBooking, {
			disableSuccessToast: false,
			successMessage: "Booking cancelled successfully",
		});

	const { handleApiCall: canReviewBookingApiCall } = useApi(canReviewBooking);

	useEffect(() => {
		fetchBookings();
	}, []);

	useEffect(() => {
		filterBookings(bookings, statusFilter);
	}, [statusFilter, bookings]);

	const fetchBookings = async () => {
		const data = await getBookingsApiCall();
		if (data) {
			setBookings(data);
			filterBookings(data, statusFilter);
		}
	};

	// Calculate pagination
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

	const filterBookings = (allBookings, filter) => {
		let filtered = allBookings;

		switch (filter) {
			case "active":
				filtered = allBookings.filter((booking) =>
					["PENDING", "CONFIRMED"].includes(booking.status)
				);
				break;
			case "completed":
				filtered = allBookings.filter(
					(booking) => booking.status === "COMPLETED"
				);
				break;
			case "cancelled":
				filtered = allBookings.filter(
					(booking) =>
						booking.status === "CANCELLED" ||
						booking.status === "REJECTED"
				);
				break;
			case "pending":
				filtered = allBookings.filter(
					(booking) => booking.status === "PENDING"
				);
				break;
			case "confirmed":
				filtered = allBookings.filter(
					(booking) => booking.status === "CONFIRMED"
				);
				break;
			default:
				filtered = allBookings;
		}

		setFilteredBookings(filtered);
		setCurrentPage(1); // Reset to first page when filter changes
	};

	const handleStatusFilter = (status) => {
		setStatusFilter(status);
		if (status === "all") {
			searchParams.delete("status");
		} else {
			searchParams.set("status", status);
		}
		setSearchParams(searchParams);
	};

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleViewBooking = async (bookingId) => {
		const data = await getBookingApiCall(bookingId);
		if (data) {
			setSelectedBooking(data);
			setShowBookingModal(true);

			// Check if user can review this booking
			if (data.status === "COMPLETED") {
				const canReviewData = await canReviewBookingApiCall(bookingId);
				setCanReview(canReviewData?.canReview || false);
			}
		}
	};

	const handleCancelBooking = async () => {
		if (selectedBooking) {
			showConfirmation({
				title: "Cancel Booking",
				message: `Are you sure you want to cancel your booking for ${selectedBooking.Car.Brand?.name} ${selectedBooking.Car.model}? This action cannot be undone.`,
				confirmText: "Yes, Cancel",
				cancelText: "Keep Booking",
				onConfirm: async () => {
					const data = await cancelBookingApiCall(selectedBooking.id);
					if (data) {
						setShowBookingModal(false);
						fetchBookings();
					}
				},
			});
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case "PENDING":
				return <FaClock className="text-yellow-500" />;
			case "CONFIRMED":
				return <FaCheckCircle className="text-green-500" />;
			case "COMPLETED":
				return <FaCheckCircle className="text-blue-500" />;
			case "CANCELLED":
			case "REJECTED":
				return <FaTimesCircle className="text-red-500" />;
			default:
				return <FaExclamationCircle className="text-gray-500" />;
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "PENDING":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "CONFIRMED":
				return "bg-green-100 text-green-800 border-green-200";
			case "COMPLETED":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "CANCELLED":
			case "REJECTED":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getPaymentStatusColor = (status) => {
		switch (status) {
			case "PENDING":
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "PAID":
				return "bg-green-100 text-green-800 border-green-200";
			case "REFUNDED":
				return "bg-blue-100 text-blue-800 border-blue-200";
			case "FAILED":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const getActionButtons = (booking) => {
		const buttons = [];

		buttons.push(
			<Button
				key="view"
				size="small"
				variant="outline"
				onClick={() => handleViewBooking(booking.id)}
				className="flex-1"
			>
				<FaEye className="mr-1" size={12} />
				View
			</Button>
		);

		if (booking.status === "PENDING") {
			buttons.push(
				<Button
					key="cancel"
					size="small"
					variant="danger"
					onClick={() => {
						setSelectedBooking(booking);
						handleCancelBooking();
					}}
					className="flex-1"
				>
					Cancel
				</Button>
			);
		}

		return buttons;
	};

	const BookingCard = ({ booking }) => (
		<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
			<div className="mb-4 flex items-start justify-between">
				<div className="flex items-center gap-4">
					{booking.Car.images && booking.Car.images.length > 0 ? (
						<img
							src={booking.Car.images[0]}
							alt={`${booking.Car.Brand?.name} ${booking.Car.model}`}
							className="h-16 w-16 rounded-lg object-cover"
						/>
					) : (
						<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-200">
							<FaCar className="text-2xl text-gray-400" />
						</div>
					)}
					<div>
						<h3 className="text-lg font-semibold text-gray-900">
							{booking.Car.Brand?.name} {booking.Car.model}
						</h3>
						<p className="text-sm text-gray-600">
							{booking.Car.year} • ${booking.Car.price}/day
						</p>
						<p className="text-xs text-gray-500">
							Booking #{booking.id}
						</p>
					</div>
				</div>
				<div className="flex flex-col items-end gap-2">
					<div className="flex items-center gap-2">
						{getStatusIcon(booking.status)}
						<span
							className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(
								booking.status
							)}`}
						>
							{booking.status}
						</span>
					</div>
					<span
						className={`rounded-full border px-3 py-1 text-sm font-medium ${getPaymentStatusColor(
							booking.paymentStatus
						)}`}
					>
						{booking.paymentStatus}
					</span>
				</div>
			</div>

			<div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
				<div>
					<p className="text-xs text-gray-500">Pickup Date</p>
					<p className="font-medium">
						{new Date(booking.startDate).toLocaleDateString()}
					</p>
				</div>
				<div>
					<p className="text-xs text-gray-500">Return Date</p>
					<p className="font-medium">
						{new Date(booking.endDate).toLocaleDateString()}
					</p>
				</div>
				<div>
					<p className="text-xs text-gray-500">Total Price</p>
					<p className="font-medium text-theme-blue">
						${booking.totalPrice}
					</p>
				</div>
				<div>
					<p className="text-xs text-gray-500">Payment Method</p>
					<p className="font-medium">{booking.paymentMethod}</p>
				</div>
			</div>

			<div className="flex gap-2">{getActionButtons(booking)}</div>
		</div>
	);

	const BookingModal = () => {
		if (!selectedBooking) return null;

		return (
			<Modal
				isOpen={showBookingModal}
				onClose={() => setShowBookingModal(false)}
				title="Booking Details"
				size="large"
			>
				<div className="space-y-6">
					{/* Car Information */}
					<div className="rounded-lg border border-gray-200 p-4">
						<h3 className="mb-3 font-semibold text-gray-900">
							Car Information
						</h3>
						<div className="flex items-center gap-4">
							{selectedBooking.Car.CarImages &&
							selectedBooking.Car.CarImages.length > 0 ? (
								<img
									src={selectedBooking.Car.CarImages[0].url}
									alt={`${selectedBooking.Car.Brand?.name} ${selectedBooking.Car.model}`}
									className="h-20 w-20 rounded-lg object-cover"
								/>
							) : (
								<div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-200">
									<FaCar className="text-2xl text-gray-400" />
								</div>
							)}
							<div>
								<h4 className="text-lg font-semibold">
									{selectedBooking.Car.Brand?.name}{" "}
									{selectedBooking.Car.model}
								</h4>
								<p className="text-gray-600">
									{selectedBooking.Car.year}
								</p>
								<p className="font-medium text-theme-blue">
									${selectedBooking.Car.price}/day
								</p>
							</div>
						</div>
					</div>

					{/* Car Owner Information */}
					<div className="rounded-lg border border-gray-200 p-4">
						<h3 className="mb-3 font-semibold text-gray-900">
							Car Owner
						</h3>
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<FaUser className="text-gray-500" />
								<span>{selectedBooking.Car.User?.name}</span>
							</div>
							<div className="flex items-center gap-2">
								<FaEnvelope className="text-gray-500" />
								<span>{selectedBooking.Car.User?.email}</span>
							</div>
						</div>
					</div>

					{/* Booking Details */}
					<div className="rounded-lg border border-gray-200 p-4">
						<h3 className="mb-3 font-semibold text-gray-900">
							Booking Details
						</h3>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-gray-500">
									Booking ID
								</p>
								<p className="font-medium">
									#{selectedBooking.id}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">Status</p>
								<div className="flex items-center gap-2">
									{getStatusIcon(selectedBooking.status)}
									<span
										className={`rounded-full border px-2 py-1 text-sm font-medium ${getStatusColor(
											selectedBooking.status
										)}`}
									>
										{selectedBooking.status}
									</span>
								</div>
							</div>
							<div>
								<p className="text-sm text-gray-500">
									Pickup Date
								</p>
								<p className="font-medium">
									{new Date(
										selectedBooking.startDate
									).toLocaleDateString()}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">
									Return Date
								</p>
								<p className="font-medium">
									{new Date(
										selectedBooking.endDate
									).toLocaleDateString()}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">
									Total Price
								</p>
								<p className="text-lg font-semibold text-theme-blue">
									${selectedBooking.totalPrice}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">
									Payment Method
								</p>
								<p className="font-medium">
									{selectedBooking.paymentMethod}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">
									Payment Status
								</p>
								<span
									className={`rounded-full border px-2 py-1 text-sm font-medium ${getPaymentStatusColor(
										selectedBooking.paymentStatus
									)}`}
								>
									{selectedBooking.paymentStatus}
								</span>
							</div>
							<div>
								<p className="text-sm text-gray-500">
									Booking Date
								</p>
								<p className="font-medium">
									{new Date(
										selectedBooking.createdAt
									).toLocaleDateString()}
								</p>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3">
						{selectedBooking.status === "PENDING" && (
							<Button
								variant="danger"
								onClick={handleCancelBooking}
								disabled={loadingCancel}
								className="flex-1"
							>
								{loadingCancel
									? "Cancelling..."
									: "Cancel Booking"}
							</Button>
						)}
						{canReview && (
							<Button
								variant="primary"
								onClick={() => {
									setShowBookingModal(false);
									setShowReviewModal(true);
								}}
								className="flex-1"
							>
								<FaStar className="mr-2" />
								Leave a Review
							</Button>
						)}
						<Button
							variant="outline"
							onClick={() => setShowBookingModal(false)}
							className="flex-1"
						>
							Close
						</Button>
					</div>
				</div>
			</Modal>
		);
	};

	const PaginationComponent = () => {
		if (totalPages <= 1) return null;

		const pageNumbers = [];
		const maxVisiblePages = 5;
		let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		// Adjust startPage if we're near the end
		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}

		return (
			<div className="flex items-center justify-center space-x-2 mt-8">
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
						currentPage === 1
							? "bg-gray-100 text-gray-400 cursor-not-allowed"
							: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
					}`}
				>
					Previous
				</button>

				{startPage > 1 && (
					<>
						<button
							onClick={() => handlePageChange(1)}
							className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
						>
							1
						</button>
						{startPage > 2 && (
							<span className="px-2 py-2 text-gray-500">...</span>
						)}
					</>
				)}

				{pageNumbers.map((number) => (
					<button
						key={number}
						onClick={() => handlePageChange(number)}
						className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
							currentPage === number
								? "bg-theme-blue text-white"
								: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
						}`}
					>
						{number}
					</button>
				))}

				{endPage < totalPages && (
					<>
						{endPage < totalPages - 1 && (
							<span className="px-2 py-2 text-gray-500">...</span>
						)}
						<button
							onClick={() => handlePageChange(totalPages)}
							className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
						>
							{totalPages}
						</button>
					</>
				)}

				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
						currentPage === totalPages
							? "bg-gray-100 text-gray-400 cursor-not-allowed"
							: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
					}`}
				>
					Next
				</button>
			</div>
		);
	};

	return (
		<MainLayout>
			<div className="flex flex-grow justify-center bg-gray-50">
				<div className="w-full max-w-6xl px-6 py-8 bg-white shadow-lg rounded-lg my-4">
					{/* Header */}
					<div className="mb-8 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/client")}
								className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-50"
							>
								<FaArrowLeft />
							</button>
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									My Bookings
								</h1>
								<p className="text-gray-600">
									Manage your car rental bookings
								</p>
							</div>
						</div>
						<Button onClick={() => navigate("/search")}>
							<FaCar className="mr-2" />
							Book Another Car
						</Button>
					</div>

					{/* Filter Tabs */}
					<div className="mb-6 flex flex-wrap gap-2">
						{[
							{ key: "all", label: "All Bookings" },
							{ key: "active", label: "Active" },
							{ key: "pending", label: "Pending" },
							{ key: "confirmed", label: "Confirmed" },
							{ key: "completed", label: "Completed" },
							{ key: "cancelled", label: "Cancelled" },
						].map((filter) => (
							<button
								key={filter.key}
								onClick={() => handleStatusFilter(filter.key)}
								className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
									statusFilter === filter.key
										? "bg-theme-blue text-white"
										: "bg-white text-gray-600 hover:bg-gray-50"
								}`}
							>
								{filter.label}
							</button>
						))}
					</div>

					{/* Results Summary */}
					{!loadingBookings && filteredBookings.length > 0 && (
						<div className="mb-4 flex items-center justify-between text-sm text-gray-600">
							<span>
								Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBookings.length)} of {filteredBookings.length} bookings
							</span>
							{totalPages > 1 && (
								<span>
									Page {currentPage} of {totalPages}
								</span>
							)}
						</div>
					)}

					{/* Bookings List */}
					{loadingBookings ? (
						<div className="flex items-center justify-center py-12">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
						</div>
					) : filteredBookings.length === 0 ? (
						<div className="rounded-lg bg-white p-12 text-center shadow-sm">
							<FaCalendarAlt className="mx-auto mb-4 text-6xl text-gray-400" />
							<h3 className="mb-2 text-xl font-semibold text-gray-900">
								No bookings found
							</h3>
							<p className="mb-6 text-gray-600">
								{statusFilter === "all"
									? "You haven't made any bookings yet."
									: `No ${statusFilter} bookings found.`}
							</p>
							<Button onClick={() => navigate("/search")}>
								Find Cars to Book
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							{currentBookings.map((booking) => (
								<BookingCard
									key={booking.id}
									booking={booking}
								/>
							))}
						</div>
					)}

					{/* Pagination */}
					<PaginationComponent />
				</div>
			</div>

			{/* Booking Details Modal */}
			<BookingModal />

			{/* Review Modal */}
			<ReviewModal
				isOpen={showReviewModal}
				onClose={() => setShowReviewModal(false)}
				booking={selectedBooking}
				onReviewSubmitted={() => {
					setCanReview(false);
					fetchBookings();
				}}
			/>
		</MainLayout>
	);
};

export default MyBookingsPage;
