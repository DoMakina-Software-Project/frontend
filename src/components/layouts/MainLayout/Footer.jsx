export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="flex w-full flex-col gap-12 bg-[#0B0F12] py-8 text-white">
			<div className="flex w-full flex-row flex-wrap items-center justify-center px-6 py-12 lg:px-20">
				<div className="flex w-full max-w-7xl flex-row flex-wrap items-start justify-between gap-16 lg:gap-24">
					<div className="flex flex-row flex-wrap gap-16 lg:gap-24">
						{/* Logo and Showroom Section */}
						<div className="flex flex-col">
							<h3 className="mb-4 font-medium text-gray-400">
								SHOWROOM
							</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										Rent car
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										New cars for sale
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										User cars for sale
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										Sell your car
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										Login as a Dealer
									</a>
								</li>
							</ul>
						</div>

						{/* About Section */}
						<div className="flex flex-col">
							<h3 className="mb-4 font-medium text-gray-400">
								ABOUT US
							</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										About Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										How it works
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										Testimony
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										Career
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										DoMakina Academy
									</a>
								</li>
							</ul>
						</div>

						{/* Help Center Section */}
						<div className="flex flex-col">
							<h3 className="mb-4 font-medium text-gray-400">
								HELP CENTER
							</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										FAQ
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										Contact Us
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										Office Location
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										Privacy & Policy
									</a>
								</li>
								<li>
									<a
										href="#"
										className="hover:text-theme-blue"
									>
										Term & Conditions
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="flex max-w-sm flex-col">
						<h3 className="mb-4 font-medium text-gray-400">
							SUBSCRIBE TO OUR NEWSLETTER
						</h3>
						<p className="mb-4 text-sm">
							Get the latest discounts, promotions & exclusive
							benefits sent straight to your email.
						</p>
						<div className="flex gap-2">
							<input
								type="email"
								placeholder="Type your email"
								className="flex-1 rounded-lg bg-white px-4 py-2 text-black"
							/>
							<button className="rounded-lg bg-theme-blue px-6 py-2 transition-colors hover:bg-blue-600">
								Send
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Copyright */}
			<div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
				©{currentYear} All rights reserved by DoMakina
			</div>
		</footer>
	);
}
