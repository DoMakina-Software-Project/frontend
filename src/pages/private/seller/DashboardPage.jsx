import { MainLayout } from "../../../components/layouts";
import { GridDashboardCar } from "../../../components/pages/Dashboard";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { useAuth } from "../../../hooks";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	return (
		<MainLayout mainOptions={{ paddingVertical: false }}>
			<div className="lg:px14 flex w-full flex-col items-center justify-start gap-8 px-6 py-8">
				<div className="flex w-full max-w-7xl flex-col items-start justify-start gap-6">
					<div className="flex flex-row items-center justify-center gap-4">
						<FaCircleUser />
						<h2>{currentUser.email}</h2>
					</div>

					{/* Quick Actions */}
					<div className="flex flex-wrap gap-4">
						<button
							onClick={() => navigate("list-car")}
							className="flex items-center gap-2 rounded-lg bg-theme-blue px-4 py-2 text-white transition-colors hover:bg-blue-600"
						>
							<FaPlus size={16} />
							List a Car
						</button>
						<button
							onClick={() => navigate("rental-availability")}
							className="flex items-center gap-2 rounded-lg border border-theme-blue px-4 py-2 text-theme-blue transition-colors hover:bg-blue-50"
						>
							<FaCalendarAlt size={16} />
							Manage Rental Availability
						</button>
					</div>
				</div>

				<GridDashboardCar />
			</div>
		</MainLayout>
	);
};

export default DashboardPage;
