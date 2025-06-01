import { useEffect, useState } from "react";
import LeftSideBar from "../../components/pages/CarPage/LeftSideBar";
import MainContent from "../../components/pages/CarPage/MainContent";
import RightPanel from "../../components/pages/CarPage/RightPanel";
import { MainLayout } from "../../components/layouts";
import { useParams, Link } from "react-router-dom";
import { getCar } from "../../api/public";
import { useApi } from "../../hooks";

export default function CarPage() {
	const { handleApiCall: getCarApiCall } = useApi(getCar);
	const [currentSlide, setCurrentSlide] = useState(0);

	const { id } = useParams();
	const [car, setCar] = useState(null);

	useEffect(() => {
		getCarApiCall(id).then((data) => {
			if (data) {
				setCar(data);
			}
		});
	}, [id]);

	return (
		<MainLayout>
			{car ? (
				<div className="mx-auto max-w-7xl bg-white p-4">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-12">
						<LeftSideBar
							thumbnails={car.images}
							currentSlide={currentSlide}
							setCurrentSlide={setCurrentSlide}
						/>
						<MainContent
							name={`${car.brand} ${car.model}`}
							thumbnail={car.images[currentSlide]}
						/>
						<RightPanel carDetails={car} />
					</div>
				</div>
			) : (
				<div className="flex min-h-[35vh] flex-grow flex-col items-center justify-center space-y-1">
					<h1 className="text-2xl">Car Not Found</h1>
					<Link className="text-theme-blue" to="/">
						Go to Home
					</Link>
				</div>
			)}
		</MainLayout>
	);
}
