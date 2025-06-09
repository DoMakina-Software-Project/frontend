import { BookingWidget } from "../../ui";

function RightPanel({ carDetails, initialDates }) {
	const {
		brand,
		model,
		description,
		price,
		year,
		mileage,
		fuelType,
		transmission,
		listingType,
		sellerEmail,
		sellerPhone,
	} = carDetails;

	return (
		<div className="rounded-lg bg-gray-50 p-4 md:col-span-3">
			<h2 className="mb-4 text-2xl font-bold">
				{brand} {model}
			</h2>

			<p className="mb-4 text-gray-600">{description}</p>

			<div className="mb-6">
				<div className="rounded-lg bg-theme-blue p-4 text-white">
					<h3 className="text-xl font-bold">
						{listingType === "RENT"
							? `$${price} / day`
							: `$${price}`}
					</h3>
					<p className="text-blue-100">
						{listingType === "RENT"
							? "Available for rent"
							: "Available for sale"}
					</p>
				</div>
			</div>

			{/* ——— Car Details ——— */}
			<div className="mb-6">
				<h3 className="text-xl font-bold mb-2">Car Details</h3>
				<div className="space-y-2 text-gray-700">
					<div>
						<span className="font-medium">Model Year:</span> {year}
					</div>
					<div>
						<span className="font-medium">Mileage:</span> {mileage} km
					</div>
					<div>
						<span className="font-medium">Fuel Type:</span> {fuelType}
					</div>
					<div>
						<span className="font-medium">Transmission:</span> {transmission}
					</div>
				</div>
			</div>

			{/* ——— Booking Widget ——— */}
			{listingType === "RENT" && (
				<div className="mb-6">
					<BookingWidget
						car={carDetails}
						initialDates={initialDates}
					/>
				</div>
			)}

			{/* ——— Seller Information ——— */}
			<div className="mb-6 space-y-2">
				<h3 className="text-xl font-bold">Contact</h3>
				{sellerEmail && (
					<div className="flex items-center justify-between">
						<span>Email:</span>
						<a
							className="font-bold text-blue-600 hover:underline"
							href={`mailto:${sellerEmail}`}
						>
							{sellerEmail}
						</a>
					</div>
				)}
				{sellerPhone && (
					<div className="flex items-center justify-between">
						<span>Phone:</span>
						<a
							className="font-bold text-blue-600 hover:underline"
							href={`tel:${sellerPhone}`}
						>
							{sellerPhone}
						</a>
					</div>
				)}
			</div>
		</div>
	);
}

export default RightPanel;