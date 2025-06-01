import { SellerOnboardingPage, VerifyEmailPage } from ".";
import { SelectRolePage } from "../private";
import { useAuth } from "../../hooks";
import { Navigate } from "react-router-dom";
const OnboardingPage = () => {
	const { currentUser, selectedRole } = useAuth();

	if (!currentUser) {
		return <Navigate to="/login" />;
	}

	if (currentUser?.status === "INACTIVE") {
		return <VerifyEmailPage />;
	}

	if (!selectedRole) {
		return <SelectRolePage />;
	}

	if (currentUser?.roles?.includes("SELLER") && selectedRole === "SELLER") {
		return <SellerOnboardingPage />;
	}

	return <SelectRolePage />;
};

export default OnboardingPage;
