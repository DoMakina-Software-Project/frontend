import { createContext, useState, useEffect } from "react";
import { getUser, logout } from "../api/auth";
import { LoadingIndicator } from "../components/common";
import { useApi } from "../hooks";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const { handleApiCall: handleLogoutApiCall } = useApi(logout);

	const [currentUser, setCurrentUser] = useState(null);
	const [selectedRole, setSelectedRole] = useState(null);

	const [loading, setLoading] = useState(true);

	const fetchUser = async () => {
		try {
			const response = await getUser();

			const user = response.data;
			if (user) {
				const roles = user?.roles || [];
				const selectedRole = getSelectedRole(roles);

				setCurrentUser(user);
				setSelectedRole(selectedRole);
			} else {
				throw new Error("User not found");
			}
		} catch {
			setCurrentUser(null);
			setSelectedRole(null);
		}
	};

	const handleLogout = async () => {
		await handleLogoutApiCall();
		setCurrentUser(null);
	};

	const handleSelectRole = (
		role,
		availableRoles = currentUser?.roles || [],
	) => {
		if (availableRoles.includes(role)) {
			setSelectedRole(role);
			localStorage.setItem("selectedRole", role);
		}
	};

	const getSelectedRole = (availableRoles = currentUser?.roles || []) => {
		const selectedRole = localStorage.getItem("selectedRole");
		if (availableRoles.includes(selectedRole)) {
			return selectedRole;
		}
		return null;
	};

	useEffect(() => {
		const initialFetch = async () => {
			await fetchUser();
			setLoading(false);
		};

		initialFetch();
	}, []);

	const value = {
		currentUser,
		fetchUser,
		logout: handleLogout,
		selectedRole,
		handleSelectRole,
	};

	return (
		<AuthContext.Provider value={value}>
			{loading ? (
				<div className="flex h-screen w-screen items-center justify-center bg-theme-bg">
					<LoadingIndicator />
				</div>
			) : (
				children
			)}
		</AuthContext.Provider>
	);
};

export default AuthContext;
