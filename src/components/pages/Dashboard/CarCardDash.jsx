import {
	MdMoreVert,
	MdDelete,
	MdStar,
	MdOutlineSell,
	MdSell,
	MdStarOutline,
	MdCalendarToday,
	MdWarning,
	MdCheckCircle,
	MdCancel,
	MdInfo,
} from "react-icons/md";
import CarExampleImage from "../../../assets/images/car-example.png";
import RejectionReasonModal from "./RejectionReasonModal";
import { useState } from "react";

const CarCard = ({
	car,
	onDelete,
	onPromote,
	updateIsSold,
	onImageClick = () => {},
	onManageAvailability,
	hasPromotionPrice,
}) => {
	const [showRejectionModal, setShowRejectionModal] = useState(false);

	const getVerificationStatusBadge = () => {
		switch (car?.verificationStatus) {
			case "PENDING":
				return (
					<span className="flex items-center gap-1 rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-700">
						<MdWarning size={12} />
						Pending Review
					</span>
				);
			case "APPROVED":
				return (
					<span className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs text-green-700">
						<MdCheckCircle size={12} />
						Approved
					</span>
				);
			case "REJECTED":
				return (
					<span className="flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-xs text-red-700">
						<MdCancel size={12} />
						Rejected
					</span>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<div className="overflow-hidden rounded-xl bg-white shadow-md">
				<div className="relative">
					<img
						onClick={onImageClick}
						src={car?.images?.[0] || CarExampleImage}
						alt={`${car?.brand} ${car?.model}`}
						width={400}
						height={300}
						className="h-72 w-full object-cover"
					/>
					<div className="group absolute right-4 top-4">
						<div className="rounded-full bg-white p-2 text-gray-600 hover:bg-gray-100 focus:outline-none">
							<MdMoreVert size={24} />
						</div>
						<div className="absolute right-0 w-48 scale-0 transition-all duration-200 group-hover:scale-100">
							<div className="mt-2 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
								{/* Manage Availability button for rental cars */}
								{car?.listingType === "RENT" && (
									<button
										onClick={() =>
											onManageAvailability &&
											onManageAvailability()
										}
										className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									>
										<MdCalendarToday
											className="mr-3 w-5"
											size={20}
										/>
										Availability
									</button>
								)}

								<button
									onClick={() => {
										onDelete();
									}}
									className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								>
									<MdDelete className="mr-3 w-5" size={20} />
									Hide
								</button>

								{hasPromotionPrice && (
									<button
										onClick={onPromote}
										className="flex w-full items-center whitespace-nowrap px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
									>
										{car?.promoted ? (
											<MdStar
												className="mr-3 w-5"
												size={20}
											/>
										) : (
											<MdStarOutline
												className="mr-3 w-5"
												size={20}
											/>
										)}
										{car?.promoted
											? "Remove Promotion"
											: "Add Promotion"}
									</button>
								)}

								{car?.listingType === "SALE" && (
									<button
										onClick={() => {
											updateIsSold();
										}}
										className="flex w-full items-center px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
									>
										{car.status === "SOLD" ? (
											<MdSell
												className="mr-3 w-5"
												size={18}
											/>
										) : (
											<MdOutlineSell
												className="mr-3 w-5"
												size={18}
											/>
										)}
										{car.status === "SOLD"
											? "Mark as Available"
											: "Mark as Sold"}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="p-4">
					<div className="mb-2 flex items-start justify-between">
						<h3 className="font-medium">{`${car?.brand} ${car?.model}`}</h3>
						<span className="font-semibold">
							{car?.price?.toLocaleString()}$
							{car?.listingType === "RENT" && (
								<span className="text-sm text-gray-500">
									/day
								</span>
							)}
						</span>
					</div>

					{/* Verification Status and Rejection Reason */}
					<div className="mb-3">
						{getVerificationStatusBadge()}
						{car?.verificationStatus === "REJECTED" &&
							car?.rejectionReason && (
								<div className="mt-2 rounded-md bg-red-50 p-2">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<p className="text-xs font-medium text-red-800">
												Rejection Reason:
											</p>
											<p className="line-clamp-2 text-xs text-red-700">
												{car.rejectionReason}
											</p>
										</div>
										<button
											onClick={() =>
												setShowRejectionModal(true)
											}
											className="ml-2 flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
										>
											<MdInfo size={12} />
											Details
										</button>
									</div>
								</div>
							)}
					</div>

					<div className="flex flex-wrap gap-2">
						{car?.promoted && (
							<span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-600">
								Promoted
							</span>
						)}
						{car?.status === "SOLD" && (
							<span className="rounded bg-red-100 px-2 py-1 text-xs text-red-600">
								Sold
							</span>
						)}
						{car?.listingType === "RENT" && (
							<span className="rounded bg-green-100 px-2 py-1 text-xs text-green-600">
								For Rent
							</span>
						)}
						{car?.listingType === "SALE" && (
							<span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-600">
								For Sale
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Rejection Reason Modal */}
			<RejectionReasonModal
				isOpen={showRejectionModal}
				onClose={() => setShowRejectionModal(false)}
				car={car}
			/>
		</>
	);
};

export default CarCard;
