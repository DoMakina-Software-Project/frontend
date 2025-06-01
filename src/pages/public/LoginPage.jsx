import { Input, Button } from "../../components/ui";
import { MainLayout } from "../../components/layouts";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApi, useAuth } from "../../hooks";
import { login } from "../../api/auth";

const initialState = {
	email: {
		value: "",
		error: "",
	},
	password: {
		value: "",
		error: "",
	},
};

const LoginPage = () => {
	const { fetchUser } = useAuth();
	const [formState, setFormState] = useState(initialState);
	const { handleApiCall: loginApiCall, loading } = useApi(login, {
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

	const handleLogin = async (e) => {
		e.preventDefault();
		if (loading) return;

		clearErrors();

		const { email, password } = formState;

		const data = await loginApiCall({
			email: email.value,
			password: password.value,
		});

		if (data) await fetchUser();
	};

	return (
		<MainLayout>
			<div className="flex flex-grow items-center justify-center">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm">
					<form
						onSubmit={handleLogin}
						className="flex w-full max-w-[300px] flex-col items-center justify-center space-y-10"
					>
						<div className="flex flex-col items-center justify-center space-y-1">
							<h1 className="text-[26px]">Welcome back!</h1>
							<p className="text-[13px] text-theme-light-gray">
								Please log in with your details.
							</p>
						</div>
						<div className="flex w-full flex-col space-y-1.5">
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
							<Link
								to="/forgot-password"
								className="self-end text-[13px] font-semibold"
							>
								Forgot Password?
							</Link>
						</div>
						<div className="flex flex-col items-center justify-center space-y-3">
							<Button
								type="submit"
								className="whitespace-nowrap"
								extendClassName
								loading={loading}
							>
								Log In
							</Button>
							<div className="flex flex-row space-x-2">
								<span className="text-[14px] text-theme-light-gray">
									Don&apos;t have an account?
								</span>
								<Link
									to="/sign-up"
									className="text-[14px] font-semibold text-theme-blue"
								>
									Sign Up
								</Link>
							</div>
						</div>
					</form>
				</div>
			</div>
		</MainLayout>
	);
};

export default LoginPage;
