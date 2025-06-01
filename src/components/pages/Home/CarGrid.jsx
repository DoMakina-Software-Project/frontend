import { FaChevronRight } from "react-icons/fa";
import { CarCard } from "../Search";
import { Link } from "react-router-dom";
import { useApi } from "../../../hooks";
import { fetchHomeCars } from "../../../api/public";
import { useEffect, useState } from "react";

export default function CarGrid() {
	const { handleApiCall, loading } = useApi(fetchHomeCars);
	const [cars, setCars] = useState([]);

	useEffect(() => {
		handleApiCall().then((data) => {
			setCars(data);
		});
	}, []);

	if (loading) {
		return (
			<div className="flex w-full items-center justify-center px-6 lg:px-14">
				<div className="flex w-full max-w-7xl flex-col items-center justify-center">
					<h2 className="text-center text-2xl font-semibold text-gray-700">
						Loading cars...
					</h2>
				</div>
			</div>
		);
	}

	return cars.length === 0 ? (
		<div className="flex w-full items-center justify-center px-6 lg:px-14">
			<div className="flex w-full max-w-7xl flex-col items-center justify-center">
				<h2 className="text-center text-2xl font-semibold text-gray-700">
					No cars found. Please try again later.
				</h2>
			</div>
		</div>
	) : (
		<div className="flex w-full items-center justify-center px-6 lg:px-14">
			<div className="flex w-full max-w-7xl flex-col items-center justify-center">
				{/* Advanced Search Button */}
				<div className="mb-6 flex self-end">
					<Link
						className="flex items-center gap-2 rounded bg-blue-100 px-4 py-2 font-semibold text-blue-700 duration-150 hover:bg-blue-500 hover:text-white"
						to="/search"
					>
						Advanced Search <FaChevronRight />
					</Link>
				</div>

				{/* Car Cards Grid */}
				<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
					{cars.map((car, index) => (
						<CarCard key={index} car={car} />
					))}
				</div>
			</div>
		</div>
	);
}
