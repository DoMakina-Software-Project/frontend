import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";

const UserRoutes = () => {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (currentUser?.status === "INACTIVE") {
		return <Navigate to="/onboarding" />;
	}

	if (currentUser?.roles?.includes("user")) {
		return <Outlet />;
	}

	if (
		currentUser?.roles?.includes("admin") ||
		currentUser?.roles?.includes("superadmin")
	) {
		return <Navigate to="/admin" />;
	}
};

export default UserRoutes;
