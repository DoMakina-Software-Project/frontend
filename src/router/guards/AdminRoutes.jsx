import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";

const AdminRoutes = () => {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (!currentUser?.status === "ACTIVE") {
		return <Navigate to="/onboarding" />;
	}

	if (
		currentUser?.roles?.includes("admin") ||
		currentUser?.roles?.includes("superadmin")
	) {
		return <Outlet />;
	}

	if (currentUser?.roles?.includes("user")) {
		return <Navigate to="/dashboard" />;
	}
};

export default AdminRoutes;
