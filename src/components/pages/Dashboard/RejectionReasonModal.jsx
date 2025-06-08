import { MdClose, MdCancel } from "react-icons/md";

const RejectionReasonModal = ({ isOpen, onClose, car }) => {
	if (!isOpen || !car) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<MdCancel className="text-red-600" size={24} />
						<h2 className="text-lg font-semibold text-gray-900">
							Car Rejected
						</h2>
					</div>
					<button
						onClick={onClose}
						className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					>
						<MdClose size={20} />
					</button>
				</div>

				<div className="mb-4">
					<h3 className="font-medium text-gray-900">
						{car.brand} {car.model} ({car.year})
					</h3>
					<p className="text-sm text-gray-600">
						Price: ${car.price?.toLocaleString()}
						{car.listingType === "RENT" && "/day"}
					</p>
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
						<li>• Update your car listing to address the issues</li>
						<li>
							• Your car will be automatically re-submitted for
							review
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

export default RejectionReasonModal;
