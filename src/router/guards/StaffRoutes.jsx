import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";

const StaffRoutes = () => {
	const { currentUser, selectedRole } = useAuth();

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (!currentUser?.status === "ACTIVE") {
		return <Navigate to="/onboarding" />;
	}

	if (
		(currentUser?.roles?.includes("STAFF") && selectedRole === "STAFF") ||
		(currentUser?.roles?.includes("SUPERADMIN") &&
			selectedRole === "SUPERADMIN")
	) {
		return <Outlet />;
	}

	return <Navigate to="/select-role" />;
};

export default StaffRoutes;
