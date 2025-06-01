import { Link } from "react-router-dom";

export default function ServicesSection() {
	return (
		<div className="flex w-full items-center justify-center bg-theme-blue px-6 py-16 lg:px-14">
			<div className="flex max-w-7xl flex-col gap-8 rounded-lg md:flex-row">
				{/* Left Section (Text) */}
				<div className="mb-12 text-white md:mb-0 md:w-2/3">
					<h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
						All the service we will provide you
					</h2>
					<p className="text-lg opacity-90 md:text-xl">
						Get the car of your dreams with the installments of your
						choice. There are various attractive offers from Moladin
						through our collaboration with various trusted leasing
						partners.
					</p>
				</div>

				{/* Right Section (Service Cards) */}
				<div className="w-full space-y-6 rounded-2xl bg-white p-6 md:w-1/3">
					{/* Buy Car Card */}
					<div className="block">
						<div>
							<div className="mb-2 flex items-center justify-between">
								<h3 className="text-2xl font-semibold text-gray-900">
									Buy Car
								</h3>
							</div>
							<p className="mb-4 text-gray-500">
								Buy your car from DoMakina and explore a wide
								selection of new and used vehicles. Post your
								preferred choice, and we will help you find the
								best deals without the hassle.
							</p>
						</div>
					</div>

					{/* Sell Car Card */}
					<div className="block">
						<div className="border-t pt-6">
							<div className="mb-2 flex items-center justify-between">
								<h3 className="text-2xl font-semibold text-gray-900">
									Sell Car
								</h3>
								<Link
									to="/sign-up"
									className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-500"
								>
									Register Now
								</Link>
							</div>
							<p className="mb-4 text-gray-500">
								Sell your car on DoMakina and reach a wide
								audience of buyers. Post your listing easily,
								and let us help you get the best price without
								the hassle.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
