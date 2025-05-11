import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";

const SuperAdminRoutes = () => {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (currentUser?.status === "INACTIVE") {
		return <Navigate to="/onboarding" />;
	}

	if (currentUser?.roles?.includes("superadmin")) {
		return <Outlet />;
	}

	if (currentUser?.roles?.includes("admin")) {
		return <Navigate to="/admin" />;
	}

	if (currentUser?.roles?.includes("user")) {
		return <Navigate to="/dashboard" />;
	}
};

export default SuperAdminRoutes;
