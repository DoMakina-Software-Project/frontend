import { MainLayout } from "../../components/layouts";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../hooks";
import { resetPassword } from "../../api/auth";
import { Button, Input } from "../../components/ui";

const INITIAL_STATE = {
	password: {
		value: "",
		error: "",
	},
	confirmPassword: {
		value: "",
		error: "",
	},
};

const ResetPasswordPage = () => {
	const { token } = useParams();

	const [formState, setFormState] = useState(INITIAL_STATE);

	const { handleApiCall, loading } = useApi(resetPassword, {
		onValidationError: (error) => {
			setFormState((prev) => {
				const newState = { ...prev };
				error.forEach((err) => {
					newState[err.path].error = err.msg;
				});

				return newState;
			});
		},
		disableSuccessToast: false,
	});

	const resetForm = () => {
		setFormState(INITIAL_STATE);
	};

	const clearErrors = () => {
		setFormState((prev) => {
			const newState = { ...prev };
			Object.keys(newState).forEach((key) => {
				newState[key].error = "";
			});

			return newState;
		});
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		if (loading) return;
		clearErrors();

		const { password, confirmPassword } = formState;

		const data = await handleApiCall({
			password: password.value,
			confirmPassword: confirmPassword.value,
			token,
		});

		if (data) resetForm();
	};

	return (
		<MainLayout>
			<div className="flex h-full w-full flex-1 items-center justify-center py-20">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm">
					<form
						onSubmit={submitHandler}
						className="flex w-full max-w-[300px] flex-col items-center justify-center space-y-10"
					>
						<h1 className="text-theme-strong-text text-[26px]">
							Create New Password
						</h1>
						<div className="flex w-full flex-col space-y-1.5">
							<Input
								type="password"
								name="password"
								placeholder="New Password"
								formState={formState}
								setFormState={setFormState}
								required
								passwordIcon
							/>
							<Input
								type="password"
								placeholder="Confirm Password"
								name="confirmPassword"
								formState={formState}
								setFormState={setFormState}
								required
								passwordIcon
							/>
						</div>
						<Button
							type="submit"
							className="whitespace-nowrap"
							extendClassName
							loading={loading}
						>
							Reset Password
						</Button>
					</form>
				</div>
			</div>
		</MainLayout>
	);
};

export default ResetPasswordPage;
