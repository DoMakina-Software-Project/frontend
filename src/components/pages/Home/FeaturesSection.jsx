import { FiUser } from "react-icons/fi";
import { MdStarBorder } from "react-icons/md";
import { GoZap } from "react-icons/go";

export default function FeaturesSection() {
	const features = [
		{
			icon: FiUser,
			title: "Verified Listings",
			description:
				"Every car listing is verified to ensure accurate information and genuine sellers, providing you with a trustworthy car buying experience in Albania.",
		},
		{
			icon: MdStarBorder,
			title: "Nationwide Coverage",
			description:
				"Access car listings from all major cities in Albania, including Tirana, Durrës, Vlorë, and more. Find the perfect car near you.",
		},
		{
			icon: GoZap,
			title: "Flexible Options",
			description:
				"Choose between buying and renting vehicles. Whether you need a car for a day or want to make a purchase, we've got you covered.",
		},
	];

	return (
		<div className="flex items-center justify-center px-6 py-12 lg:px-14">
			<div className="grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
				{features.map((feature, index) => {
					const Icon = feature.icon;
					return (
						<div
							key={index}
							className="flex flex-col items-start gap-4"
						>
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
								<Icon className="h-6 w-6 text-blue-600" />
							</div>
							<h3 className="text-xl font-semibold text-gray-900">
								{feature.title}
							</h3>
							<p className="leading-relaxed text-gray-500">
								{feature.description}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
}
