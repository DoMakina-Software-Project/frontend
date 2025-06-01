import { useState, useEffect } from "react";
import { MainLayout } from "../../components/layouts";
import { CarCard } from "../../components/pages/Search";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useApi } from "../../hooks";
import { searchCars, getAllBrands } from "../../api/public";
import { use } from "react";

const SearchPage = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [brands, setBrands] = useState([]);
	const [selectedBrandIds, setSelectedBrandIds] = useState([]);
	const [minPrice, setMinPrice] = useState();
	const [maxPrice, setMaxPrice] = useState();
	const [cars, setCars] = useState([]);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [page, setPage] = useState(1);

	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const { handleApiCall: getBrandsApiCall, loading: loadingBrands } =
		useApi(getAllBrands);

	const { handleApiCall: searchCarsApiCall, loading: loadingCars } =
		useApi(searchCars);

	useEffect(() => {
		searchCarsApiCall({
			page,
			minPrice,
			maxPrice,
			brandIds: selectedBrandIds,
		}).then((data) => {
			setCars(data.results);
			setHasNextPage(data.hasNextPage);
		});
	}, [selectedBrandIds, minPrice, maxPrice, page]);

	useEffect(() => {
		getBrandsApiCall().then((data) => {
			setBrands(data);
		});
	}, []);

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};
	const handleResetFilters = () => {
		setSearchTerm("");
		setSelectedBrandIds([]);
		setMinPrice("");

		setMaxPrice("");
	};

	const loadMore = () => {
		setPage((prevPage) => prevPage + 1);
	};
	const handlePriceChange = (e, type) => {
		const value = e.target.value;
		if (type === "min") {
			setMinPrice(value);
		} else {
			setMaxPrice(value);
		}
	};

	return (
		<MainLayout
			mainOptions={{
				paddingVertical: false,
			}}
		>
			<div className="w-full space-y-4 px-4 py-6 md:space-y-8">
				{/* Header */}
				<div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
					{/* <div className="relative w-full max-w-2xl">
						<FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Find car here..."
							className="w-full rounded-full border border-gray-200 py-2 pl-10 pr-4"
							value={searchTerm}
							onChange={handleSearchChange}
						/>
					</div> */}

					<div className="flex w-full items-center justify-between gap-4 md:w-auto">
						<button
							className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-2 text-sm md:hidden"
							onClick={() => setIsFilterOpen(!isFilterOpen)}
						>
							<FiFilter />
							Filter
						</button>
					</div>
				</div>

				{/* Main Content */}
				<div className="flex flex-col gap-8 md:flex-row">
					{/* Sidebar */}
					<div
						className={`w-full md:w-64 md:flex-shrink-0 ${isFilterOpen ? "block" : "hidden md:block"}`}
					>
						<div className="rounded-xl bg-white p-4 shadow-md">
							<div className="mb-4 flex items-center justify-between">
								<h3 className="font-medium">Filter</h3>
								<button
									className="text-sm text-blue-600"
									onClick={handleResetFilters}
								>
									Reset
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<h4 className="mb-2 text-sm font-medium">
										Brand
									</h4>
									<div className="space-y-2">
										{brands.map((brand) => (
											<label
												key={brand.id}
												className="flex items-center gap-2"
											>
												<input
													type="checkbox"
													className="rounded"
													checked={selectedBrandIds.includes(
														brand.id,
													)}
													onChange={(e) => {
														if (e.target.checked) {
															setSelectedBrandIds(
																[
																	...selectedBrandIds,
																	brand.id,
																],
															);
														} else {
															setSelectedBrandIds(
																selectedBrandIds.filter(
																	(id) =>
																		id !==
																		brand.id,
																),
															);
														}
													}}
												/>
												<span className="text-sm">
													{brand.name}
												</span>
											</label>
										))}
									</div>
								</div>

								{/* Price Filter */}
								<div>
									<h4 className="mb-2 text-sm font-medium">
										Price
									</h4>
									<div className="flex items-center space-x-2">
										<input
											type="number"
											min="0"
											value={minPrice}
											onChange={(e) =>
												handlePriceChange(e, "min")
											}
											className="w-full rounded border px-2 py-1 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
											placeholder="Min"
										/>
										<span className="text-sm">to</span>
										<input
											type="number"
											min="0"
											value={maxPrice}
											onChange={(e) =>
												handlePriceChange(e, "max")
											}
											className="w-full rounded border px-2 py-1 text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
											placeholder="Max"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Car Grid */}
					<div className="flex-1">
						<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{cars.map((car) => (
								<CarCard key={car.id} car={car} />
							))}
						</div>
						{hasNextPage && (
							<div className="mt-8 flex justify-center">
								<button
									onClick={loadMore}
									className="rounded-full bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
									disabled={loadingCars}
								>
									{loadingCars ? "Loading..." : "Load More"}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default SearchPage;
