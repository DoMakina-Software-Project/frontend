import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";

const ClientRoutes = () => {
	const { currentUser, selectedRole } = useAuth();

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (!currentUser?.roles?.includes("CLIENT") || selectedRole !== "CLIENT") {
		return <Navigate to="/select-role" />;
	}

	if (currentUser?.status === "INACTIVE") {
		return <Navigate to="/onboarding" />;
	}

	return <Outlet />;
};

export default ClientRoutes;
