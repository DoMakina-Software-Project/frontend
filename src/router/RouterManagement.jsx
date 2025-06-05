import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
	AuthRoutes,
	OnboardingRoutes,
	ClientRoutes,
	SellerRoutes,
	StaffRoutes,
	SuperAdminRoutes,
} from "./guards";
import {
	Error404Page,
	HomePage,
	LoginPage,
	SignUpPage,
	ForgotPasswordPage,
	ResetPasswordPage,
	VerifyEmailTokenPage,
	SearchPage,
	CarPage,
	WishlistPage,
	TermsAndConditions,
} from "../pages/public";
import {
	DashboardPage,
	SellCarPage,
	PromotionPage,
	RentalAvailabilityPage,
} from "../pages/private/seller";
import {
	StaffDashboardPage,
	StaffBrandsPage,
	StaffEditBrandPage,
	StaffCreateBrandPage,
} from "../pages/private/staff";
import { OnboardingPage } from "../pages/onboarding";
import { SelectRolePage } from "../pages/private";
import {
	CreateStaffPage,
	StaffPage,
	EditStaffPage,
} from "../pages/private/admin";

const RouterManagement = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* Add the public routes */}
				<Route path="/" element={<HomePage />} />
				<Route path="/search" element={<SearchPage />} />
				<Route path="/car/:id" element={<CarPage />} />
				<Route path="/wishlist" element={<WishlistPage />} />
				<Route
					path="/terms-and-conditions"
					element={<TermsAndConditions />}
				/>
				<Route
					path="/reset-password/:token"
					element={<ResetPasswordPage />}
				/>
				<Route
					path="/verify-email/:token"
					element={<VerifyEmailTokenPage />}
				/>

				{/* Add the auth routes */}
				<Route path="/" element={<AuthRoutes />}>
					<Route path="login" element={<LoginPage />} />
					<Route path="sign-up" element={<SignUpPage />} />
					<Route
						path="forgot-password"
						element={<ForgotPasswordPage />}
					/>
				</Route>

				<Route path="select-role" element={<SelectRolePage />} />

				{/* Add the onboarding routes */}
				<Route path="/onboarding" element={<OnboardingRoutes />}>
					<Route index element={<OnboardingPage />} />
				</Route>

				<Route path="/client" element={<ClientRoutes />}></Route>

				{/* Add the private routes */}
				<Route path="/seller" element={<SellerRoutes />}>
					<Route index element={<DashboardPage />} />
					<Route path="list-car" element={<SellCarPage />} />
					<Route path="promotion/:id" element={<PromotionPage />} />
					<Route
						path="rental-availability/:carId?"
						element={<RentalAvailabilityPage />}
					/>
				</Route>

				{/* Add the staff routes */}
				<Route path="/staff" element={<StaffRoutes />}>
					<Route index element={<StaffDashboardPage />} />
					<Route path="brands" element={<StaffBrandsPage />} />
					<Route
						path="brands/create"
						element={<StaffCreateBrandPage />}
					/>
					<Route
						path="brands/edit/:id"
						element={<StaffEditBrandPage />}
					/>
				</Route>

				{/* Add the super admin routes */}
				<Route path="/admin" element={<SuperAdminRoutes />}>
					<Route index element={<StaffDashboardPage />} />
					<Route path="staff">
						<Route index element={<StaffPage />} />
						<Route path="create" element={<CreateStaffPage />} />
						<Route path="edit/:id" element={<EditStaffPage />} />
					</Route>
				</Route>

				{/* Add the 404 page */}
				<Route path="*" element={<Error404Page />} />
			</Routes>
		</BrowserRouter>
	);
};

export default RouterManagement;
