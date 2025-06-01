import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";

const SuperAdminRoutes = () => {
	const { currentUser, selectedRole } = useAuth();

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (currentUser?.status === "INACTIVE") {
		return <Navigate to="/onboarding" />;
	}

	if (
		currentUser?.roles?.includes("SUPERADMIN") &&
		selectedRole === "SUPERADMIN"
	) {
		return <Outlet />;
	}

	return <Navigate to="/select-role" />;
};

export default SuperAdminRoutes;
