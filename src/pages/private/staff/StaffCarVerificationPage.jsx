import { useState, useEffect } from "react";
import { MainLayout } from "../../../components/layouts";
import { Button, Modal } from "../../../components/ui";
import {
	getUnverifiedCars,
	getCarForVerification,
	approveCar,
	rejectCar,
	getVerificationStats,
} from "../../../api/staff";
import { useApi, useConfirmation } from "../../../hooks";
import {
	FaCar,
	FaUser,
	FaCalendarAlt,
	FaCheck,
	FaTimes,
	FaClock,
	FaEye,
	FaChartBar,
	FaArrowLeft,
	FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const statusColors = {
	PENDING: "bg-yellow-100 text-yellow-800",
	APPROVED: "bg-green-100 text-green-800",
	REJECTED: "bg-red-100 text-red-800",
};

const statusIcons = {
	PENDING: FaClock,
	APPROVED: FaCheck,
	REJECTED: FaTimes,
};

const StaffCarVerificationPage = () => {
	const navigate = useNavigate();
	const { showConfirmation } = useConfirmation();
	const [cars, setCars] = useState([]);
	const [stats, setStats] = useState(null);
	const [selectedStatus, setSelectedStatus] = useState("PENDING");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [selectedCar, setSelectedCar] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");

	// API hooks
	const { handleApiCall: getCarsApiCall, loading: loadingCars } =
		useApi(getUnverifiedCars);
	const { handleApiCall: getCarDetailsApiCall } = useApi(
		getCarForVerification,
	);
	const { handleApiCall: approveCarApiCall, loading: loadingApprove } =
		useApi(approveCar, {
			disableSuccessToast: false,
			successMessage: "Car approved successfully!",
		});
	const { handleApiCall: rejectCarApiCall, loading: loadingReject } = useApi(
		rejectCar,
		{
			disableSuccessToast: false,
			successMessage: "Car rejected successfully!",
		},
	);
	const { handleApiCall: getStatsApiCall, loading: loadingStats } =
		useApi(getVerificationStats);

	useEffect(() => {
		fetchCars();
		fetchStats();
	}, [selectedStatus, currentPage]);

	const fetchCars = async () => {
		const data = await getCarsApiCall({
			page: currentPage,
			limit: 10,
			status: selectedStatus,
		});
		if (data) {
			setCars(data.results);
			setTotalPages(data.totalPages);
		}
	};

	const fetchStats = async () => {
		const data = await getStatsApiCall();
		if (data) {
			setStats(data);
		}
	};

	const handleViewCar = async (carId) => {
		const data = await getCarDetailsApiCall({ id: carId });
		if (data) {
			setSelectedCar(data);
			setIsModalOpen(true);
		}
	};

	const handleApproveCar = async (carId) => {
		showConfirmation({
			title: "Approve Car",
			message:
				"Are you sure you want to approve this car? It will be visible to clients.",
			confirmText: "Yes, Approve",
			cancelText: "Cancel",
			onConfirm: async () => {
				const data = await approveCarApiCall({ id: carId });
				if (data) {
					setIsModalOpen(false);
					fetchCars();
					fetchStats();
				}
			},
		});
	};

	const handleRejectCar = async (carId) => {
		showConfirmation({
			title: "Reject Car",
			message:
				"Are you sure you want to reject this car? Please provide a reason.",
			confirmText: "Yes, Reject",
			cancelText: "Cancel",
			onConfirm: async () => {
				const data = await rejectCarApiCall({
					id: carId,
					reason: rejectionReason,
				});
				if (data) {
					setIsModalOpen(false);
					setRejectionReason("");
					fetchCars();
					fetchStats();
				}
			},
		});
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const renderStatsCards = () => {
		if (!stats) return null;

		return (
			<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<div className="flex items-center gap-3">
						<FaClock className="text-2xl text-yellow-600" />
						<div>
							<p className="text-sm text-gray-600">Pending</p>
							<p className="text-2xl font-bold text-gray-900">
								{stats.pending}
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<div className="flex items-center gap-3">
						<FaCheck className="text-2xl text-green-600" />
						<div>
							<p className="text-sm text-gray-600">Approved</p>
							<p className="text-2xl font-bold text-gray-900">
								{stats.approved}
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<div className="flex items-center gap-3">
						<FaTimes className="text-2xl text-red-600" />
						<div>
							<p className="text-sm text-gray-600">Rejected</p>
							<p className="text-2xl font-bold text-gray-900">
								{stats.rejected}
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4">
					<div className="flex items-center gap-3">
						<FaChartBar className="text-2xl text-theme-blue" />
						<div>
							<p className="text-sm text-gray-600">Total</p>
							<p className="text-2xl font-bold text-gray-900">
								{stats.total}
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const renderCarCard = (car) => {
		const StatusIcon = statusIcons[car.verificationStatus];

		return (
			<div
				key={car.id}
				className="rounded-lg border border-gray-200 bg-white p-6"
			>
				<div className="mb-4 flex items-start justify-between">
					<div className="flex items-center gap-3">
						<FaCar className="text-xl text-theme-blue" />
						<div>
							<h3 className="font-semibold text-gray-900">
								{car.brand} {car.model} ({car.year})
							</h3>
							<p className="text-sm text-gray-600">
								Car ID: {car.id}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<StatusIcon className="text-sm" />
						<span
							className={`rounded-full px-2 py-1 text-xs font-medium ${
								statusColors[car.verificationStatus]
							}`}
						>
							{car.verificationStatus}
						</span>
					</div>
				</div>

				<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div>
						<h4 className="mb-2 flex items-center gap-2 font-medium text-gray-900">
							<FaUser className="text-sm" />
							Seller Information
						</h4>
						<p className="mb-1 text-sm text-gray-600">
							<strong>Name:</strong> {car.seller?.name}
						</p>
						<p className="mb-1 text-sm text-gray-600">
							<strong>Email:</strong> {car.seller?.email}
						</p>
					</div>
					<div>
						<h4 className="mb-2 flex items-center gap-2 font-medium text-gray-900">
							<FaCalendarAlt className="text-sm" />
							Car Details
						</h4>
						<p className="mb-1 text-sm text-gray-600">
							<strong>Price:</strong> ${car.price}
						</p>
						<p className="mb-1 text-sm text-gray-600">
							<strong>Type:</strong> {car.listingType}
						</p>
						<p className="mb-1 text-sm text-gray-600">
							<strong>Submitted:</strong>{" "}
							{formatDate(car.createdAt)}
						</p>
					</div>
				</div>

				<div className="flex justify-end gap-2">
					<Button
						onClick={() => handleViewCar(car.id)}
						className="bg-theme-blue px-3 py-1 text-sm text-white hover:bg-blue-700"
					>
						<FaEye className="mr-1" />
						View Details
					</Button>
				</div>
			</div>
		);
	};

	const renderCarDetailsModal = () => {
		if (!selectedCar) return null;

		return (
			<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<div className="max-h-[80vh] overflow-y-auto">
					<h2 className="mb-4 text-xl font-bold text-gray-900">
						Car Verification Details
					</h2>

					{/* Car Images */}
					{selectedCar.images && selectedCar.images.length > 0 && (
						<div className="mb-6">
							<h3 className="mb-2 font-semibold text-gray-900">
								Images
							</h3>
							<div className="grid grid-cols-2 gap-2 md:grid-cols-3">
								{selectedCar.images.map((image, index) => (
									<img
										key={index}
										src={image}
										alt={`Car ${index + 1}`}
										className="h-24 w-full rounded-lg object-cover"
									/>
								))}
							</div>
						</div>
					)}

					{/* Car Details */}
					<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<h3 className="mb-2 font-semibold text-gray-900">
								Car Information
							</h3>
							<div className="space-y-2 text-sm">
								<p>
									<strong>Brand:</strong> {selectedCar.brand}
								</p>
								<p>
									<strong>Model:</strong> {selectedCar.model}
								</p>
								<p>
									<strong>Year:</strong> {selectedCar.year}
								</p>
								<p>
									<strong>Price:</strong> ${selectedCar.price}
								</p>
								<p>
									<strong>Mileage:</strong>{" "}
									{selectedCar.mileage || "N/A"} km
								</p>
								<p>
									<strong>Fuel Type:</strong>{" "}
									{selectedCar.fuelType}
								</p>
								<p>
									<strong>Transmission:</strong>{" "}
									{selectedCar.transmission}
								</p>
								<p>
									<strong>Listing Type:</strong>{" "}
									{selectedCar.listingType}
								</p>
							</div>
						</div>
						<div>
							<h3 className="mb-2 font-semibold text-gray-900">
								Seller Information
							</h3>
							<div className="space-y-2 text-sm">
								<p>
									<strong>Name:</strong>{" "}
									{selectedCar.seller?.name}
								</p>
								<p>
									<strong>Email:</strong>{" "}
									{selectedCar.seller?.email}
								</p>
								<p>
									<strong>Submitted:</strong>{" "}
									{formatDate(selectedCar.createdAt)}
								</p>
								<p>
									<strong>Status:</strong>{" "}
									<span
										className={`rounded-full px-2 py-1 text-xs font-medium ${
											statusColors[
												selectedCar.verificationStatus
											]
										}`}
									>
										{selectedCar.verificationStatus}
									</span>
								</p>
							</div>
						</div>
					</div>

					{/* Description */}
					<div className="mb-6">
						<h3 className="mb-2 font-semibold text-gray-900">
							Description
						</h3>
						<p className="text-sm text-gray-600">
							{selectedCar.description}
						</p>
					</div>

					{/* Action Buttons */}
					{selectedCar.verificationStatus === "PENDING" && (
						<div className="flex justify-end gap-3">
							<Button
								onClick={() => handleApproveCar(selectedCar.id)}
								disabled={loadingApprove}
								className="bg-green-600 text-white hover:bg-green-700"
							>
								<FaCheck className="mr-2" />
								Approve Car
							</Button>
							<Button
								onClick={() => handleRejectCar(selectedCar.id)}
								disabled={loadingReject}
								className="bg-red-600 text-white hover:bg-red-700"
							>
								<FaTimes className="mr-2" />
								Reject Car
							</Button>
						</div>
					)}

					{/* Rejection Reason Input */}
					{selectedCar.verificationStatus === "PENDING" && (
						<div className="mt-4">
							<label className="mb-2 block text-sm font-medium text-gray-700">
								Rejection Reason (Optional)
							</label>
							<textarea
								value={rejectionReason}
								onChange={(e) =>
									setRejectionReason(e.target.value)
								}
								placeholder="Provide a reason for rejection..."
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
								rows={3}
							/>
						</div>
					)}
				</div>
			</Modal>
		);
	};

	const renderPagination = () => {
		if (totalPages <= 1) return null;

		return (
			<div className="flex items-center justify-center gap-2">
				<Button
					onClick={() => setCurrentPage(currentPage - 1)}
					disabled={currentPage === 1}
					className="flex items-center gap-1 bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50"
				>
					<FaArrowLeft />
					Previous
				</Button>
				<span className="text-sm text-gray-600">
					Page {currentPage} of {totalPages}
				</span>
				<Button
					onClick={() => setCurrentPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="flex items-center gap-1 bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 disabled:opacity-50"
				>
					Next
					<FaArrowRight />
				</Button>
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
								onClick={() => navigate("/staff")}
								className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-50"
							>
								<FaArrowLeft />
							</button>
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									Car Verification
								</h1>
								<p className="text-gray-600">
									Review and verify car listings
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
						renderStatsCards()
					)}

					{/* Filters */}
					<div className="mb-6 flex items-center gap-4">
						<label className="text-sm font-medium text-gray-700">
							Filter by status:
						</label>
						<select
							value={selectedStatus}
							onChange={(e) => {
								setSelectedStatus(e.target.value);
								setCurrentPage(1);
							}}
							className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
						>
							<option value="PENDING">Pending</option>
							<option value="APPROVED">Approved</option>
							<option value="REJECTED">Rejected</option>
						</select>
					</div>

					{/* Cars List */}
					{loadingCars ? (
						<div className="flex items-center justify-center py-8">
							<div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
						</div>
					) : cars.length === 0 ? (
						<div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
							<FaCar className="mx-auto mb-3 text-4xl text-gray-400" />
							<p className="text-gray-600">No cars found</p>
							<p className="text-sm text-gray-500">
								No {selectedStatus.toLowerCase()} cars to
								display
							</p>
						</div>
					) : (
						<>
							<div className="space-y-4">
								{cars.map(renderCarCard)}
							</div>
							<div className="mt-6">{renderPagination()}</div>
						</>
					)}

					{/* Car Details Modal */}
					{renderCarDetailsModal()}
				</div>
			</div>
		</MainLayout>
	);
};

export default StaffCarVerificationPage;
