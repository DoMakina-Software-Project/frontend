import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./";
import { FaCalendarAlt, FaSearch, FaEye } from "react-icons/fa";

const BookingFlowTest = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(1);

	const steps = [
		{
			id: 1,
			title: "Search Cars",
			description: "Find cars by type and availability",
			action: () => navigate("/search"),
			icon: <FaSearch />,
		},
		{
			id: 2,
			title: "Select & Book",
			description: "Choose dates and confirm booking",
			action: () => navigate("/search"),
			icon: <FaCalendarAlt />,
		},
		{
			id: 3,
			title: "Manage Bookings",
			description: "View and manage your bookings",
			action: () => navigate("/client/bookings"),
			icon: <FaEye />,
		},
	];

	return (
		<div className="rounded-lg bg-blue-50 p-6">
			<h3 className="mb-4 text-lg font-semibold text-blue-900">
				Complete Booking Flow
			</h3>
			<div className="space-y-4">
				{steps.map((step) => (
					<div
						key={step.id}
						className={`flex items-center gap-4 rounded-lg p-4 transition-colors ${
							currentStep >= step.id
								? "bg-white shadow-sm"
								: "bg-blue-100"
						}`}
					>
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-full ${
								currentStep >= step.id
									? "bg-theme-blue text-white"
									: "bg-gray-300 text-gray-600"
							}`}
						>
							{step.icon}
						</div>
						<div className="flex-1">
							<h4 className="font-medium text-gray-900">
								{step.title}
							</h4>
							<p className="text-sm text-gray-600">
								{step.description}
							</p>
						</div>
						<Button
							size="small"
							onClick={() => {
								setCurrentStep(step.id);
								step.action();
							}}
						>
							Try Now
						</Button>
					</div>
				))}
			</div>
		</div>
	);
};

export default BookingFlowTest;
