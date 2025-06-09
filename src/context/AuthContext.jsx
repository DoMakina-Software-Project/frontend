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
	const [statusCheckError, setStatusCheckError] = useState(null);

	const fetchUser = async () => {
		try {
			const response = await getUser();

			const user = response.data;
			if (user) {
				const roles = user?.roles || [];
				const selectedRole = getSelectedRole(roles);

				setCurrentUser(user);
				setSelectedRole(selectedRole);
				setStatusCheckError(null);
			} else {
				throw new Error("User not found");
			}
		} catch (error) {
			// Check if this is a status-related error
			if (error.response?.data?.shouldLogout) {
				setStatusCheckError(error.response.data.message);
				setCurrentUser(null);
				setSelectedRole(null);
				localStorage.removeItem("selectedRole");
			} else {
				setCurrentUser(null);
				setSelectedRole(null);
			}
		}
	};

	const handleLogout = async () => {
		try {
			await handleLogoutApiCall();
		} catch {
			// Even if logout API fails, clear local state
			console.warn("Logout API failed, but clearing local state");
		} finally {
			setCurrentUser(null);
			setSelectedRole(null);
			setStatusCheckError(null);
			localStorage.removeItem("selectedRole");
		}
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

	const clearStatusError = () => {
		setStatusCheckError(null);
	};

	// Setup axios interceptor to handle status check responses
	useEffect(() => {
		const setupInterceptor = async () => {
			const { default: axios } = await import("../api/axios");

			const interceptor = axios.interceptors.response.use(
				(response) => response,
				(error) => {
					// Handle forced logout scenarios
					if (error.response?.data?.shouldLogout) {
						setStatusCheckError(error.response.data.message);
						setCurrentUser(null);
						setSelectedRole(null);
						localStorage.removeItem("selectedRole");
					}
					return Promise.reject(error);
				},
			);

			// Cleanup function to remove interceptor
			return () => {
				axios.interceptors.response.eject(interceptor);
			};
		};

		setupInterceptor();
	}, []);

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
		statusCheckError,
		clearStatusError,
	};

	return (
		<AuthContext.Provider value={value}>
			{loading ? (
				<div className="flex h-screen w-screen items-center justify-center bg-theme-bg">
					<LoadingIndicator />
				</div>
			) : (
				<>
					{statusCheckError && (
						<div className="fixed left-0 right-0 top-0 z-50 bg-red-500 p-4 text-center text-white">
							<div className="mx-auto flex max-w-4xl items-center justify-between">
								<span>{statusCheckError}</span>
								<button
									onClick={clearStatusError}
									className="ml-4 text-white hover:text-gray-200"
								>
									×
								</button>
							</div>
						</div>
					)}
					{children}
				</>
			)}
		</AuthContext.Provider>
	);
};

export default AuthContext;
