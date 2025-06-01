import { MainLayout } from "../../../components/layouts";
import { GridDashboardCar } from "../../../components/pages/Dashboard";
import { FaCircleUser } from "react-icons/fa6";
import { useAuth } from "../../../hooks";

const DashboardPage = () => {
	const { currentUser } = useAuth();

	return (
		<MainLayout mainOptions={{ paddingVertical: false }}>
			<div className="lg:px14 flex w-full flex-col items-center justify-start gap-24 px-6 py-8">
				<div className="flex flex-row items-center justify-center gap-4 self-start">
					<FaCircleUser />
					<h2>{currentUser.email}</h2>
				</div>

				<GridDashboardCar />
			</div>
		</MainLayout>
	);
};

export default DashboardPage;
