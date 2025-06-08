import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { ConfirmationProvider } from "./context/ConfirmationContext";
import RouterManagement from "./router/RouterManagement";
import { Toaster } from "react-hot-toast";

const App = () => {
	return (
		<React.Fragment>
			<ConfirmationProvider>
				<AuthProvider>
					<RouterManagement />
				</AuthProvider>
				<Toaster toastOptions={{ duration: 3000 }} />
			</ConfirmationProvider>
		</React.Fragment>
	);
};

export default App;
