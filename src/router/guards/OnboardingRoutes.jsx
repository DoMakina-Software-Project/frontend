import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks";

const OnboardingRoutes = () => {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (
		currentUser?.status === "INACTIVE" ||
		(currentUser?.roles?.includes("SELLER") && !currentUser?.sellerProfile)
	) {
		return <Outlet />;
	}

	return <Navigate to="/select-role" />;
};

export default OnboardingRoutes;
