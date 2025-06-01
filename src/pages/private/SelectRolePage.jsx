import { MainLayout } from "../../components/layouts";
import { useAuth } from "../../hooks";
import { useNavigate, Navigate } from "react-router-dom";

const SelectRolePage = () => {
	const { currentUser } = useAuth();
	if (!currentUser) return <Navigate to="/login" />;

	const roles = currentUser?.roles || [];

	return (
		<MainLayout>
			<div className="flex w-full flex-1 items-center justify-center bg-gray-50 py-20">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-3xl bg-white px-8 py-16 shadow-lg">
					<div className="flex w-full max-w-[400px] flex-col items-center justify-center space-y-12">
						<div className="flex flex-col items-center justify-center space-y-3">
							<h1 className="text-theme-strong-text text-center text-3xl font-bold">
								Select your role
							</h1>
							<p className="text-center text-sm text-gray-600">
								Please select the role that best describes you
							</p>
							<div className="mt-8 flex w-full flex-col space-y-4">
								{roles.map((role) => (
									<RoleCard key={role} role={role} />
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default SelectRolePage;

const RoleCard = ({ role }) => {
	const navigate = useNavigate();
	const { handleSelectRole } = useAuth();
	const { label, path } = getLabelAndNavigatePath(role);

	const handleRoleClick = () => {
		handleSelectRole(role);
		navigate(path);
	};

	return (
		<button
			className="hover:border-theme-primary hover:bg-theme-primary/5 group flex w-full transform flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 text-black transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
			onClick={handleRoleClick}
		>
			<div className="flex items-center space-x-3">
				<h2 className="group-hover:text-theme-primary text-xl font-semibold text-gray-800">
					{label}
				</h2>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="group-hover:text-theme-primary h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:translate-x-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</div>
		</button>
	);
};

const getLabelAndNavigatePath = (role) => {
	switch (role) {
		case "SELLER":
			return { label: "Seller", path: "/seller" };
		case "CLIENT":
			return { label: "Buyer", path: "/" };
		case "STAFF":
			return { label: "Staff", path: "/staff" };
		case "SUPERADMIN":
			return { label: "Admin", path: "/admin" };
		default:
			return { label: "Client", path: "/" };
	}
};
