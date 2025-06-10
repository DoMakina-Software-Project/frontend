import { useState, useEffect } from "react";
import { MainLayout } from "../../../components/layouts";
import { Button } from "../../../components/ui";
import {
	getSellerBookings,
	confirmBooking,
	rejectBooking,
	sellerCancelBooking,
	sellerCompleteBooking,
	getSellerBookingStats,
	updatePaymentStatus,
	refundBooking,
} from "../../../api/booking";
import { useApi } from "../../../hooks";
import { useConfirmation } from "../../../hooks";
import {
	FaCar,
	FaCalendarAlt,
	FaUser,
	FaEnvelope,
	FaCheck,
	FaTimes,
	FaClock,
	FaArrowLeft,
	FaChartBar,
	FaMoneyBillWave,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const statusColors = {
	PENDING: "bg-yellow-100 text-yellow-800",
	CONFIRMED: "bg-blue-100 text-blue-800",
	CANCELLED: "bg-red-100 text-red-800",
	COMPLETED: "bg-green-100 text-green-800",
	REJECTED: "bg-gray-100 text-gray-800",
	EXPIRED: "bg-gray-100 text-gray-600",
};

const statusIcons = {
	PENDING: FaClock,
	CONFIRMED: FaCheck,
	CANCELLED: FaTimes,
	COMPLETED: FaCheck,
	REJECTED: FaTimes,
	EXPIRED: FaClock,
};

const BookingManagementPage = () => {
	const navigate = useNavigate();
	const { showConfirmation } = useConfirmation();
	const [bookings, setBookings] = useState([]);
	const [stats, setStats] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState("");

	// API hooks
	const { handleApiCall: getBookingsApiCall, loading: loadingBookings } =
		useApi(getSellerBookings);
	const { handleApiCall: confirmBookingApiCall, loading: loadingConfirm } =
		useApi(confirmBooking, {
			disableSuccessToast: false,
			successMessage: "Booking confirmed successfully!",
		});
	const { handleApiCall: rejectBookingApiCall, loading: loadingReject } =
		useApi(rejectBooking, {
			disableSuccessToast: false,
			successMessage: "Booking rejected successfully!",
		});
	const { handleApiCall: cancelBookingApiCall, loading: loadingCancel } =
		useApi(sellerCancelBooking, {
			disableSuccessToast: false,
			successMessage: "Booking cancelled successfully!",
		});
	const { handleApiCall: completeBookingApiCall, loading: loadingComplete } =
		useApi(sellerCompleteBooking, {
			disableSuccessToast: false,
			successMessage: "Booking completed successfully!",
		});
	const { handleApiCall: getStatsApiCall, loading: loadingStats } = useApi(
		getSellerBookingStats,
	);
	const { handleApiCall: cashInApiCall, loading: loadingCashIn } = useApi(
		updatePaymentStatus,
		{
			disableSuccessToast: false,
			successMessage: "Payment marked as received!",
		},
	);
	const { handleApiCall: refundApiCall, loading: loadingRefund } = useApi(
		refundBooking,
		{
			disableSuccessToast: false,
			successMessage: "Booking refunded successfully!",
		},
	);

	useEffect(() => {
		fetchBookings();
		fetchStats();
	}, [selectedStatus]);

	const fetchBookings = async () => {
		const data = await getBookingsApiCall(selectedStatus || null);
		if (data) {
			setBookings(data);
		}
	};

	const fetchStats = async () => {
		const data = await getStatsApiCall();
		if (data) {
			setStats(data);
		}
	};

	const handleConfirmBooking = async (bookingId) => {
		showConfirmation({
			title: "Confirm Booking",
			message:
				"Are you sure you want to confirm this booking? The client will be notified.",
			confirmText: "Yes, Confirm",
			cancelText: "Not Yet",
			onConfirm: async () => {
				const data = await confirmBookingApiCall(bookingId);
				if (data) {
					fetchBookings();
					fetchStats();
				}
			},
		});
	};

	const handleRejectBooking = async (bookingId) => {
		showConfirmation({
			title: "Reject Booking",
			message:
				"Are you sure you want to reject this booking? This action cannot be undone.",
			confirmText: "Yes, Reject",
			cancelText: "Keep Booking",
			onConfirm: async () => {
				const data = await rejectBookingApiCall(bookingId);
				if (data) {
					fetchBookings();
					fetchStats();
				}
			},
		});
	};

	const handleCancelBooking = async (bookingId) => {
		showConfirmation({
			title: "Cancel Booking",
			message:
				"Are you sure you want to cancel this booking? This action cannot be undone.",
			confirmText: "Yes, Cancel",
			cancelText: "Keep Booking",
			onConfirm: async () => {
				const data = await cancelBookingApiCall(bookingId);
				if (data) {
					fetchBookings();
					fetchStats();
				}
			},
		});
	};

	const handleCompleteBooking = async (bookingId) => {
		showConfirmation({
			title: "Complete Booking",
			message: "Are you sure you want to mark this booking as completed?",
			confirmText: "Yes, Complete",
			cancelText: "Not Yet",
			onConfirm: async () => {
				const data = await completeBookingApiCall(bookingId);
				if (data) {
					fetchBookings();
					fetchStats();
				}
			},
		});
	};

	const handleCashIn = async (bookingId) => {
		showConfirmation({
			title: "Mark Payment as Received",
			message:
				"Are you sure you have received the cash payment for this booking? This action will mark the payment as completed.",
			confirmText: "Yes, Received",
			cancelText: "Not Yet",
			onConfirm: async () => {
				const data = await cashInApiCall({
					bookingId,
					paymentStatus: "PAID",
				});
				if (data) {
					fetchBookings();
					fetchStats();
				}
			},
		});
	};

	const handleRefund = async (bookingId) => {
		showConfirmation({
			title: "Refund Booking",
			message:
				"Are you sure you want to refund this booking? This will mark the payment as refunded.",
			confirmText: "Yes, Refund",
			cancelText: "Cancel",
			onConfirm: async () => {
				const data = await refundApiCall(bookingId);
				if (data) {
					fetchBookings();
					fetchStats();
				}
			},
		});
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const calculateDays = (startDate, endDate) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffTime = Math.abs(end - start);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
		return diffDays;
	};

	const getActionButtons = (booking) => {
		const isProcessing =
			loadingConfirm ||
			loadingReject ||
			loadingCancel ||
			loadingComplete ||
			loadingCashIn ||
			loadingRefund;

		switch (booking.status) {
			case "PENDING":
				return (
					<div className="flex gap-2">
						<Button
							onClick={() => handleConfirmBooking(booking.id)}
							disabled={isProcessing}
							className="bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
						>
							<FaCheck className="mr-1" />
							Confirm
						</Button>
						<Button
							onClick={() => handleRejectBooking(booking.id)}
							disabled={isProcessing}
							className="bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
						>
							<FaTimes className="mr-1" />
							Reject
						</Button>
					</div>
				);
			case "CONFIRMED":
				return (
					<div className="flex gap-2">
						{booking.paymentMethod === "CASH" &&
							booking.paymentStatus === "PENDING" && (
								<Button
									onClick={() => handleCashIn(booking.id)}
									disabled={isProcessing}
									className="bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
								>
									<FaMoneyBillWave className="mr-1" />
									Cash In
								</Button>
							)}
						{booking.paymentStatus === "PAID" && (
							<Button
								onClick={() =>
									handleCompleteBooking(booking.id)
								}
								disabled={isProcessing}
								className="bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
							>
								<FaCheck className="mr-1" />
								Complete
							</Button>
						)}
						<Button
							onClick={() => handleCancelBooking(booking.id)}
							disabled={isProcessing}
							className="bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
						>
							<FaTimes className="mr-1" />
							Cancel
						</Button>
					</div>
				);
			case "CANCELLED":
				return (
					<div className="flex gap-2">
						{booking.paymentStatus === "PAID" && (
							<Button
								onClick={() => handleRefund(booking.id)}
								disabled={isProcessing}
								className="bg-orange-600 px-3 py-1 text-sm text-white hover:bg-orange-700"
							>
								<FaMoneyBillWave className="mr-1" />
								Refund
							</Button>
						)}
						<span className="text-sm text-gray-500">
							Booking cancelled
						</span>
					</div>
				);
			default:
				return (
					<span className="text-sm text-gray-500">
						No actions available
					</span>
				);
		}
	};

	const getPaymentStatusColor = (status) => {
		switch (status) {
			case "PENDING":
				return "bg-yellow-100 text-yellow-800";
			case "PAID":
				return "bg-green-100 text-green-800";
			case "REFUNDED":
				return "bg-blue-100 text-blue-800";
			case "FAILED":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const renderStatsCard = () => {
		if (!stats) return null;

		return (
			<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<div className="flex items-center gap-3">
						<FaChartBar className="text-2xl text-theme-blue" />
						<div>
							<p className="text-sm text-gray-600">
								Total Bookings
							</p>
							<p className="text-2xl font-bold text-gray-900">
								{stats.totalBookings}
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<div className="flex items-center gap-3">
						<FaCheck className="text-2xl text-green-600" />
						<div>
							<p className="text-sm text-gray-600">Confirmed</p>
							<p className="text-2xl font-bold text-gray-900">
								{stats.confirmedBookings}
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<div className="flex items-center gap-3">
						<FaCheck className="text-2xl text-blue-600" />
						<div>
							<p className="text-sm text-gray-600">Completed</p>
							<p className="text-2xl font-bold text-gray-900">
								{stats.completedBookings}
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<div className="flex items-center gap-3">
						<FaMoneyBillWave className="text-2xl text-green-600" />
						<div>
							<p className="text-sm text-gray-600">
								Total Revenue
							</p>
							<p className="text-2xl font-bold text-gray-900">
								${stats.totalRevenue}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderBookingCard = (booking) => {
		const StatusIcon = statusIcons[booking.status];
		const days = calculateDays(booking.startDate, booking.endDate);

		return (
			<div
				key={booking.id}
				className="rounded-lg border border-gray-200 bg-white p-6"
			>
				<div className="mb-4 flex items-start justify-between">
					<div className="flex items-center gap-3">
						<FaCar className="text-xl text-theme-blue" />
						<div>
							<h3 className="font-semibold text-gray-900">
								{booking.Car?.Brand?.name} {booking.Car?.model}{" "}
								({booking.Car?.year})
							</h3>
							<p className="text-sm text-gray-600">
								Booking #{booking.id}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<StatusIcon className="text-sm" />
						<span
							className={`rounded-full px-2 py-1 text-xs font-medium ${
								statusColors[booking.status]
							}`}
						>
							{booking.status}
						</span>
					</div>
				</div>

				<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<h4 className="mb-2 flex items-center gap-2 font-medium text-gray-900">
							<FaUser className="text-sm" />
							Client Information
						</h4>
						<p className="mb-1 text-sm text-gray-600">
							<strong>Name:</strong> {booking.User?.name}
						</p>
						<p className="mb-1 flex items-center gap-1 text-sm text-gray-600">
							<FaEnvelope className="text-xs" />
							{booking.User?.email}
						</p>
					</div>
					<div>
						<h4 className="mb-2 flex items-center gap-2 font-medium text-gray-900">
							<FaCalendarAlt className="text-sm" />
							Booking Details
						</h4>
						<p className="mb-1 text-sm text-gray-600">
							<strong>Dates:</strong>{" "}
							{formatDate(booking.startDate)} -{" "}
							{formatDate(booking.endDate)}
						</p>
						<p className="mb-1 text-sm text-gray-600">
							<strong>Duration:</strong> {days} day
							{days > 1 ? "s" : ""}
						</p>
						<p className="mb-1 text-sm text-gray-600">
							<strong>Total Price:</strong> ${booking.totalPrice}
						</p>
						<div className="flex items-center gap-2">
							<p className="text-sm text-gray-600">
								<strong>Payment:</strong>{" "}
								{booking.paymentMethod}
							</p>
							<span
								className={`rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusColor(
									booking.paymentStatus,
								)}`}
							>
								{booking.paymentStatus}
							</span>
						</div>
					</div>
				</div>

				<div className="flex justify-end">
					{getActionButtons(booking)}
				</div>
			</div>
		);
	};

	return (
		<MainLayout mainOptions={{ paddingVertical: false }}>
			<div className="min-h-screen w-full bg-gray-50">
				<div className="mx-auto max-w-7xl px-6 py-8">
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
									Booking Management
								</h1>
								<p className="text-gray-600">
									Manage bookings for your rental cars
								</p>
							</div>
						</div>
					</div>

					{/* Stats Cards */}
					{loadingStats ? (
						<div className="flex items-center justify-center py-8">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
						</div>
					) : (
						renderStatsCard()
					)}

					{/* Filters */}
					<div className="mb-6 flex items-center gap-4">
						<label className="text-sm font-medium text-gray-700">
							Filter by status:
						</label>
						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
						>
							<option value="">All Statuses</option>
							<option value="PENDING">Pending</option>
							<option value="CONFIRMED">Confirmed</option>
							<option value="COMPLETED">Completed</option>
							<option value="CANCELLED">Cancelled</option>
							<option value="REJECTED">Rejected</option>
							<option value="EXPIRED">Expired</option>
						</select>
					</div>

					{/* Bookings List */}
					{loadingBookings ? (
						<div className="flex items-center justify-center py-8">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
						</div>
					) : bookings.length === 0 ? (
						<div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
							<FaCalendarAlt className="mx-auto mb-3 text-4xl text-gray-400" />
							<p className="text-gray-600">No bookings found</p>
							<p className="text-sm text-gray-500">
								{selectedStatus
									? `No ${selectedStatus.toLowerCase()} bookings found`
									: "You don't have any bookings yet"}
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{bookings.map(renderBookingCard)}
						</div>
					)}
				</div>
			</div>
		</MainLayout>
	);
};

export default BookingManagementPage;
