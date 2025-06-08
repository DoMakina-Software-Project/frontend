import { Link } from "react-router-dom";

export default function ServicesSection() {
	return (
		<div className="flex w-full items-center justify-center bg-theme-blue px-6 py-16 lg:px-14">
			<div className="flex max-w-7xl flex-col gap-8 rounded-lg md:flex-row">
				{/* Left Section (Text) */}
				<div className="mb-12 text-white md:mb-0 md:w-2/3">
					<h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
						Your One-Stop Car Solution in Albania
					</h2>
					<p className="text-lg opacity-90 md:text-xl">
						Whether you&apos;re looking to buy, sell, or rent a car
						in Albania, DoMakina provides a secure and efficient
						platform. Browse through our extensive collection of
						vehicles or list your car today.
					</p>
				</div>

				{/* Right Section (Service Cards) */}
				<div className="w-full space-y-6 rounded-2xl bg-white p-6 md:w-1/3">
					{/* Buy Car Card */}
					<div className="block">
						<div>
							<div className="mb-2 flex items-center justify-between">
								<h3 className="text-2xl font-semibold text-gray-900">
									Buy or Rent
								</h3>
							</div>
							<p className="mb-4 text-gray-500">
								Browse our selection of cars available for
								purchase or rent across Albania. From luxury
								vehicles to practical daily drivers, find the
								perfect car for your needs.
							</p>
						</div>
					</div>

					{/* Sell Car Card */}
					<div className="block">
						<div className="border-t pt-6">
							<div className="mb-2 flex items-center justify-between">
								<h3 className="text-2xl font-semibold text-gray-900">
									List Your Car
								</h3>
								<Link
									to="/sign-up"
									className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-500"
								>
									Start Now
								</Link>
							</div>
							<p className="mb-4 text-gray-500">
								List your car for sale or rent on Albania&apos;s
								trusted automotive marketplace. Reach buyers
								from Tirana, Durrës, and across the country.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
