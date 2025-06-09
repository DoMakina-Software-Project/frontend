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
	FaExclamationTriangle,
	FaCheckCircle,
	FaTimes,
	FaEye,
} from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useAuth, useApi } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
	getSellerBookingStats,
	getSellerUpcomingBookings,
	getCars,
	getVerificationStats,
} from "../../../api/seller";

const DashboardPage = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();
	const [stats, setStats] = useState(null);
	const [upcomingBookings, setUpcomingBookings] = useState([]);
	const [cars, setCars] = useState([]);
	const [verificationStats, setVerificationStats] = useState(null);
	const [rejectedCars, setRejectedCars] = useState([]);
	const [selectedRejectedCar, setSelectedRejectedCar] = useState(null);

	// API hooks
	const { handleApiCall: getStatsApiCall, loading: loadingStats } = useApi(
		getSellerBookingStats,
	);
	const { handleApiCall: getUpcomingApiCall } = useApi(
		getSellerUpcomingBookings,
	);
	const { handleApiCall: getCarsApiCall } = useApi(getCars);
	const { handleApiCall: getVerificationStatsApiCall } =
		useApi(getVerificationStats);

	useEffect(() => {
		fetchStats();
		fetchUpcomingBookings();
		fetchCars();
		fetchVerificationStats();
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

	const fetchCars = async () => {
		const data = await getCarsApiCall();
		if (data) {
			setCars(data);
			// Filter rejected cars for the dedicated section
			const rejected = data.filter(
				(car) => car.verificationStatus === "REJECTED",
			);
			setRejectedCars(rejected);
		}
	};

	const fetchVerificationStats = async () => {
		const data = await getVerificationStatsApiCall();
		if (data) {
			setVerificationStats(data);
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	const RejectedCarModal = ({ car, isOpen, onClose }) => {
		if (!isOpen || !car) return null;

		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
				<div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<FaTimes className="text-red-600" />
							<h2 className="text-lg font-semibold text-gray-900">
								Car Rejected - Action Required
							</h2>
						</div>
						<button
							onClick={onClose}
							className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
						>
							×
						</button>
					</div>

					<div className="mb-4">
						<div className="flex items-center gap-3">
							{car.images?.[0] && (
								<img
									src={car.images[0]}
									alt={`${car.brand} ${car.model}`}
									className="h-16 w-16 rounded-lg object-cover"
								/>
							)}
							<div>
								<h3 className="font-medium text-gray-900">
									{car.brand} {car.model} ({car.year})
								</h3>
								<p className="text-sm text-gray-600">
									Price: ${car.price?.toLocaleString()}
									{car.listingType === "RENT" && "/day"}
								</p>
							</div>
						</div>
					</div>

					<div className="mb-6">
						<h4 className="mb-2 font-medium text-red-800">
							Rejection Reason:
						</h4>
						<div className="rounded-md bg-red-50 p-3">
							<p className="text-sm text-red-700">
								{car.rejectionReason || "No reason provided"}
							</p>
						</div>
					</div>

					<div className="mb-4 rounded-md bg-blue-50 p-3">
						<h4 className="mb-1 text-sm font-medium text-blue-800">
							What to do next:
						</h4>
						<ul className="text-xs text-blue-700">
							<li>• Review the rejection reason carefully</li>
							<li>
								• Update your car listing to address the issues
							</li>
							<li>
								• Your car will be automatically re-submitted
								for review
							</li>
						</ul>
					</div>

					<div className="flex justify-end gap-3">
						<button
							onClick={onClose}
							className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		);
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

					{/* Car Verification Status Summary with Rejected Cars Alert */}
					{cars.length > 0 && verificationStats && (
						<div className="w-full rounded-lg border border-gray-200 bg-white p-6">
							<h3 className="mb-4 text-lg font-semibold text-gray-900">
								Car Verification Status
							</h3>

							{/* Rejected Cars Alert Section */}
							{rejectedCars.length > 0 && (
								<div className="mb-6 rounded-lg border-2 border-red-200 bg-red-50 p-4">
									<div className="mb-3 flex items-center gap-2">
										<FaExclamationTriangle
											className="text-red-600"
											size={18}
										/>
										<h4 className="font-semibold text-red-800">
											Action Required:{" "}
											{rejectedCars.length} Car
											{rejectedCars.length > 1
												? "s"
												: ""}{" "}
											Rejected
										</h4>
									</div>
									<p className="mb-3 text-sm text-red-700">
										The following cars have been rejected
										and need your attention. Please review
										the rejection reasons and update your
										listings.
									</p>
									<div className="space-y-2">
										{rejectedCars.map((car) => (
											<div
												key={car.id}
												className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
											>
												<div className="flex items-center gap-3">
													{car.images?.[0] && (
														<img
															src={car.images[0]}
															alt={`${car.brand} ${car.model}`}
															className="h-10 w-10 rounded object-cover"
														/>
													)}
													<div>
														<p className="text-sm font-medium text-gray-900">
															{car.brand}{" "}
															{car.model} (
															{car.year})
														</p>
														<p className="text-xs text-gray-600">
															$
															{car.price?.toLocaleString()}
															{car.listingType ===
																"RENT" &&
																"/day"}
														</p>
													</div>
												</div>
												<button
													onClick={() =>
														setSelectedRejectedCar(
															car,
														)
													}
													className="flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
												>
													<FaEye size={10} />
													View Reason
												</button>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Verification Stats Grid */}
							<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
								<div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
									<div className="flex items-center gap-3">
										<FaChartBar className="text-2xl text-gray-600" />
										<div>
											<p className="text-sm text-gray-600">
												Total Cars
											</p>
											<p className="text-2xl font-bold text-gray-900">
												{verificationStats.total}
											</p>
										</div>
									</div>
								</div>
								<div className="rounded-lg border border-gray-200 bg-yellow-50 p-4">
									<div className="flex items-center gap-3">
										<FaClock className="text-2xl text-yellow-600" />
										<div>
											<p className="text-sm text-yellow-700">
												Pending Review
											</p>
											<p className="text-2xl font-bold text-yellow-800">
												{verificationStats.pending}
											</p>
										</div>
									</div>
								</div>
								<div className="rounded-lg border border-gray-200 bg-green-50 p-4">
									<div className="flex items-center gap-3">
										<FaCheckCircle className="text-2xl text-green-600" />
										<div>
											<p className="text-sm text-green-700">
												Approved
											</p>
											<p className="text-2xl font-bold text-green-800">
												{verificationStats.approved}
											</p>
										</div>
									</div>
								</div>
								<div className="rounded-lg border border-gray-200 bg-red-50 p-4">
									<div className="flex items-center gap-3">
										<FaTimes className="text-2xl text-red-600" />
										<div>
											<p className="text-sm text-red-700">
												Rejected
											</p>
											<p className="text-2xl font-bold text-red-800">
												{verificationStats.rejected}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* General rejection notice if no specific rejected cars to show */}
							{verificationStats.rejected > 0 &&
								rejectedCars.length === 0 && (
									<div className="mt-4 rounded-lg bg-red-100 p-4">
										<div className="flex items-center gap-2">
											<FaExclamationTriangle className="text-red-600" />
											<p className="text-sm font-medium text-red-800">
												You have{" "}
												{verificationStats.rejected}{" "}
												rejected car
												{verificationStats.rejected > 1
													? "s"
													: ""}{" "}
												that need attention.
											</p>
										</div>
										<p className="mt-1 text-xs text-red-700">
											Please review the rejection reasons
											and update your listings
											accordingly.
										</p>
									</div>
								)}
						</div>
					)}

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

				{/* Rejected Car Details Modal */}
				<RejectedCarModal
					car={selectedRejectedCar}
					isOpen={!!selectedRejectedCar}
					onClose={() => setSelectedRejectedCar(null)}
				/>
			</div>
		</MainLayout>
	);
};

export default DashboardPage;
