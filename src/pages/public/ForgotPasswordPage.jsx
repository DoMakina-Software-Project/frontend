import { MainLayout } from "../../components/layouts";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "../../components/ui";

const initialState = {
	email: {
		value: "",
		error: "",
	},
};

const ForgotPasswordPage = () => {
	const [formState, setFormState] = useState(initialState);

	const resetForm = () => {
		setFormState(initialState);
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		console.log(formState);
		resetForm();
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
							<p className="text-theme-light-gray text-center text-[13px]">
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
								// loading={loading}
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
