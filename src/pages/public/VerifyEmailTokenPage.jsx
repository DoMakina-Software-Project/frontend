import { MainLayout } from "../../components/layouts";
import { useParams, useNavigate } from "react-router-dom";
import { useApi, useAuth } from "../../hooks";
import { verifyEmail } from "../../api/auth";
import { useState, useEffect } from "react";
import { LoadingIndicator } from "../../components/common";
import { MdOutlineMailOutline } from "react-icons/md";

const VerifyEmailTokenPage = () => {
	const { token } = useParams();

	const navigate = useNavigate();
	const { currentUser, fetchUser } = useAuth();

	const [error, setError] = useState(null);

	const { handleApiCall, loading } = useApi(verifyEmail, {
		onError: (error) => {
			setError(error);
		},
	});

	useEffect(() => {
		const verifyAndFetchUser = async () => {
			const data = await handleApiCall({ token });
			if (data && currentUser?.status === "INACTIVE") {
				await fetchUser();
			}
		};

		if (token) verifyAndFetchUser();
	}, [token]);

	return (
		<MainLayout>
			<div className="flex h-full w-full flex-1 items-center justify-center py-20">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm">
					<div className="flex w-full max-w-[300px] flex-col items-center justify-center space-y-10">
						{loading ? (
							<LoadingIndicator />
						) : (
							<div className="flex flex-col items-center justify-center space-y-6">
								<div className="flex flex-col items-center justify-center space-y-1">
									<MdOutlineMailOutline
										color="#4476fb"
										size={46}
									/>
									<h1 className="text-theme-strong-text text-center text-[26px]">
										{error
											? "Could not verify email"
											: "Email Verified"}
									</h1>
									<p className="text-[13px] text-theme-light-gray">
										{error
											? error.message
											: "Your email has been verified successfully."}
									</p>
								</div>
								<button
									onClick={() =>
										error
											? navigate("/")
											: navigate("/dashboard")
									}
									className="text-theme-red hover:underline"
								>
									{error ? "Go to Home" : "Go to Dashboard"}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default VerifyEmailTokenPage;
