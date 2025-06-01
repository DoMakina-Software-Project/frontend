import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";

// Improved check for empty object
const isObjectEmpty = (obj) => !obj || Object.keys(obj).length === 0;

const useApi = (
	serviceFunction,
	{
		ignoreErrors = false,
		errorMapping = {},
		onError = () => {},
		throwError = false,
		onValidationError = () => {},
		disableErrorToast = false,
		disableSuccessToast = true,
		errorToastValidationErrors = false,
		successMessage = "",
	} = {},
) => {
	const [loading, setLoading] = useState(false);

	const handleApiCall = useCallback(
		async (args) => {
			console.log("API CALL", serviceFunction.name);
			setLoading(true);
			try {
				const response = await serviceFunction(args);
				if (!disableSuccessToast) {
					console.log("SUCCESS", response?.data?.message);
					toast.success(
						successMessage || response?.data?.message || "Success",
					);
				}
				return response?.data;
			} catch (error) {
				console.error("API ERROR", error); // Better logging for debugging
				let errorMessage = null;

				if (!ignoreErrors) {
					const errorKey =
						error.response?.data?.message || error.message;
					const status = error?.response?.status || error?.status;

					errorMessage = isObjectEmpty(errorMapping)
						? {
								title: "Oops!",
								message: errorKey,
								status,
							}
						: errorMapping[errorKey] || {
								title: "Oops!",
								message: "An error occurred. Please try again.",
								status,
							};

					if (!("title" in errorMessage)) {
						errorMessage = {
							title: "Error",
							message: errorKey,
							status,
						};
					}

					if (status === 422) {
						errorMessage = {
							title: "Validation Error",
							message: errorKey,
							status,
							errors: error.response?.data?.errors || [],
						};

						onValidationError(error.response?.data?.errors);
					}

					if (!disableErrorToast) {
						toast.error(
							(errorToastValidationErrors
								? errorMessage?.errors?.[0]?.msg ||
									errorMessage?.message
								: errorMessage?.message) || "An error occurred",
						);
					}
				}

				if (throwError) {
					throw error; // re-throw if needed
				}

				onError(error);
			} finally {
				setLoading(false);
			}
		},
		[
			serviceFunction,
			ignoreErrors,
			errorMapping,
			onError,
			throwError,
			onValidationError,
			disableErrorToast,
			successMessage,
			disableSuccessToast,
			errorToastValidationErrors,
		],
	);

	return { loading, handleApiCall };
};

export default useApi;
