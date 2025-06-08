import { useConfirmation } from "../../hooks";
import { Button } from ".";

const ConfirmationDialog = () => {
	const { confirmationState, hideConfirmation } = useConfirmation();
	const {
		isOpen,
		title,
		message,
		onConfirm,
		onCancel,
		confirmText,
		cancelText,
	} = confirmationState;

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
				<h3 className="mb-4 text-lg font-semibold text-gray-900">
					{title}
				</h3>
				<p className="mb-6 text-gray-600">{message}</p>
				<div className="flex justify-end gap-3">
					<Button
						onClick={() => {
							onCancel?.();
							hideConfirmation();
						}}
						className="bg-gray-100 text-gray-700 hover:bg-gray-200"
					>
						{cancelText}
					</Button>
					<Button
						onClick={() => {
							onConfirm?.();
							hideConfirmation();
						}}
						className="bg-red-600 text-white hover:bg-red-700"
					>
						{confirmText}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationDialog;
