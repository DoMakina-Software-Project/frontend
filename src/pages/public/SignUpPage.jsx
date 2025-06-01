import { MainLayout } from "../../components/layouts";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input, Button } from "../../components/ui";
import { useApi, useAuth } from "../../hooks";
import { register } from "../../api/auth";

const initialState = {
	name: {
		value: "",
		error: "",
	},
	surname: {
		value: "",
		error: "",
	},
	email: {
		value: "",
		error: "",
	},
	password: {
		value: "",
		error: "",
	},
	confirmPassword: {
		value: "",
		error: "",
	},
	acceptTerms: {
		value: false,
		error: "",
	},
};

const SignUpPage = () => {
	const [formState, setFormState] = useState(initialState);
	const { fetchUser } = useAuth();
	const { handleApiCall: registerApiCall, loading } = useApi(register, {
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

	const clearErrors = () => {
		setFormState((prev) => {
			const newState = { ...prev };
			Object.keys(newState).forEach((key) => {
				newState[key].error = "";
			});

			return newState;
		});
	};

	const handleSignUp = async (e) => {
		e.preventDefault();
		if (loading) return;
		clearErrors();

		const { name, surname, email, password, confirmPassword, acceptTerms } =
			formState;

		const data = await registerApiCall({
			name: name.value,
			surname: surname.value,
			email: email.value,
			password: password.value,
			confirmPassword: confirmPassword.value,
			acceptTerms: acceptTerms.value,
		});

		if (data) await fetchUser();
	};

	return (
		<MainLayout>
			<div className="flex flex-grow items-center justify-center">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm">
					<form
						onSubmit={handleSignUp}
						className="flex w-full max-w-[300px] flex-col items-center justify-center space-y-10"
					>
						<h1 className="text-[26px]">Create your Account</h1>

						<div className="flex w-full flex-col space-y-1.5">
							<div className="flex flex-row space-x-1.5">
								<Input
									type="text"
									placeholder="Name"
									name="name"
									formState={formState}
									setFormState={setFormState}
									required
								/>
								<Input
									type="text"
									placeholder="Surname"
									name="surname"
									formState={formState}
									setFormState={setFormState}
									required
								/>
							</div>

							<Input
								type="email"
								placeholder="Email"
								name="email"
								formState={formState}
								setFormState={setFormState}
								required
							/>
							<Input
								type="password"
								placeholder="Password"
								name="password"
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

							<div className="flex w-full flex-row items-center justify-start space-x-1.5">
								<Input
									id="checkbox"
									type="checkbox"
									name="acceptTerms"
									wrapperClassName="w-auto"
									formState={formState}
									setFormState={setFormState}
									required
								/>
								<label htmlFor="checkbox">
									<span className="text-[13px] text-theme-light-gray">
										I accept the
									</span>{" "}
									<Link
										to="/terms-and-conditions"
										className="text-[13px] font-semibold text-theme-blue"
									>
										Terms and Conditions
									</Link>
								</label>
							</div>
						</div>
						<div className="flex flex-col items-center justify-center space-y-3">
							<Button
								type="submit"
								className="whitespace-nowrap"
								extendClassName
								loading={loading}
							>
								Sign Up
							</Button>
							<div className="flex flex-row space-x-2">
								<span className="text-[14px] text-theme-light-gray">
									Already have an account?
								</span>
								<Link
									to="/login"
									className="text-[14px] font-semibold text-theme-blue"
								>
									Log In
								</Link>
							</div>
						</div>
					</form>
				</div>
			</div>
		</MainLayout>
	);
};

export default SignUpPage;
