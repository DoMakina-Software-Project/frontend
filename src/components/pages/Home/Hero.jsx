import CarDetailsCard from "./CarCardDetail";
import { FaStar } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import Benz from "../../../assets/images/Benz.jpeg";

export default function HeroSection() {
	return (
		<div className="flex w-full items-center justify-center bg-theme-text px-6 py-11 lg:px-14 lg:pb-24">
			<div className="flex w-full max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
				{/* Left Content */}
				<div className="flex-1">
					<h1 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-5xl">
						Find & sell your best car easily
					</h1>
					<p className="mb-8 text-gray-400">
						We will help you sell or buy & rent your dream car here
						easily and quickly that is reliable.
					</p>
					<div>
						<div className="mb-2 flex gap-1">
							{[...Array(5)].map((_, i) => (
								<FaStar
									key={i}
									className="h-6 w-6 fill-yellow-400 text-yellow-400"
								/>
							))}
						</div>
						<div className="flex items-center gap-2">
							<span className="text-2xl font-bold text-white">
								12k+
							</span>
							<span className="text-gray-400">Good Reviews</span>
						</div>
					</div>
				</div>

				{/* Center Image */}
				<div className="relative max-w-md flex-1 transition-all duration-150 hover:scale-[1.01] lg:max-w-lg">
					<img
						src={Benz}
						className="h-[600px] w-full rounded-lg object-cover"
					/>
					<button className="absolute bottom-0 left-0 w-full rounded-bl-lg bg-black/50 px-6 py-3 text-white backdrop-blur-sm hover:bg-theme-blue">
						VIEW CATALOG
					</button>
				</div>

				{/* Right Content */}
				<div className="max-w-sm">
					<CarDetailsCard />
					<div className="mt-6 flex items-center justify-between">
						<span className="text-xl text-white">
							<span className="text-2xl font-bold">01</span>/5
						</span>
						<div className="flex gap-2">
							<button className="rounded-lg bg-gray-800 p-2 transition-all duration-150 hover:scale-110">
								<FaChevronLeft className="h-6 w-6 text-white" />
							</button>
							<button className="rounded-lg bg-gray-800 p-2 transition-all duration-150 hover:scale-110">
								<FaChevronRight className="h-6 w-6 text-white" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
