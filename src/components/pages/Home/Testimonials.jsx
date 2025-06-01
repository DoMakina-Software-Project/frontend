import clientImage from "../../../assets/images/Client.jpg";

export default function TestimonialSection() {
	const testimonial = {
		id: 1,
		name: "Elliot Harper",
		image: clientImage,
		quote: "It's fantastic to buy a car without dealing with authorities or paperwork yourself. DoMakina handles it all and delivers the car straight to your doorstep. Amazing!",
		rating: 5,
	};

	return (
		<div className="mt-20 w-full bg-white px-4 py-16 lg:px-14">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<div className="mb-12">
					<h2 className="mb-4 text-4xl font-bold text-theme-blue">
						Client DoMakina Stories
					</h2>
					<p className="max-w-2xl text-gray-500">
						When you reach your goals, our whole community
						celebrates with you. That is over 180 thousand members
						sharing.
					</p>
				</div>

				{/* Testimonial Card */}
				<div className="grid items-center gap-8 lg:grid-cols-2">
					{/* Image */}
					<img
						className="rounded-lg border-2 border-gray-300"
						src={testimonial.image}
						alt={testimonial.name}
					/>

					{/* Content */}
					<div className="flex flex-col space-y-6">
						<p className="text-2xl leading-relaxed text-gray-800">
							{testimonial.quote}
						</p>
						<div className="flex w-full flex-col gap-6">
							{/* Rating */}
							<div className="flex flex-col gap-1">
								<div className="flex gap-1">
									{[...Array(testimonial.rating)].map(
										(_, i) => (
											<svg
												key={i}
												className="h-6 w-6 text-yellow-400"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
										),
									)}
								</div>

								<p className="text-xl font-semibold">
									{testimonial.name}
								</p>
							</div>
							<div className="flex items-center gap-4">
								<span className="text-2xl font-bold">
									180k+{" "}
								</span>
								<span className="text-gray-500">
									DoMakina Users
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
