import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	size = "medium",
	className = "",
}) => {
	useEffect(() => {
		const handleEscape = (e) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const sizeClasses = {
		small: "max-w-md",
		medium: "max-w-lg",
		large: "max-w-4xl",
		full: "max-w-full mx-4",
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
				onClick={onClose}
			/>

			{/* Modal Content */}
			<div
				className={`relative z-10 w-full ${sizeClasses[size]} transform rounded-lg bg-white shadow-xl transition-all ${className}`}
			>
				{/* Header */}
				{title && (
					<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
						<h3 className="text-lg font-semibold text-gray-900">
							{title}
						</h3>
						<button
							onClick={onClose}
							className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
						>
							<FaTimes size={20} />
						</button>
					</div>
				)}

				{/* Body */}
				<div className="px-6 py-4">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
