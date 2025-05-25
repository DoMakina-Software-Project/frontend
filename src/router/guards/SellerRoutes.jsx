import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";

const SellerRoutes = () => {
	const { currentUser, selectedRole } = useAuth();

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (!currentUser?.roles?.includes("SELLER") || selectedRole !== "SELLER") {
		return <Navigate to="/select-role" />;
	}

	if (currentUser?.status === "INACTIVE" || !currentUser?.sellerProfile) {
		return <Navigate to="/onboarding" />;
	}

	return <Outlet />;
};

export default SellerRoutes;
