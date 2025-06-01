import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks";

const AuthRoutes = () => {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <Outlet />;
	}

	if (
		currentUser?.status === "INACTIVE" ||
		(currentUser?.roles?.includes("SELLER") && !currentUser?.sellerProfile)
	) {
		return <Navigate to="/onboarding" />;
	}

	return <Navigate to="/select-role" />;
};

export default AuthRoutes;
