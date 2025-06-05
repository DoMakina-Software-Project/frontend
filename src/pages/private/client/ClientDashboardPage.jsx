import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "../../../components/layouts";
import { Button } from "../../../components/ui";
import {
	getClientBookings,
	getClientUpcomingBookings,
} from "../../../api/booking";
import { useApi } from "../../../hooks";
import {
	FaCalendarAlt,
	FaCar,
	FaClock,
	FaCheckCircle,
	FaTimesCircle,
	FaExclamationCircle,
	FaSearch,
	FaHeart,
	FaEye,
} from "react-icons/fa";
import toast from "react-hot-toast";

const ClientDashboardPage = () => {
	const navigate = useNavigate();
	const [stats, setStats] = useState({
		totalBookings: 0,
		activeBookings: 0,
		completedBookings: 0,
		cancelledBookings: 0,
	});
	const [upcomingBookings, setUpcomingBookings] = useState([]);

	// API hooks
	const { handleApiCall: getBookingsApiCall, loading: loadingBookings } =
		useApi(getClientBookings, {
			onSuccess: (data) => {
				calculateStats(data);
			},
			onError: (error) => {
				toast.error("Failed to load bookings");
			},
		});

	const { handleApiCall: getUpcomingApiCall, loading: loadingUpcoming } =
		useApi(getClientUpcomingBookings, {
			onSuccess: (data) => {
				setUpcomingBookings(data.slice(0, 3)); // Show only first 3
			},
			onError: (error) => {
				console.error("Failed to load upcoming bookings:", error);
			},
		});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		await getBookingsApiCall();
		await getUpcomingApiCall();
	};

	const calculateStats = (bookings) => {
		const stats = {
			totalBookings: bookings.length,
			activeBookings: bookings.filter((b) =>
				["PENDING", "CONFIRMED"].includes(b.status),
			).length,
			completedBookings: bookings.filter((b) => b.status === "COMPLETED")
				.length,
			cancelledBookings: bookings.filter(
				(b) => b.status === "CANCELLED" || b.status === "REJECTED",
			).length,
		};
		setStats(stats);
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
				return "bg-yellow-100 text-yellow-800";
			case "CONFIRMED":
				return "bg-green-100 text-green-800";
			case "COMPLETED":
				return "bg-blue-100 text-blue-800";
			case "CANCELLED":
			case "REJECTED":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const StatCard = ({ title, value, icon, color, onClick }) => (
		<div
			className={`rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg ${
				onClick ? "cursor-pointer" : ""
			}`}
			onClick={onClick}
		>
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600">{title}</p>
					<p className="text-3xl font-bold text-gray-900">{value}</p>
				</div>
				<div className={`rounded-full p-3 ${color}`}>{icon}</div>
			</div>
		</div>
	);

	const UpcomingBookingCard = ({ booking }) => (
		<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
			<div className="mb-3 flex items-start justify-between">
				<div className="flex items-center gap-3">
					{booking.Car.images && booking.Car.images.length > 0 ? (
						<img
							src={booking.Car.images[0]}
							alt={`${booking.Car.Brand?.name} ${booking.Car.model}`}
							className="h-12 w-12 rounded-md object-cover"
						/>
					) : (
						<div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-200">
							<FaCar className="text-gray-400" />
						</div>
					)}
					<div>
						<h4 className="font-semibold text-gray-900">
							{booking.Car.Brand?.name} {booking.Car.model}
						</h4>
						<p className="text-sm text-gray-600">
							{booking.Car.year}
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{getStatusIcon(booking.status)}
					<span
						className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
							booking.status,
						)}`}
					>
						{booking.status}
					</span>
				</div>
			</div>

			<div className="space-y-2">
				<div className="flex items-center justify-between text-sm">
					<span className="text-gray-600">Pickup:</span>
					<span className="font-medium">
						{new Date(booking.startDate).toLocaleDateString()}
					</span>
				</div>
				<div className="flex items-center justify-between text-sm">
					<span className="text-gray-600">Return:</span>
					<span className="font-medium">
						{new Date(booking.endDate).toLocaleDateString()}
					</span>
				</div>
				<div className="flex items-center justify-between text-sm">
					<span className="text-gray-600">Total:</span>
					<span className="font-semibold text-theme-blue">
						${booking.totalPrice}
					</span>
				</div>
			</div>

			<div className="mt-3 flex gap-2">
				<Button
					size="small"
					variant="outline"
					onClick={() => navigate(`/client/bookings/${booking.id}`)}
					className="flex-1"
				>
					<FaEye className="mr-1" size={12} />
					View
				</Button>
				{booking.status === "PENDING" && (
					<Button
						size="small"
						variant="danger"
						onClick={() =>
							navigate(`/client/bookings/${booking.id}`)
						}
						className="flex-1"
					>
						Cancel
					</Button>
				)}
			</div>
		</div>
	);

	return (
		<MainLayout>
			<div className="min-h-screen bg-gray-50">
				<div className="mx-auto max-w-7xl px-6 py-8">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							Dashboard
						</h1>
						<p className="text-gray-600">
							Welcome back! Here's your booking overview.
						</p>
					</div>

					{/* Quick Actions */}
					<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
						<Button
							size="large"
							onClick={() => navigate("/search")}
							className="flex items-center justify-center gap-2"
						>
							<FaSearch />
							Find Cars
						</Button>
						<Button
							size="large"
							variant="outline"
							onClick={() => navigate("/client/bookings")}
							className="flex items-center justify-center gap-2"
						>
							<FaCalendarAlt />
							My Bookings
						</Button>
						<Button
							size="large"
							variant="outline"
							onClick={() => navigate("/wishlist")}
							className="flex items-center justify-center gap-2"
						>
							<FaHeart />
							Wishlist
						</Button>
					</div>

					{/* Stats Cards */}
					<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						<StatCard
							title="Total Bookings"
							value={stats.totalBookings}
							icon={<FaCalendarAlt className="text-white" />}
							color="bg-blue-500"
							onClick={() => navigate("/client/bookings")}
						/>
						<StatCard
							title="Active Bookings"
							value={stats.activeBookings}
							icon={<FaClock className="text-white" />}
							color="bg-yellow-500"
							onClick={() =>
								navigate("/client/bookings?status=active")
							}
						/>
						<StatCard
							title="Completed"
							value={stats.completedBookings}
							icon={<FaCheckCircle className="text-white" />}
							color="bg-green-500"
							onClick={() =>
								navigate("/client/bookings?status=completed")
							}
						/>
						<StatCard
							title="Cancelled"
							value={stats.cancelledBookings}
							icon={<FaTimesCircle className="text-white" />}
							color="bg-red-500"
							onClick={() =>
								navigate("/client/bookings?status=cancelled")
							}
						/>
					</div>

					{/* Upcoming Bookings */}
					<div className="rounded-lg bg-white p-6 shadow-md">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="text-xl font-semibold text-gray-900">
								Upcoming Bookings
							</h2>
							<Button
								variant="outline"
								size="small"
								onClick={() => navigate("/client/bookings")}
							>
								View All
							</Button>
						</div>

						{loadingUpcoming ? (
							<div className="flex items-center justify-center py-8">
								<div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
							</div>
						) : upcomingBookings.length === 0 ? (
							<div className="py-8 text-center">
								<FaCalendarAlt className="mx-auto mb-3 text-4xl text-gray-400" />
								<p className="text-gray-600">
									No upcoming bookings
								</p>
								<p className="mb-4 text-sm text-gray-500">
									Book a car to see your upcoming trips here.
								</p>
								<Button onClick={() => navigate("/search")}>
									Find Cars
								</Button>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								{upcomingBookings.map((booking) => (
									<UpcomingBookingCard
										key={booking.id}
										booking={booking}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default ClientDashboardPage;
