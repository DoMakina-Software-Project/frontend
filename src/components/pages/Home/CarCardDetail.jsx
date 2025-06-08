import { GiSteeringWheel } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

export default function CarDetailsCard({ data }) {
	const navigate = useNavigate();
	if (!data) return null;

	return (
		<div className="max-w-xs rounded-lg bg-gray-800 p-4 transition-all duration-150 hover:scale-[1.02]">
			<div className="mb-4 flex items-start justify-between">
				<div>
					<h3 className="text-xl font-bold text-white">
						{data?.brand} {data?.model}
					</h3>
				</div>
				<div className="flex gap-2">
					<span className="rounded bg-white px-2 py-1 text-xs font-bold text-green-700">
						Promoted
					</span>
					{data?.listingType === "RENT" && (
						<span className="rounded bg-white px-2 py-1 text-xs font-bold text-green-700">
							For Rent
						</span>
					)}
					{data?.listingType === "SALE" && (
						<span className="rounded bg-white px-2 py-1 text-xs font-bold text-yellow-600">
							For Sale
						</span>
					)}
				</div>
			</div>

			<div className="mb-4 h-52">
				<img
					src={data?.images?.[0] || "/placeholder.jpg"}
					alt={`${data?.model}`}
					className="h-full w-full rounded-lg object-cover"
				/>
			</div>

			<div className="mb-4 flex items-center justify-between">
				<button className="flex items-center gap-2 text-white">
					<GiSteeringWheel className="h-5 w-5" />
				</button>
				<span className="text-xl font-bold text-white">
					${data?.price?.toLocaleString() || "N/A"}{" "}
					{data?.listingType === "RENT" && (
						<span className="text-sm text-gray-300">/day</span>
					)}
				</span>
			</div>

			<button
				onClick={() => navigate(`/car/${data?.id}`)}
				className="w-full rounded-lg bg-theme-blue py-3 font-semibold text-white"
			>
				View Car
			</button>
		</div>
	);
}
