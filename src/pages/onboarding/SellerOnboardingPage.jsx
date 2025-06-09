import { MainLayout } from "../../components/layouts";
import { useState } from "react";
import { useApi, useAuth } from "../../hooks";
import { createSellerProfile } from "../../api/seller";
import { Button, Input } from "../../components/ui";
import { clearErrors } from "../../utils/form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { ALBANIAN_CITIES } from "../../data/cities";

const cityOptions = ALBANIAN_CITIES.map((city) => ({
	value: city,
	label: city,
}));

const countryOptions = [{ value: "Albania", label: "Albania" }];

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
	const { fetchUser } = useAuth();

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

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (loading) return;
		clearErrors(setFormState);

		if (!formState) {
			console.error("Form state is undefined");
			return;
		}

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

		if (
			!isBusiness ||
			!country ||
			!city ||
			!contactPhone ||
			!contactEmail
		) {
			console.error("Required form fields are missing");
			return;
		}

		let payload = {
			isBusiness: isBusiness.value,
			country: country.value,
			city: city.value,
			contactPhone: contactPhone.value,
			contactEmail: contactEmail.value,
		};

		if (isBusiness.value) {
			if (!businessName.value || !businessAddress.value || !description.value) {
				console.error("Required business fields are missing");
				return;
			}
			payload = {
				...payload,
				businessName: businessName.value,
				businessAddress: businessAddress.value,
				description: description.value,
			};
		}

		const data = await createSellerProfileApiCall(payload);

		if (data) {
			await fetchUser();
			navigate("/seller");
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
							<Select
								placeholder="Country (available only for Albania)"
								options={countryOptions}
								value={countryOptions.find(
									(option) =>
										option.value ===
										formState.country.value,
								)}
								onChange={(selectedOption) => {
									setFormState((prev) => ({
										...prev,
										country: {
											...prev.country,
											value: selectedOption?.value || "",
											error: "",
										},
									}));
								}}
								className="w-full"
							/>
							{formState.country.error && (
								<span className="text-xs text-red-500">
									{formState.country.error}
								</span>
							)}
							<Select
								placeholder="City"
								options={cityOptions}
								value={cityOptions.find(
									(option) =>
										option.value === formState.city.value,
								)}
								onChange={(selectedOption) => {
									setFormState((prev) => ({
										...prev,
										city: {
											...prev.city,
											value: selectedOption?.value || "",
											error: "",
										},
									}));
								}}
								className="w-full"
							/>
							{formState.city.error && (
								<span className="text-xs text-red-500">
									{formState.city.error}
								</span>
							)}
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
