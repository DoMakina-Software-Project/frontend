import React from "react";
import { AuthProvider } from "./context/AuthContext";
import RouterManagement from "./router/RouterManagement";
import { Toaster } from "react-hot-toast";

const App = () => {
	return (
		<React.Fragment>
			<AuthProvider>
				<RouterManagement />
			</AuthProvider>
			<Toaster toastOptions={{ duration: 3000 }} />
		</React.Fragment>
	);
};

export default App;
