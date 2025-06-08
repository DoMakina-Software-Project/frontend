import { useEffect } from "react";
import Select from "react-select";
import { ClipLoader } from "react-spinners";
import { Input } from "../../ui";

const BasicInfo = ({
	formState,
	setFormState,
	brands,
	yearOptions,
	onBrandSearch,
	currentYear,
}) => {
	const handleInputChange = (field, value) => {
		setFormState((prev) => ({
			...prev,
			[field]: { ...prev[field], value, error: "" },
		}));
	};

	const handleListingTypeChange = (value) => {
		setFormState((prev) => ({
			...prev,
			listingType: { value, error: "" },
			price: { ...prev.price, value: "", error: "" }, // Reset price when listing type changes
		}));
	};

	const brandOptions = brands.map((brand) => ({
		value: brand.id,
		label: brand.name,
	}));

	const yearSelectOptions = yearOptions.map((year) => ({
		value: year.toString(),
		label: year.toString(),
	}));

	const customSelectStyles = {
		container: (base) => ({
			...base,
			width: "100%",
		}),
		control: (base, state) => ({
			...base,
			minHeight: "38px",
			height: "38px",
			borderRadius: "0.375rem",
			borderColor: state.isFocused ? "#2563EB" : "#D1D5DB",
			boxShadow: state.isFocused ? "0 0 0 1px #2563EB" : "none",
			"&:hover": {
				borderColor: "#2563EB",
			},
			backgroundColor: state.isDisabled ? "#F3F4F6" : "white",
		}),
		option: (base, state) => ({
			...base,
			backgroundColor: state.isSelected
				? "#2563EB"
				: state.isFocused
				? "#EFF6FF"
				: "white",
			color: state.isSelected ? "white" : "#374151",
			"&:hover": {
				backgroundColor: state.isSelected ? "#2563EB" : "#EFF6FF",
			},
			cursor: "pointer",
			padding: "8px 12px",
		}),
		menu: (base) => ({
			...base,
			zIndex: 9999,
			boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
			borderRadius: "0.375rem",
			border: "1px solid #E5E7EB",
		}),
		menuList: (base) => ({
			...base,
			padding: "4px",
			maxHeight: "200px",
		}),
		placeholder: (base) => ({
			...base,
			color: "#9CA3AF",
			fontSize: "13px",
			lineHeight: "normal",
		}),
		singleValue: (base) => ({
			...base,
			color: "#374151",
			fontSize: "13px",
			lineHeight: "normal",
		}),
		input: (base) => ({
			...base,
			color: "#374151",
			margin: 0,
			padding: 0,
			fontSize: "13px",
			lineHeight: "normal",
		}),
		valueContainer: (base) => ({
			...base,
			padding: "0 8px",
			height: "36px",
		}),
		indicatorsContainer: (base) => ({
			...base,
			height: "36px",
		}),
		clearIndicator: (base) => ({
			...base,
			padding: "0 8px",
			cursor: "pointer",
			"&:hover": {
				color: "#DC2626",
			},
		}),
		dropdownIndicator: (base) => ({
			...base,
			padding: "0 8px",
			cursor: "pointer",
			"&:hover": {
				color: "#2563EB",
			},
		}),
		loadingIndicator: (base) => ({
			...base,
			padding: "0 8px",
		}),
		noOptionsMessage: (base) => ({
			...base,
			color: "#6B7280",
			padding: "8px 12px",
			fontSize: "13px",
		}),
	};

	const LoadingIndicator = () => (
		<div className="flex items-center justify-center p-2">
			<ClipLoader color="#2563EB" size={16} />
		</div>
	);

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold text-gray-800">
				Basic Information
			</h2>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				{/* Listing Type Selection */}
				<div className="col-span-2">
					<label className="block text-sm font-medium text-gray-700">
						How would you like to list your car?
					</label>
					<div className="mt-2 flex space-x-4">
						<button
							type="button"
							className={`flex-1 rounded-lg border p-4 text-center transition-colors duration-200 ${
								formState.listingType.value === "SALE"
									? "border-blue-500 bg-blue-50 text-blue-700"
									: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
							}`}
							onClick={() => handleListingTypeChange("SALE")}
						>
							For Sale
						</button>
						<button
							type="button"
							className={`flex-1 rounded-lg border p-4 text-center transition-colors duration-200 ${
								formState.listingType.value === "RENT"
									? "border-blue-500 bg-blue-50 text-blue-700"
									: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
							}`}
							onClick={() => handleListingTypeChange("RENT")}
						>
							For Rent
						</button>
					</div>
					{formState.listingType.error && (
						<p className="mt-1 text-sm text-red-600">
							{formState.listingType.error}
						</p>
					)}
				</div>

				{/* Brand Selection with React Select */}
				<div className="flex flex-col">
					<label
						htmlFor="brand"
						className="block text-sm font-medium text-gray-700"
					>
						Brand
					</label>
					<div className="mt-1 h-[38px]">
						<Select
							id="brand"
							value={brandOptions.find(
								(option) => option.value === formState.brand.value
							)}
							onChange={(option) =>
								handleInputChange("brand", option?.value || "")
							}
							options={brandOptions}
							placeholder="Search and select a brand"
							isClearable
							isSearchable
							onInputChange={(inputValue) => onBrandSearch(inputValue)}
							styles={customSelectStyles}
							className="h-full"
							components={{
								LoadingIndicator,
							}}
							noOptionsMessage={() => "No brands found"}
							loadingMessage={() => "Loading brands..."}
						/>
					</div>
					{formState.brand.error && (
						<p className="mt-1 text-sm text-red-600">
							{formState.brand.error}
						</p>
					)}
				</div>

				{/* Model */}
				<div>
					<label
						htmlFor="model"
						className="block text-sm font-medium text-gray-700"
					>
						Model
					</label>
					<Input
						type="text"
						placeholder="Enter car model"
						name="model"
						formState={formState}
						setFormState={setFormState}
						required
						minLength={2}
						maxLength={50}
						wrapperClassName="max-w-none mt-1"
					/>
				</div>

				{/* Year with React Select */}
				<div className="flex flex-col">
					<label
						htmlFor="year"
						className="block text-sm font-medium text-gray-700"
					>
						Year
					</label>
					<div className="mt-1 h-[38px]">
						<Select
							id="year"
							value={yearSelectOptions.find(
								(option) => option.value === formState.year.value
							)}
							onChange={(option) =>
								handleInputChange("year", option?.value || "")
							}
							options={yearSelectOptions}
							placeholder="Select year"
							isClearable
							isSearchable
							styles={customSelectStyles}
							className="h-full"
							noOptionsMessage={() => "No years found"}
							formatOptionLabel={(option) => (
								<div className="flex items-center">
									<span>{option.label}</span>
								</div>
							)}
						/>
					</div>
					{formState.year.error && (
						<p className="mt-1 text-sm text-red-600">
							{formState.year.error}
						</p>
					)}
				</div>

				{/* Price */}
				<div>
					<label
						htmlFor="price"
						className="block text-sm font-medium text-gray-700"
					>
						Price ({formState.listingType.value === "SALE" ? "USD" : "USD/day"})
					</label>
					<Input
						type="number"
						placeholder={
							formState.listingType.value === "SALE"
								? "Enter sale price"
								: "Enter daily rental price"
						}
						name="price"
						formState={formState}
						setFormState={setFormState}
						required
						min={0}
						step={1}
						wrapperClassName="max-w-none mt-1"
					/>
				</div>
			</div>
		</div>
	);
};

export default BasicInfo;
