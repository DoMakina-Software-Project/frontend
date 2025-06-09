import { useState, useEffect } from "react";
import { MainLayout } from "../../components/layouts";
import { CarCard } from "../../components/pages/Search";
import { FiFilter } from "react-icons/fi";
import { useApi } from "../../hooks";
import useDebounce from "../../hooks/useDebounce";
import { searchCars, getAllBrandsSimple } from "../../api/public";
import { FaCar, FaHome, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { ALBANIAN_CITIES } from "../../data/cities";
import Select from "react-select";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const currentYear = new Date().getFullYear();
const yearRange = Array.from(
	{ length: currentYear - 1989 },
	(_, i) => currentYear - i,
);

const fuelTypes = ["PETROL", "DIESEL", "ELECTRIC", "HYBRID", "OTHER"];
const transmissionTypes = ["MANUAL", "AUTOMATIC", "SEMI_AUTOMATIC"];

const SearchPage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [brands, setBrands] = useState([]);
	const [selectedBrand, setSelectedBrand] = useState(null);
	const [modelSearch, setModelSearch] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [minYear, setMinYear] = useState("");
	const [maxYear, setMaxYear] = useState("");
	const [minMileage, setMinMileage] = useState("");
	const [maxMileage, setMaxMileage] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const [selectedFuelType, setSelectedFuelType] = useState("");
	const [selectedTransmission, setSelectedTransmission] = useState("");
	const [cars, setCars] = useState([]);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [page, setPage] = useState(1);
	const [totalItems, setTotalItems] = useState(0);

	// Debounced values for search
	const debouncedMinPrice = useDebounce(minPrice);
	const debouncedMaxPrice = useDebounce(maxPrice);
	const debouncedMinMileage = useDebounce(minMileage);
	const debouncedMaxMileage = useDebounce(maxMileage);
	const debouncedModelSearch = useDebounce(modelSearch);

	const [listingType, setListingType] = useState("SALE");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	const { handleApiCall: getBrandsApiCall, loading: loadingBrands } =
		useApi(getAllBrandsSimple);

	const { handleApiCall: searchCarsApiCall, loading: loadingCars } = useApi(
		searchCars,
		{
			onError: () => {
				toast.error("Failed to search cars");
			},
		},
	);

	useEffect(() => {
		// Reset pagination when filters change
		setPage(1);
		searchCarsApiCall({
			page: 1,
			minPrice: debouncedMinPrice || undefined,
			maxPrice: debouncedMaxPrice || undefined,
			minYear: minYear || undefined,
			maxYear: maxYear || undefined,
			minMileage: debouncedMinMileage || undefined,
			maxMileage: debouncedMaxMileage || undefined,
			brandIds: selectedBrand ? [selectedBrand.value] : undefined,
			modelSearch: debouncedModelSearch || undefined,
			city: selectedCity || undefined,
			fuelType: selectedFuelType || undefined,
			transmission: selectedTransmission || undefined,
			listingType,
			startDate: startDate || undefined,
			endDate: endDate || undefined,
		}).then((data) => {
			if (data) {
				setCars(data.results);
				setHasNextPage(data.hasNextPage);
				setTotalItems(data.totalItems);
			}
		});
	}, [
		selectedBrand,
		debouncedModelSearch,
		debouncedMinPrice,
		debouncedMaxPrice,
		debouncedMinMileage,
		debouncedMaxMileage,
		minYear,
		maxYear,
		selectedCity,
		selectedFuelType,
		selectedTransmission,
		listingType,
		startDate,
		endDate,
	]);

	useEffect(() => {
		// Load more results when page changes
		if (page > 1) {
			searchCarsApiCall({
				page,
				minPrice: debouncedMinPrice || undefined,
				maxPrice: debouncedMaxPrice || undefined,
				minYear: minYear || undefined,
				maxYear: maxYear || undefined,
				minMileage: debouncedMinMileage || undefined,
				maxMileage: debouncedMaxMileage || undefined,
				brandIds: selectedBrand ? [selectedBrand.value] : undefined,
				modelSearch: debouncedModelSearch || undefined,
				city: selectedCity || undefined,
				fuelType: selectedFuelType || undefined,
				transmission: selectedTransmission || undefined,
				listingType,
				startDate: startDate || undefined,
				endDate: endDate || undefined,
			}).then((data) => {
				if (data) {
					setCars((prev) => [...prev, ...data.results]);
					setHasNextPage(data.hasNextPage);
					setTotalItems(data.totalItems);
				}
			});
		}
	}, [page]);

	useEffect(() => {
		getBrandsApiCall().then((data) => {
			if (data) {
				const brandOptions = data.map((brand) => ({
					value: brand.id,
					label: brand.name,
				}));
				setBrands(brandOptions);
			}
		});
	}, []);

	// Validation functions
	const isValidListingType = (type) => ["SALE", "RENT"].includes(type);
	const isValidDate = (dateString) => {
		if (!dateString) return false;
		const regex = /^\d{4}-\d{2}-\d{2}$/;
		return regex.test(dateString) && !isNaN(new Date(dateString).getTime());
	};
	const isValidNumber = (value) => {
		const num = parseFloat(value);
		return !isNaN(num) && num >= 0;
	};
	const isValidYear = (year) => {
		const yearNum = parseInt(year);
		return !isNaN(yearNum) && yearNum >= 1990 && yearNum <= currentYear;
	};
	const isValidFuelType = (type) => fuelTypes.includes(type);
	const isValidTransmission = (type) => transmissionTypes.includes(type);
	const isValidCity = (city) => ALBANIAN_CITIES.includes(city);

	// Initialize state from URL parameters on component mount (only once)
	useEffect(() => {
		if (isInitialized) return;

		const urlListingType = searchParams.get("listingType");
		const urlStartDate = searchParams.get("startDate");
		const urlEndDate = searchParams.get("endDate");
		const urlBrandId = searchParams.get("brandId");
		const urlModelSearch = searchParams.get("modelSearch");
		const urlCity = searchParams.get("city");
		const urlFuelType = searchParams.get("fuelType");
		const urlTransmission = searchParams.get("transmission");
		const urlMinPrice = searchParams.get("minPrice");
		const urlMaxPrice = searchParams.get("maxPrice");
		const urlMinYear = searchParams.get("minYear");
		const urlMaxYear = searchParams.get("maxYear");
		const urlMinMileage = searchParams.get("minMileage");
		const urlMaxMileage = searchParams.get("maxMileage");

		// Validate and set parameters
		if (urlListingType && isValidListingType(urlListingType)) {
			setListingType(urlListingType);
		}
		if (urlStartDate && isValidDate(urlStartDate)) {
			setStartDate(urlStartDate);
		}
		if (urlEndDate && isValidDate(urlEndDate)) {
			setEndDate(urlEndDate);
		}
		if (urlModelSearch && urlModelSearch.trim().length > 0) {
			setModelSearch(urlModelSearch.trim());
		}
		if (urlCity && isValidCity(urlCity)) {
			setSelectedCity(urlCity);
		}
		if (urlFuelType && isValidFuelType(urlFuelType)) {
			setSelectedFuelType(urlFuelType);
		}
		if (urlTransmission && isValidTransmission(urlTransmission)) {
			setSelectedTransmission(urlTransmission);
		}
		if (urlMinPrice && isValidNumber(urlMinPrice)) {
			setMinPrice(urlMinPrice);
		}
		if (urlMaxPrice && isValidNumber(urlMaxPrice)) {
			setMaxPrice(urlMaxPrice);
		}
		if (urlMinYear && isValidYear(urlMinYear)) {
			setMinYear(urlMinYear);
		}
		if (urlMaxYear && isValidYear(urlMaxYear)) {
			setMaxYear(urlMaxYear);
		}
		if (urlMinMileage && isValidNumber(urlMinMileage)) {
			setMinMileage(urlMinMileage);
		}
		if (urlMaxMileage && isValidNumber(urlMaxMileage)) {
			setMaxMileage(urlMaxMileage);
		}

		// Handle brand selection after brands are loaded
		if (urlBrandId && brands.length > 0) {
			const brandId = parseInt(urlBrandId);
			if (!isNaN(brandId)) {
				const brand = brands.find((b) => b.value === brandId);
				if (brand) setSelectedBrand(brand);
			}
		}

		setIsInitialized(true);
	}, [searchParams, brands, isInitialized]);

	const handleResetFilters = () => {
		setSelectedBrand(null);
		setModelSearch("");
		setMinPrice("");
		setMaxPrice("");
		setMinYear("");
		setMaxYear("");
		setMinMileage("");
		setMaxMileage("");
		setSelectedCity("");
		setSelectedFuelType("");
		setSelectedTransmission("");
		setStartDate("");
		setEndDate("");
		setPage(1);
		// Clear URL params as well
		setSearchParams(new URLSearchParams(), { replace: true });
	};

	const handleListingTypeChange = (type) => {
		setListingType(type);
		setStartDate("");
		setEndDate("");
		setPage(1);
	};

	const loadMore = () => {
		setPage((prevPage) => prevPage + 1);
	};

	const handleDateChange = (e, type) => {
		const value = e.target.value;
		if (type === "start") {
			setStartDate(value);
		} else {
			setEndDate(value);
		}
		setPage(1);
	};

	const getMinDate = () => {
		const today = new Date();
		return today.toISOString().split("T")[0];
	};

	const validateDates = () => {
		if (listingType === "RENT" && startDate && endDate) {
			const start = new Date(startDate);
			const end = new Date(endDate);
			if (start > end) {
				toast.error("Return date must be after pickup date");
				return false;
			}
		}
		return true;
	};

	useEffect(() => {
		validateDates();
	}, [startDate, endDate, listingType]);

	// Update URL parameters when search criteria change (only after initialization)
	useEffect(() => {
		if (!isInitialized) return;

		const params = new URLSearchParams();

		// Only add valid parameters to URL
		if (listingType && isValidListingType(listingType)) {
			params.set("listingType", listingType);
		}
		if (startDate && listingType === "RENT" && isValidDate(startDate)) {
			params.set("startDate", startDate);
		}
		if (endDate && listingType === "RENT" && isValidDate(endDate)) {
			params.set("endDate", endDate);
		}
		if (selectedBrand && selectedBrand.value) {
			params.set("brandId", selectedBrand.value.toString());
		}
		if (modelSearch && modelSearch.trim().length > 0) {
			params.set("modelSearch", modelSearch.trim());
		}
		if (selectedCity && isValidCity(selectedCity)) {
			params.set("city", selectedCity);
		}
		if (selectedFuelType && isValidFuelType(selectedFuelType)) {
			params.set("fuelType", selectedFuelType);
		}
		if (selectedTransmission && isValidTransmission(selectedTransmission)) {
			params.set("transmission", selectedTransmission);
		}
		if (minPrice && isValidNumber(minPrice)) {
			params.set("minPrice", minPrice);
		}
		if (maxPrice && isValidNumber(maxPrice)) {
			params.set("maxPrice", maxPrice);
		}
		if (minYear && isValidYear(minYear)) {
			params.set("minYear", minYear);
		}
		if (maxYear && isValidYear(maxYear)) {
			params.set("maxYear", maxYear);
		}
		if (minMileage && isValidNumber(minMileage)) {
			params.set("minMileage", minMileage);
		}
		if (maxMileage && isValidNumber(maxMileage)) {
			params.set("maxMileage", maxMileage);
		}

		setSearchParams(params, { replace: true });
	}, [
		isInitialized,
		listingType,
		startDate,
		endDate,
		selectedBrand,
		modelSearch,
		selectedCity,
		selectedFuelType,
		selectedTransmission,
		minPrice,
		maxPrice,
		minYear,
		maxYear,
		minMileage,
		maxMileage,
		setSearchParams,
	]);

	return (
		<MainLayout
			mainOptions={{
				paddingVertical: false,
			}}
		>
			<div className="w-full space-y-4 px-4 py-6 md:space-y-8">
				{/* Header */}
				<div className="flex flex-col items-center gap-4">
					<div className="w-full max-w-4xl">
						<h1 className="mb-6 text-center text-3xl font-bold text-gray-900">
							Find Your Perfect Car
						</h1>

						{/* Listing Type Selector - MANDATORY */}
						<div className="mb-6 flex justify-center">
							<div className="rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
								<div className="flex">
									<button
										onClick={() =>
											handleListingTypeChange("SALE")
										}
										className={`flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors ${
											listingType === "SALE"
												? "bg-theme-blue text-white"
												: "text-gray-600 hover:bg-gray-50"
										}`}
									>
										<FaHome />
										Buy Car
									</button>
									<button
										onClick={() =>
											handleListingTypeChange("RENT")
										}
										className={`flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors ${
											listingType === "RENT"
												? "bg-theme-blue text-white"
												: "text-gray-600 hover:bg-gray-50"
										}`}
									>
										<FaCalendarAlt />
										Rent Car
									</button>
								</div>
							</div>
						</div>

						{/* Date Range for Rental Cars */}
						{listingType === "RENT" && (
							<div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
								<div className="mb-3 flex items-center gap-2 text-blue-800">
									<FaInfoCircle />
									<span className="font-medium">
										Select your rental dates
									</span>
								</div>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div>
										<label className="mb-2 block text-sm font-medium text-blue-700">
											Pickup Date
										</label>
										<input
											type="date"
											value={startDate}
											onChange={(e) =>
												handleDateChange(e, "start")
											}
											min={getMinDate()}
											className="w-full rounded-lg border border-blue-300 p-3 focus:border-theme-blue focus:outline-none"
											required
										/>
									</div>
									<div>
										<label className="mb-2 block text-sm font-medium text-blue-700">
											Return Date
										</label>
										<input
											type="date"
											value={endDate}
											onChange={(e) =>
												handleDateChange(e, "end")
											}
											min={startDate || getMinDate()}
											className="w-full rounded-lg border border-blue-300 p-3 focus:border-theme-blue focus:outline-none"
											required
										/>
									</div>
								</div>
								{listingType === "RENT" &&
									(!startDate || !endDate) && (
										<div className="mt-3 text-sm text-blue-600">
											Please select both pickup and return
											dates to see available cars.
										</div>
									)}
							</div>
						)}
					</div>

					<div className="flex w-full items-center justify-between gap-4 md:w-auto">
						<button
							className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-2 text-sm md:hidden"
							onClick={() => setIsFilterOpen(!isFilterOpen)}
						>
							<FiFilter />
							Filters
						</button>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex flex-col gap-8 md:flex-row">
					{/* Sidebar */}
					<div
						className={`w-full md:w-64 md:flex-shrink-0 ${
							isFilterOpen ? "block" : "hidden md:block"
						}`}
					>
						<div className="rounded-xl bg-white p-4 shadow-md">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="font-medium">Filters</h3>
								<button
									className="text-sm text-blue-600 hover:text-blue-800"
									onClick={handleResetFilters}
								>
									Reset All
								</button>
							</div>

							<div className="space-y-4">
								{/* Brand Filter */}
								<div>
									<h4 className="mb-2 text-sm font-medium">
										Brand
									</h4>
									{loadingBrands ? (
										<div className="flex items-center justify-center py-4">
											<div className="h-4 w-4 animate-spin rounded-full border-2 border-theme-blue border-t-transparent"></div>
										</div>
									) : (
										<Select
											value={selectedBrand}
											onChange={setSelectedBrand}
											options={brands}
											isClearable
											placeholder="Select Brand"
											className="text-sm"
											classNamePrefix="react-select"
										/>
									)}
								</div>

								{/* Model Search */}
								<div>
									<h4 className="mb-2 text-sm font-medium">
										Model Search
									</h4>
									<input
										type="text"
										value={modelSearch}
										onChange={(e) =>
											setModelSearch(e.target.value)
										}
										placeholder="Search by model..."
										className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-theme-blue focus:outline-none"
									/>
								</div>

								{/* City Filter */}
								<div>
									<h4 className="mb-2 text-sm font-medium">
										City
									</h4>
									<Select
										value={
											selectedCity
												? {
														value: selectedCity,
														label: selectedCity,
													}
												: null
										}
										onChange={(option) =>
											setSelectedCity(
												option ? option.value : "",
											)
										}
										options={ALBANIAN_CITIES.map(
											(city) => ({
												value: city,
												label: city,
											}),
										)}
										isClearable
										placeholder="Select City"
										className="text-sm"
										classNamePrefix="react-select"
									/>
								</div>

								{/* Year Filter */}
								<div>
									<h4 className="mb-2 text-sm font-medium">
										Year Range
									</h4>
									<div className="flex items-center space-x-2">
										<select
											value={minYear}
											onChange={(e) =>
												setMinYear(e.target.value)
											}
											className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-theme-blue focus:outline-none"
										>
											<option value="">Min Year</option>
											{yearRange.map((year) => (
												<option key={year} value={year}>
													{year}
												</option>
											))}
										</select>
										<span className="text-sm text-gray-500">
											to
										</span>
										<select
											value={maxYear}
											onChange={(e) =>
												setMaxYear(e.target.value)
											}
											className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-theme-blue focus:outline-none"
										>
											<option value="">Max Year</option>
											{yearRange.map((year) => (
												<option key={year} value={year}>
													{year}
												</option>
											))}
										</select>
									</div>
								</div>

								{/* Price Filter */}
								<div>
									<h4 className="mb-2 text-sm font-medium">
										Price Range{" "}
										{listingType === "RENT"
											? "(per day)"
											: ""}
									</h4>
									<div className="flex items-center space-x-2">
										<input
											type="number"
											min="0"
											value={minPrice}
											onChange={(e) =>
												setMinPrice(e.target.value)
											}
											className="w-full rounded border border-gray-300 px-2 py-1 text-sm [appearance:textfield] focus:border-theme-blue focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
											placeholder="Min"
										/>
										<span className="text-sm text-gray-500">
											to
										</span>
										<input
											type="number"
											min="0"
											value={maxPrice}
											onChange={(e) =>
												setMaxPrice(e.target.value)
											}
											className="w-full rounded border border-gray-300 px-2 py-1 text-sm [appearance:textfield] focus:border-theme-blue focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
											placeholder="Max"
										/>
									</div>
								</div>

								{/* Mileage Filter */}
								<div>
									<h4 className="mb-2 text-sm font-medium">
										Mileage (km)
									</h4>
									<div className="flex items-center space-x-2">
										<input
											type="number"
											min="0"
											value={minMileage}
											onChange={(e) =>
												setMinMileage(e.target.value)
											}
											className="w-full rounded border border-gray-300 px-2 py-1 text-sm [appearance:textfield] focus:border-theme-blue focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
											placeholder="Min"
										/>
										<span className="text-sm text-gray-500">
											to
										</span>
										<input
											type="number"
											min="0"
											value={maxMileage}
											onChange={(e) =>
												setMaxMileage(e.target.value)
											}
											className="w-full rounded border border-gray-300 px-2 py-1 text-sm [appearance:textfield] focus:border-theme-blue focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
											placeholder="Max"
										/>
									</div>
								</div>

								{/* Fuel Type Filter */}
								<div>
									<h4 className="mb-2 text-sm font-medium">
										Fuel Type
									</h4>
									<select
										value={selectedFuelType}
										onChange={(e) =>
											setSelectedFuelType(e.target.value)
										}
										className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-theme-blue focus:outline-none"
									>
										<option value="">All Fuel Types</option>
										{fuelTypes.map((type) => (
											<option key={type} value={type}>
												{type.charAt(0) +
													type.slice(1).toLowerCase()}
											</option>
										))}
									</select>
								</div>

								{/* Transmission Filter */}
								<div>
									<h4 className="mb-2 text-sm font-medium">
										Transmission
									</h4>
									<select
										value={selectedTransmission}
										onChange={(e) =>
											setSelectedTransmission(
												e.target.value,
											)
										}
										className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-theme-blue focus:outline-none"
									>
										<option value="">
											All Transmissions
										</option>
										{transmissionTypes.map((type) => (
											<option key={type} value={type}>
												{type.charAt(0) +
													type
														.slice(1)
														.toLowerCase()
														.replace("_", " ")}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>
					</div>

					{/* Car Grid */}
					<div className="flex-1">
						{/* Results Info */}
						<div className="mb-4 flex items-center justify-between">
							<div className="text-sm text-gray-600">
								{totalItems > 0 && (
									<span>
										Showing {cars.length} of {totalItems}{" "}
										results
										{listingType === "RENT" &&
											startDate &&
											endDate && (
												<>
													{" "}
													for{" "}
													{new Date(
														startDate,
													).toLocaleDateString()}{" "}
													-{" "}
													{new Date(
														endDate,
													).toLocaleDateString()}
												</>
											)}
									</span>
								)}
							</div>
						</div>

						{/* Loading State */}
						{loadingCars && cars.length === 0 ? (
							<div className="flex items-center justify-center py-12">
								<div className="text-center">
									<div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
									<p className="text-gray-600">
										Searching for cars...
									</p>
								</div>
							</div>
						) : cars.length === 0 ? (
							<div className="rounded-lg bg-white p-12 text-center shadow-sm">
								<FaCar className="mx-auto mb-4 text-6xl text-gray-400" />
								<h3 className="mb-2 text-xl font-semibold text-gray-900">
									No cars found
								</h3>
								<p className="text-gray-600">
									{listingType === "RENT" &&
									(!startDate || !endDate)
										? "Please select pickup and return dates to see available rental cars."
										: "Try adjusting your filters to see more results."}
								</p>
							</div>
						) : (
							<>
								{/* Car Grid */}
								<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
									{cars.map((car) => (
										<CarCard key={car.id} car={car} />
									))}
								</div>

								{/* Load More Button */}
								{hasNextPage && (
									<div className="mt-8 flex justify-center">
										<button
											onClick={loadMore}
											className="rounded-full bg-theme-blue px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
											disabled={loadingCars}
										>
											{loadingCars
												? "Loading..."
												: "Load More"}
										</button>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default SearchPage;
