import { MainLayout } from "../../components/layouts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useApi } from "../../hooks";
import { createSellerProfile } from "../../api/seller";
import { Button, Input } from "../../components/ui";

const initialState = {
	isBusiness: {
		value: false,
		error: "",
	},
	businessName: {
		value: "",
		error: "",
	},
	businessAddress: {
		value: "",
		error: "",
	},
	country: {
		value: "",
		error: "",
	},
	city: {
		value: "",
		error: "",
	},
	contactPhone: {
		value: "",
		error: "",
	},
	contactEmail: {
		value: "",
		error: "",
	},
	description: {
		value: "",
		error: "",
	},
};

const SellerOnboardingPage = () => {
	const navigate = useNavigate();
	const [formState, setFormState] = useState(initialState);

	const { handleApiCall: createSellerProfileApiCall, loading } = useApi(
		createSellerProfile,
		{
			onValidationError: (error) => {
				setFormState((prev) => {
					const newState = { ...prev };
					error.forEach((err) => {
						newState[err.path].error = err.msg;
					});

					return newState;
				});
			},
		},
	);

	const clearErrors = () => {
		setFormState((prev) => {
			const newState = { ...prev };
			Object.keys(newState).forEach((key) => {
				newState[key].error = "";
			});
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;
		clearErrors();

		const {
			isBusiness,
			businessName,
			businessAddress,
			country,
			city,
			contactPhone,
			contactEmail,
			description,
		} = formState;

		let payload = {
			isBusiness: isBusiness.value,
			country: country.value,
			city: city.value,
			contactPhone: contactPhone.value,
			contactEmail: contactEmail.value,
		};
		if (isBusiness) {
			payload = {
				...payload,
				businessName: businessName.value,
				businessAddress: businessAddress.value,
				description: description.value,
			};
		}

		const data = await createSellerProfileApiCall(payload);

		if (data) {
			navigate("/");
		}
	};

	return (
		<MainLayout>
			<div className="flex flex-grow items-center justify-center">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm">
					<form
						onSubmit={handleSubmit}
						className="flex w-full max-w-[300px] flex-col items-center justify-center space-y-10"
					>
						<h1 className="text-[26px]">Create a Seller Profile</h1>
						<div className="flex w-full flex-col space-y-1.5">
							<Input
								type="text"
								placeholder="Country"
								name="country"
								formState={formState}
								setFormState={setFormState}
								required
							/>
							<Input
								type="text"
								placeholder="City"
								name="city"
								formState={formState}
								setFormState={setFormState}
								required
							/>
							<Input
								type="text"
								placeholder="Contact Phone"
								name="contactPhone"
								formState={formState}
								setFormState={setFormState}
								required
							/>
							<Input
								type="email"
								placeholder="Contact Email"
								name="contactEmail"
								formState={formState}
								setFormState={setFormState}
								required
							/>
							<div className="flex w-full flex-row items-center justify-start space-x-1.5">
								<Input
									type="checkbox"
									name="isBusiness"
									formState={formState}
									setFormState={setFormState}
									wrapperClassName="w-auto"
									required
								/>
								<label htmlFor="isBusiness">
									<span className="text-[13px] text-theme-light-gray">
										Are you a business?
									</span>
								</label>
							</div>

							{formState.isBusiness.value && (
								<>
									<Input
										type="text"
										placeholder="Business Name"
										name="businessName"
										formState={formState}
										setFormState={setFormState}
										required
									/>
									<Input
										type="text"
										placeholder="Business Address"
										name="businessAddress"
										formState={formState}
										setFormState={setFormState}
										required
									/>
									<Input
										type="text"
										placeholder="Business Description"
										name="description"
										formState={formState}
										setFormState={setFormState}
										required
									/>
								</>
							)}
						</div>
						<Button
							type="submit"
							className="whitespace-nowrap"
							extendClassName
							loading={loading}
						>
							Submit
						</Button>
					</form>
				</div>
			</div>
		</MainLayout>
	);
};

export default SellerOnboardingPage;
