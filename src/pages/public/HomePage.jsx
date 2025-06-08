import { MainLayout } from "../../components/layouts";
import {
	FeatureSection,
	Hero,
	CarGrid,
	Services,
} from "../../components/pages/Home";
const HomePage = () => {
	return (
		<MainLayout
			mainOptions={{
				paddingVertical: false,
			}}
		>
			<div className="flex flex-grow flex-col items-center justify-center">
				<Hero />
				<Services />
				<FeatureSection />
				<CarGrid />
			</div>
		</MainLayout>
	);
};

export default HomePage;
