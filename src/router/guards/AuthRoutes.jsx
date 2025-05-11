import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks";

const AuthRoutes = () => {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <Outlet />;
	}

	if (currentUser?.status === "INACTIVE") {
		return <Navigate to="/onboarding" />;
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

export default AuthRoutes;
