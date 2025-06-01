import { MainLayout } from "../../components/layouts";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "../../components/ui";
import { useApi } from "../../hooks";
import { forgetPassword } from "../../api/auth";

const initialState = {
	email: {
		value: "",
		error: "",
	},
};

const ForgotPasswordPage = () => {
	const [formState, setFormState] = useState(initialState);

	const { handleApiCall, loading } = useApi(forgetPassword, {
		disableSuccessToast: false,
		onValidationError: (error) => {
			setFormState((prev) => {
				const newState = { ...prev };
				error.forEach((err) => {
					newState[err.path].error = err.msg;
				});

				return newState;
			});
		},
	});

	const resetForm = () => {
		setFormState(initialState);
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

		const { email } = formState;

		const data = await handleApiCall({
			email: email.value,
		});

		if (data) resetForm();
	};

	return (
		<MainLayout>
			<div className="flex flex-grow items-center justify-center">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm">
					<form
						onSubmit={submitHandler}
						className="flex w-full max-w-[300px] flex-col items-center justify-center space-y-10"
					>
						<div className="flex flex-col items-center justify-center space-y-1">
							<h1 className="text-[26px]">Reset your password</h1>
							<p className="text-center text-[13px] text-theme-light-gray">
								Enter your email address and we will send you a
								link to reset your password.
							</p>
						</div>
						<Input
							type="email"
							placeholder="Email"
							name="email"
							formState={formState}
							setFormState={setFormState}
							required
						/>

						<div className="flex flex-col items-center justify-center space-y-3">
							<Button
								loading={loading}
								type="submit"
								className="whitespace-nowrap"
								extendClassName
							>
								Send Email
							</Button>

							<Link
								to="/login"
								className="text-[14px] font-semibold"
							>
								Back to Login
							</Link>
						</div>
					</form>
				</div>
			</div>
		</MainLayout>
	);
};

export default ForgotPasswordPage;
