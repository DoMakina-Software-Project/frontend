import { MainLayout } from "../../../components/layouts";
import { GridDashboardCar } from "../../../components/pages/Dashboard";
import {
	FaCalendarAlt,
	FaPlus,
	FaClipboardList,
	FaChartBar,
	FaMoneyBillWave,
	FaCheck,
	FaClock,
} from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useAuth, useApi } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
	getSellerBookingStats,
	getSellerUpcomingBookings,
} from "../../../api/seller";

const DashboardPage = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const [stats, setStats] = useState(null);
	const [upcomingBookings, setUpcomingBookings] = useState([]);

	// API hooks
	const { handleApiCall: getStatsApiCall, loading: loadingStats } = useApi(
		getSellerBookingStats,
	);
	const { handleApiCall: getUpcomingApiCall } = useApi(
		getSellerUpcomingBookings,
	);

	useEffect(() => {
		fetchStats();
		fetchUpcomingBookings();
	}, []);

	const fetchStats = async () => {
		const data = await getStatsApiCall();
		if (data) {
			setStats(data);
		}
	};

	const fetchUpcomingBookings = async () => {
		const data = await getUpcomingApiCall();
		if (data) {
			setUpcomingBookings(data.slice(0, 3)); // Show only 3 upcoming bookings
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	return (
		<MainLayout mainOptions={{ paddingVertical: false }}>
			<div className="flex w-full flex-col items-center justify-start gap-8 px-6 py-8 lg:px-14">
				<div className="flex w-full max-w-7xl flex-col items-start justify-start gap-6">
					<div className="flex flex-row items-center justify-center gap-4">
						<FaCircleUser />
						<h2 className="text-xl font-semibold">
							Welcome, {currentUser.name || currentUser.email}
						</h2>
					</div>

					{/* Stats Cards */}
					{loadingStats ? (
						<div className="flex items-center justify-center py-4">
							<div className="h-6 w-6 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
						</div>
					) : stats ? (
						<div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
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
										<p className="text-sm text-gray-600">
											Confirmed
										</p>
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
										<p className="text-sm text-gray-600">
											Completed
										</p>
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
					) : null}

					{/* Quick Actions */}
					<div className="flex flex-wrap gap-4">
						<button
							onClick={() => navigate("list-car")}
							className="flex items-center gap-2 rounded-lg bg-theme-blue px-4 py-2 text-white transition-colors hover:bg-blue-600"
						>
							<FaPlus size={16} />
							List a Car
						</button>
						<button
							onClick={() => navigate("rental-availability")}
							className="flex items-center gap-2 rounded-lg border border-theme-blue px-4 py-2 text-theme-blue transition-colors hover:bg-blue-50"
						>
							<FaCalendarAlt size={16} />
							Manage Availability
						</button>
						<button
							onClick={() => navigate("bookings")}
							className="flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2 text-green-600 transition-colors hover:bg-green-50"
						>
							<FaClipboardList size={16} />
							Manage Bookings
						</button>
					</div>

					{/* Upcoming Bookings */}
					{upcomingBookings.length > 0 && (
						<div className="w-full rounded-lg border border-gray-200 bg-white p-6">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
									<FaClock className="text-theme-blue" />
									Upcoming Bookings
								</h3>
								<button
									onClick={() => navigate("bookings")}
									className="text-sm font-medium text-theme-blue hover:text-blue-700"
								>
									View All
								</button>
							</div>
							<div className="space-y-3">
								{upcomingBookings.map((booking) => (
									<div
										key={booking.id}
										className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
									>
										<div className="flex items-center gap-3">
											<div className="h-2 w-2 rounded-full bg-theme-blue"></div>
											<div>
												<p className="font-medium text-gray-900">
													{booking.Car?.Brand?.name}{" "}
													{booking.Car?.model}
												</p>
												<p className="text-sm text-gray-600">
													{booking.User?.name} •{" "}
													{formatDate(
														booking.startDate,
													)}{" "}
													-{" "}
													{formatDate(
														booking.endDate,
													)}
												</p>
											</div>
										</div>
										<span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
											{booking.status}
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<GridDashboardCar />
			</div>
		</MainLayout>
	);
};

export default DashboardPage;
