import { createContext, useState } from "react";
import { ConfirmationDialog } from "../components/ui";

const ConfirmationContext = createContext();

export const ConfirmationProvider = ({ children }) => {
	const [confirmationState, setConfirmationState] = useState({
		isOpen: false,
		title: "",
		message: "",
		onConfirm: null,
		onCancel: null,
		confirmText: "Confirm",
		cancelText: "Cancel",
	});

	const showConfirmation = ({
		title,
		message,
		onConfirm,
		onCancel,
		confirmText = "Confirm",
		cancelText = "Cancel",
	}) => {
		setConfirmationState({
			isOpen: true,
			title,
			message,
			confirmText,
			cancelText,
			onConfirm: () => {
				onConfirm?.();
				setConfirmationState((prev) => ({ ...prev, isOpen: false }));
			},
			onCancel: () => {
				onCancel?.();
				setConfirmationState((prev) => ({ ...prev, isOpen: false }));
			},
		});
	};

	const hideConfirmation = () => {
		setConfirmationState((prev) => ({ ...prev, isOpen: false }));
	};

	return (
		<ConfirmationContext.Provider
			value={{ showConfirmation, hideConfirmation, confirmationState }}
		>
			<ConfirmationDialog />
			{children}
		</ConfirmationContext.Provider>
	);
};

export default ConfirmationContext;
