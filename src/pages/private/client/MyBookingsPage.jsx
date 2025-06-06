import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MainLayout } from "../../../components/layouts";
import { Button, Modal } from "../../../components/ui";
import {
	getClientBookings,
	getBookingById,
	cancelBooking,
	completeBooking,
} from "../../../api/booking";
import { useApi } from "../../../hooks";
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
} from "react-icons/fa";

const MyBookingsPage = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const [bookings, setBookings] = useState([]);
	const [filteredBookings, setFilteredBookings] = useState([]);
	const [selectedBooking, setSelectedBooking] = useState(null);
	const [showBookingModal, setShowBookingModal] = useState(false);
	const [statusFilter, setStatusFilter] = useState(
		searchParams.get("status") || "all",
	);

	// API hooks
	const { handleApiCall: getBookingsApiCall, loading: loadingBookings } =
		useApi(getClientBookings);

	const { handleApiCall: getBookingApiCall } = useApi(getBookingById);

	const { handleApiCall: cancelBookingApiCall, loading: loadingCancel } =
		useApi(cancelBooking, {
			disableSuccessToast: false,
			successMessage: "Booking cancelled successfully",
		});

	const { handleApiCall: completeBookingApiCall, loading: loadingComplete } =
		useApi(completeBooking, {
			disableSuccessToast: false,
			successMessage: "Booking marked as completed",
		});

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

	const filterBookings = (allBookings, filter) => {
		let filtered = allBookings;

		switch (filter) {
			case "active":
				filtered = allBookings.filter((booking) =>
					["PENDING", "CONFIRMED"].includes(booking.status),
				);
				break;
			case "completed":
				filtered = allBookings.filter(
					(booking) => booking.status === "COMPLETED",
				);
				break;
			case "cancelled":
				filtered = allBookings.filter(
					(booking) =>
						booking.status === "CANCELLED" ||
						booking.status === "REJECTED",
				);
				break;
			case "pending":
				filtered = allBookings.filter(
					(booking) => booking.status === "PENDING",
				);
				break;
			case "confirmed":
				filtered = allBookings.filter(
					(booking) => booking.status === "CONFIRMED",
				);
				break;
			default:
				filtered = allBookings;
		}

		setFilteredBookings(filtered);
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

	const handleViewBooking = async (bookingId) => {
		const data = await getBookingApiCall(bookingId);
		if (data) {
			setSelectedBooking(data);
			setShowBookingModal(true);
		}
	};

	const handleCancelBooking = async () => {
		if (selectedBooking) {
			const data = await cancelBookingApiCall(selectedBooking.id);
			if (data) {
				setShowBookingModal(false);
				fetchBookings();
			}
		}
	};

	const handleCompleteBooking = async () => {
		if (selectedBooking) {
			const data = await completeBookingApiCall(selectedBooking.id);
			if (data) {
				setShowBookingModal(false);
				fetchBookings();
			}
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
			</Button>,
		);

		if (booking.status === "PENDING") {
			buttons.push(
				<Button
					key="cancel"
					size="small"
					variant="danger"
					onClick={() => handleViewBooking(booking.id)}
					className="flex-1"
				>
					Cancel
				</Button>,
			);
		}

		if (booking.status === "CONFIRMED") {
			buttons.push(
				<Button
					key="complete"
					size="small"
					variant="success"
					onClick={() => handleViewBooking(booking.id)}
					className="flex-1"
				>
					Complete
				</Button>,
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
				<div className="flex items-center gap-2">
					{getStatusIcon(booking.status)}
					<span
						className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(
							booking.status,
						)}`}
					>
						{booking.status}
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
					<p className="text-xs text-gray-500">Payment</p>
					<p className="font-medium">{booking.paymentStatus}</p>
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
											selectedBooking.status,
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
										selectedBooking.startDate,
									).toLocaleDateString()}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-500">
									Return Date
								</p>
								<p className="font-medium">
									{new Date(
										selectedBooking.endDate,
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
									Payment Status
								</p>
								<p className="font-medium">
									{selectedBooking.paymentStatus}
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
									Booking Date
								</p>
								<p className="font-medium">
									{new Date(
										selectedBooking.createdAt,
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
						{selectedBooking.status === "CONFIRMED" && (
							<Button
								variant="success"
								onClick={handleCompleteBooking}
								disabled={loadingComplete}
								className="flex-1"
							>
								{loadingComplete
									? "Completing..."
									: "Mark as Completed"}
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

	return (
		<MainLayout>
			<div className="min-h-screen bg-gray-50">
				<div className="mx-auto max-w-7xl px-6 py-8">
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
							{filteredBookings.map((booking) => (
								<BookingCard
									key={booking.id}
									booking={booking}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Booking Details Modal */}
			<BookingModal />
		</MainLayout>
	);
};

export default MyBookingsPage;
