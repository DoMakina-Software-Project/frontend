import { useState } from "react";
import { FaCalendarAlt, FaTimes, FaPlus, FaTrash } from "react-icons/fa";

const DateRangePicker = ({ onAddRange, onRemoveRange, disabled = false }) => {
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [error, setError] = useState("");

	const validateAndAddRange = () => {
		setError("");

		if (!startDate || !endDate) {
			setError("Both start and end dates are required");
			return;
		}

		const start = new Date(startDate);
		const end = new Date(endDate);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (start < today) {
			setError("Start date cannot be in the past");
			return;
		}

		if (start > end) {
			setError("Start date must be before or equal to end date");
			return;
		}

		onAddRange({
			startDate: start.toISOString().split("T")[0],
			endDate: end.toISOString().split("T")[0],
		});

		setStartDate("");
		setEndDate("");
	};

	const validateAndRemoveRange = () => {
		setError("");
		const validation = validateDateRange(startDate, endDate, false);

		if (!validation.isValid) {
			setError(validation.error);
			return;
		}

		onRemoveRange({
			startDate: new Date(startDate).toISOString().split("T")[0],
			endDate: new Date(endDate).toISOString().split("T")[0],
		});

		setStartDate("");
		setEndDate("");
	};

	const today = new Date().toISOString().split("T")[0];

	return (
		<div className="rounded-lg border border-gray-200 bg-white p-4">
			<div className="mb-4 flex items-center gap-2">
				<FaCalendarAlt className="text-theme-blue" />
				<h3 className="font-semibold text-gray-800">
					Availability Period
				</h3>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700">
						Start Date
					</label>
					<input
						type="date"
						value={startDate}
						onChange={(e) => setStartDate(e.target.value)}
						min={today}
						disabled={disabled}
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue disabled:bg-gray-100"
					/>
				</div>

				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700">
						End Date
					</label>
					<input
						type="date"
						value={endDate}
						onChange={(e) => setEndDate(e.target.value)}
						min={startDate || today}
						disabled={disabled}
						className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue disabled:bg-gray-100"
					/>
				</div>
			</div>

			{error && <div className="mt-2 text-sm text-red-600">{error}</div>}

			<div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
				<button
					onClick={validateAndAddRange}
					disabled={disabled || !startDate || !endDate}
					className="flex items-center justify-center gap-2 rounded-md bg-theme-blue px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
				>
					<FaPlus className="text-sm" />
					Add Availability
				</button>
				<button
					onClick={validateAndRemoveRange}
					disabled={disabled || !startDate || !endDate}
					className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-300"
				>
					<FaTrash className="text-sm" />
					Remove Availability
				</button>
			</div>
		</div>
	);
};

const AvailabilityPeriodsList = ({
	periods,
	onRemovePeriod,
	loading = false,
}) => {
	if (!periods || periods.length === 0) {
		return (
			<div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
				<FaCalendarAlt className="mx-auto mb-3 text-4xl text-gray-400" />
				<p className="text-gray-600">No availability periods set</p>
			</div>
		);
	}

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="space-y-3">
			<h3 className="font-semibold text-gray-800">
				Current Availability Periods
			</h3>
			{periods.map((period) => (
				<div
					key={`${period.startDate}-${period.endDate}`}
					className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
				>
					<div className="flex items-center gap-3">
						<FaCalendarAlt className="text-theme-blue" />
						<div>
							<p className="font-medium text-gray-800">
								{formatDate(period.startDate)} -{" "}
								{formatDate(period.endDate)}
							</p>
							<p className="text-sm text-gray-500">
								{(() => {
									const start = new Date(period.startDate);
									const end = new Date(period.endDate);
									const diffTime = Math.abs(end - start);
									const diffDays =
										Math.ceil(
											diffTime / (1000 * 60 * 60 * 24),
										) + 1;
									return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
								})()}
							</p>
						</div>
					</div>
					<button
						onClick={() => onRemovePeriod(period)}
						disabled={loading}
						className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
						title="Remove this period"
					>
						<FaTimes />
					</button>
				</div>
			))}
		</div>
	);
};

export { DateRangePicker, AvailabilityPeriodsList };
