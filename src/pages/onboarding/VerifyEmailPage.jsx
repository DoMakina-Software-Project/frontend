import { MainLayout } from "../../components/layouts";
import { useApi, useAuth } from "../../hooks";
import { generateEmailVerificationToken } from "../../api/auth";
import { MdOutlineMailOutline } from "react-icons/md";
import { Button } from "../../components/ui";

const VerifyEmailPage = () => {
	const { logout } = useAuth();

	const { handleApiCall, loading } = useApi(generateEmailVerificationToken, {
		disableSuccessToast: false,
	});

	return (
		<MainLayout>
			<div className="flex h-full w-full flex-1 items-center justify-center py-20">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm">
					<div className="flex w-full max-w-[300px] flex-col items-center justify-center space-y-10">
						<div className="flex flex-col items-center justify-center space-y-1">
							<MdOutlineMailOutline color="#4476fb" size={46} />
							<h1 className="text-theme-strong-text text-center text-[26px]">
								Verify your email
							</h1>
							<p className="text-center text-[13px] text-theme-light-gray">
								We have sent a verification link to your email
								address. Did not receive the email? Try another
								email{" "}
								<button
									onClick={logout}
									className="text-theme-red font-medium text-theme-blue"
								>
									logout.
								</button>
							</p>
						</div>

						<Button
							type="button"
							onClick={handleApiCall}
							className="whitespace-nowrap"
							extendClassName
							loading={loading}
						>
							Resend Verification
						</Button>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default VerifyEmailPage;
