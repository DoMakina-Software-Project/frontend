import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks";

const OnboardingRoutes = () => {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (currentUser?.status === "INACTIVE") {
		return <Outlet />;
	}

	if (currentUser?.roles?.includes("user")) {
		return <Navigate to="/dashboard" />;
	}

	if (
		currentUser?.roles?.includes("admin") ||
		currentUser?.roles?.includes("superadmin")
	) {
		return <Navigate to="/admin" />;
	}
};

export default OnboardingRoutes;
