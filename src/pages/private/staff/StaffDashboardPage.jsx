import { useState, useEffect } from "react";
import { MainLayout } from "../../../components/layouts";
import {
	FaUsers,
	FaCarSide,
	FaChartBar,
	FaDollarSign,
	FaChartLine,
	FaEdit,
	FaCheck,
	FaTimes,
	FaClock,
	FaEye,
} from "react-icons/fa";
import {
	getPromotionPrice,
	createPromotionPrice,
	updatePromotionPrice,
	getDashboardData,
	getVerificationStats,
} from "../../../api/staff";
import { useApi } from "../../../hooks";
import { useNavigate } from "react-router-dom";

export default function StaffDashboardPage() {
	const navigate = useNavigate();
	const { handleApiCall: getDashboardDataApiCall } = useApi(getDashboardData);
	const { handleApiCall: getPromotionPriceApiCall } = useApi(
		getPromotionPrice,
		{
			ignoreErrors: true,
		},
	);
	const { handleApiCall: createPromotionPriceApiCall } =
		useApi(createPromotionPrice);
	const { handleApiCall: updatePromotionPriceApiCall } =
		useApi(updatePromotionPrice);
	const { handleApiCall: getVerificationStatsApiCall } =
		useApi(getVerificationStats);

	const [dashboardData, setDashboardData] = useState({
		numberOfUser: 0,
		numberOfAdmins: 0,
		numberOfCars: 0,
		numberOfSoldCars: 0,
		totalRevenue: 0,
		yearRevenue: 0,
		monthRevenue: 0,
		weekRevenue: 0,
		todayRevenue: 0,
		numberOfBrands: 0,
		topFiveBrands: [],
	});

	const [promotionPrice, setPromotionPrice] = useState(null);
	const [isPromotionExisting, setIsPromotionExisting] = useState(false); // Track if it exists
	const [verificationStats, setVerificationStats] = useState({
		pending: 0,
		approved: 0,
		rejected: 0,
		total: 0,
	});

	const handlePromotionPriceUpdate = async (newPrice) => {
		if (isPromotionExisting) {
			// If promotion exists, update it
			const response = await updatePromotionPriceApiCall({
				price: newPrice,
			});
			if (response) {
				setPromotionPrice(newPrice);
			}
		} else {
			// If it doesn't exist, create it
			const response = await createPromotionPriceApiCall({
				price: newPrice,
			});
			if (response) {
				setPromotionPrice(newPrice);
				setIsPromotionExisting(true);
			}
		}
	};

	useEffect(() => {
		getPromotionPriceApiCall().then((data) => {
			if (data && data.price) {
				setPromotionPrice(parseFloat(data.price));
				setIsPromotionExisting(true);
			} else {
				setPromotionPrice(0);
				setIsPromotionExisting(false);
			}
		});
		getDashboardDataApiCall().then((data) => {
			if (data) {
				setDashboardData(data);
			}
		});
		getVerificationStatsApiCall().then((data) => {
			if (data) {
				setVerificationStats(data);
			}
		});
	}, []);

	return (
		<MainLayout mainOptions={{ paddingVertical: true }}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h1 className="mb-8 text-3xl font-bold text-gray-900">
					Dashboard
				</h1>

				<div className="mb-12 space-y-12">
					<section>
						<h2 className="mb-4 text-2xl font-semibold text-gray-800">
							Key Statistics
						</h2>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
							<StatCard
								title="Total Clients"
								value={dashboardData.numberOfClients}
								icon={
									<FaUsers className="h-8 w-8 text-blue-500" />
								}
							/>
							<StatCard
								title="Total Sellers"
								value={dashboardData.numberOfSellers}
								icon={
									<FaUsers className="h-8 w-8 text-green-500" />
								}
							/>
							<StatCard
								title="Total Cars"
								value={dashboardData.numberOfCars}
								icon={
									<FaCarSide className="h-8 w-8 text-yellow-500" />
								}
							/>
							<StatCard
								title="Sold Cars"
								value={dashboardData.numberOfSoldCars}
								icon={
									<FaCarSide className="h-8 w-8 text-red-500" />
								}
							/>
						</div>
					</section>

					{/* Car Verification Section */}
					<section className="rounded-lg bg-white p-6 shadow-lg">
						<div className="mb-6 flex items-center justify-between">
							<h2 className="flex items-center text-2xl font-semibold text-gray-800">
								<FaCarSide className="mr-2 text-blue-600" />
								Car Verification
							</h2>
							<button
								onClick={() =>
									navigate("/staff/car-verification")
								}
								className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
							>
								<FaEye />
								View All
							</button>
						</div>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
							<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
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
							<div className="rounded-lg border border-green-200 bg-green-50 p-4">
								<div className="flex items-center gap-3">
									<FaCheck className="text-2xl text-green-600" />
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
							<div className="rounded-lg border border-red-200 bg-red-50 p-4">
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
							<div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
								<div className="flex items-center gap-3">
									<FaChartBar className="text-2xl text-blue-600" />
									<div>
										<p className="text-sm text-blue-700">
											Total Cars
										</p>
										<p className="text-2xl font-bold text-blue-800">
											{verificationStats.total}
										</p>
									</div>
								</div>
							</div>
						</div>
						{verificationStats.pending > 0 && (
							<div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
								<p className="text-sm text-yellow-800">
									<strong>Action Required:</strong> You have{" "}
									{verificationStats.pending} car
									{verificationStats.pending === 1
										? ""
										: "s"}{" "}
									waiting for verification.
								</p>
							</div>
						)}
					</section>

					<section>
						<h2 className="mb-6 flex items-center text-2xl font-semibold text-gray-800">
							<FaChartLine className="mr-2 text-blue-600" />
							Revenue
						</h2>
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							<RevenueCard
								title="Total Revenue"
								value={dashboardData.totalRevenue}
								highlight={true}
							/>
							<RevenueCard
								title="Year Revenue"
								value={dashboardData.yearRevenue}
							/>
							<RevenueCard
								title="Month Revenue"
								value={dashboardData.monthRevenue}
							/>
							<RevenueCard
								title="Week Revenue"
								value={dashboardData.weekRevenue}
							/>
							<RevenueCard
								title="Today Revenue"
								value={dashboardData.todayRevenue}
							/>
							<PromotionPriceCard
								value={promotionPrice}
								onUpdate={handlePromotionPriceUpdate}
							/>
						</div>
					</section>

					{/* Brand Statistics section remains unchanged */}
					<section className="rounded-lg bg-white p-6 shadow-lg">
						<h2 className="mb-6 flex items-center text-2xl font-semibold text-gray-800">
							<FaChartBar className="mr-2 text-blue-600" />
							Brand Statistics
						</h2>
						<div className="mb-6 flex items-center justify-between rounded-lg bg-gray-100 p-4">
							<p className="text-lg">
								Number of Brands:{" "}
								<span className="font-bold text-blue-600">
									{dashboardData.numberOfBrands}
								</span>
							</p>
						</div>
						<h3 className="mb-4 text-xl font-semibold text-gray-700">
							Top 5 Brands
						</h3>
						{dashboardData.topFiveBrands.length > 0 ? (
							<ul className="space-y-4">
								{dashboardData.topFiveBrands.map(
									(brand, index) => (
										<li
											key={index}
											className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-all hover:bg-gray-100"
										>
											<div className="flex items-center">
												{brand.icon_url ? (
													<img
														src={
															brand.icon_url ||
															"/placeholder.svg"
														}
														alt={brand.name}
														className="mr-3 h-8 w-8 object-contain"
													/>
												) : (
													<FaCarSide className="mr-3 h-8 w-8 text-gray-400" />
												)}
												<span className="text-lg font-medium">
													{brand.name}
												</span>
											</div>
											<span className="font-semibold text-blue-600">
												{brand.carCount} cars
											</span>
										</li>
									),
								)}
							</ul>
						) : (
							<p className="py-4 text-center italic text-gray-500">
								No brand data available
							</p>
						)}
					</section>
				</div>
			</div>
		</MainLayout>
	);
}

function StatCard({ title, value, icon }) {
	return (
		<div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-700">{title}</h2>
				{icon}
			</div>
			<p className="text-3xl font-bold text-gray-900">{value}</p>
		</div>
	);
}

function RevenueCard({ title, value, highlight = false }) {
	const formattedValue = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(value);

	return (
		<div
			className={`rounded-lg p-6 shadow-md transition-all hover:shadow-lg ${
				highlight ? "border-2 border-blue-200 bg-blue-50" : "bg-white"
			}`}
		>
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-700">{title}</h2>
				<FaDollarSign
					className={`h-6 w-6 ${highlight ? "text-blue-500" : "text-green-500"}`}
				/>
			</div>
			<p
				className={`text-3xl font-bold ${highlight ? "text-blue-600" : "text-gray-900"}`}
			>
				{formattedValue}
			</p>
		</div>
	);
}

function PromotionPriceCard({ value = 0, onUpdate = () => {} }) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(value);

	const handleSubmit = () => {
		onUpdate(Number(editValue));
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditValue(value);
		setIsEditing(false);
	};

	return (
		<div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-700">
					Promotion Price
				</h2>
				{!isEditing && (
					<button
						onClick={() => setIsEditing(true)}
						className="text-blue-500 hover:text-blue-600"
					>
						<FaEdit className="h-5 w-5" />
					</button>
				)}
			</div>
			{isEditing ? (
				<div className="flex items-center">
					<input
						type="number"
						value={editValue}
						onChange={(e) => setEditValue(e.target.value)}
						className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
					/>
					<button
						onClick={handleSubmit}
						className="ml-2 text-green-500 hover:text-green-600"
					>
						<FaCheck className="h-5 w-5" />
					</button>
					<button
						onClick={handleCancel}
						className="ml-2 text-red-500 hover:text-red-600"
					>
						<FaTimes className="h-5 w-5" />
					</button>
				</div>
			) : (
				<p className="text-3xl font-bold text-gray-900">
					${value?.toFixed(2)}
				</p>
			)}
		</div>
	);
}
