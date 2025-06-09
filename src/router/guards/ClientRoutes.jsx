import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks";

const ClientRoutes = () => {
	const { currentUser, selectedRole, statusCheckError } = useAuth();

	// If there's a status check error, redirect to login
	if (statusCheckError) {
		return <Navigate to="/login" />;
	}

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (currentUser.status !== "ACTIVE") {
		return <Navigate to="/onboarding" />;
	}

	if (currentUser?.roles?.includes("CLIENT") && selectedRole === "CLIENT") {
		return <Outlet />;
	}

	return <Navigate to="/select-role" />;
};

export default ClientRoutes;
