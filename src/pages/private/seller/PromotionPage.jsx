import { useState, useEffect } from "react";
import { Input } from "../../../components/ui";

import { useApi } from "../../../hooks";
import { createPromotion } from "../../../api/seller";
import { getPromotionPrice } from "../../../api/public";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "../../../components/layouts";
import { clearErrors } from "../../../utils/form";

const initialState = {
	promotionDays: {
		value: "",
		error: "",
	},
	cardNumber: { value: "", error: "" },
	cardName: { value: "", error: "" },
	expiryDate: { value: "", error: "" },
	cvv: { value: "", error: "" },
};

const PromotionPage = () => {
	const { handleApiCall, loading } = useApi(createPromotion, {
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

	const navigate = useNavigate();

	const { handleApiCall: getPromotionPriceApiCall } =
		useApi(getPromotionPrice);

	const { id } = useParams();

	const [formState, setFormState] = useState(initialState);
	const [promotionPrice, setPromotionPrice] = useState();

	const resetForm = () => {
		setFormState(initialState);
	};

	const validateForm = () => {
		let valid = true;
		const newState = { ...formState };

		// Promotion Days: Must be a number
		if (!/^\d+$/.test(formState.promotionDays.value)) {
			newState.promotionDays.error = "Promotion days must be a number.";
			valid = false;
		}
		// Card Number: 16 digits only
		if (!/^\d{16}$/.test(formState.cardNumber.value)) {
			newState.cardNumber.error = "Card number must be 16 digits.";
			valid = false;
		}

		// Card Name: Only alphabets and spaces
		if (!/^[a-zA-Z ]{3,50}$/.test(formState.cardName.value)) {
			newState.cardName.error = "Card name must contain only letters.";
			valid = false;
		}

		// Expiry Date: MM/YY format
		if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(formState.expiryDate.value)) {
			newState.expiryDate.error = "Expiry date must be in MM/YY format.";
			valid = false;
		}

		// CVV: 3 or 4 digits
		if (!/^\d{3,4}$/.test(formState.cvv.value)) {
			newState.cvv.error = "CVV must be 3 or 4 digits.";
			valid = false;
		}

		setFormState(newState);
		return valid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (loading) return;
		if (!validateForm()) return;
		clearErrors(setFormState);
		const newPromotion = {
			promotionDays: parseInt(formState.promotionDays.value),
			cardNumber: formState.cardNumber.value,
			cardName: formState.cardName.value,
			expiryDate: formState.expiryDate.value,
			cvv: formState.cvv.value,
			carId: id,
		};
		const data = await handleApiCall(newPromotion);
		if (data) {
			resetForm();
			navigate("/seller");
		}
	};

	useEffect(() => {
		const fetchPromotionPrice = async () => {
			const data = await getPromotionPriceApiCall();
			if (!data) return navigate("/dashboard");

			setPromotionPrice(data);
		};

		fetchPromotionPrice();
	}, []);

	const handleWrongTypeInput = (e) => {
		let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

		setFormState((prev) => ({
			...prev,
			[e.target.name]: { ...prev[e.target.name], value }, // Update the correct field dynamically
		}));
	};

	const handleExpiryChange = (e) => {
		let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

		if (value.length > 4) {
			value = value.slice(0, 4); // Ensure it doesn't exceed MMYY format
		}

		// Auto-insert slash (/) after entering MM
		if (value.length > 2) {
			value = value.slice(0, 2) + "/" + value.slice(2);
		}

		setFormState((prev) => ({
			...prev,
			expiryDate: { ...prev.expiryDate, value },
		}));
	};

	const totalPromotionPrice = promotionPrice * formState.promotionDays.value;

	return (
		<MainLayout
			mainOptions={{
				paddingVertical: true,
			}}
		>
			<div className="flex w-full items-center justify-center">
				<div className="w-full max-w-lg space-y-8 rounded-xl bg-white p-12 shadow-md">
					<div>
						<h2 className="mt-6 text-center text-3xl font-extrabold text-blue-500">
							Promotion Payment
						</h2>
						<p className="mt-2 text-center text-sm text-gray-600">
							Complete your payment to activate the promotion
						</p>
					</div>
					<form className="mt-12 space-y-6" onSubmit={handleSubmit}>
						<div className="space-y-6 rounded-md">
							<div>
								<label
									htmlFor="promotionWeeks"
									className="block text-sm font-medium text-gray-700"
								>
									Promotion Duration (days)
								</label>
								<Input
									type="text"
									required
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
									placeholder="Enter number of days"
									formState={formState}
									setFormState={setFormState}
									name="promotionDays"
									onChange={handleWrongTypeInput}
								/>
							</div>
							<div>
								<label
									htmlFor="cardNumber"
									className="block text-sm font-medium text-gray-700"
								>
									Card number
								</label>
								<Input
									type="text"
									required
									minLength="16"
									maxLength="16"
									formState={formState}
									setFormState={setFormState}
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
									placeholder="Card number"
									name="cardNumber"
									onChange={handleWrongTypeInput}
								/>
							</div>
							<div>
								<label
									htmlFor="cardName"
									className="block text-sm font-medium text-gray-700"
								>
									Name on card
								</label>
								<Input
									type="text"
									formState={formState}
									setFormState={setFormState}
									required
									minLength="3"
									maxLength="40"
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
									placeholder="Name on card"
									name="cardName"
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label
										htmlFor="expiryDate"
										className="block text-sm font-medium text-gray-700"
									>
										Expiry date
									</label>

									<Input
										type="text"
										required
										maxLength="5"
										formState={formState}
										setFormState={setFormState}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
										placeholder="MM/YY"
										name="expiryDate"
										onChange={handleExpiryChange}
									/>
								</div>
								<div>
									<label
										htmlFor="cvv"
										className="block text-sm font-medium text-gray-700"
									>
										CVV
									</label>
									<Input
										type="text"
										required
										maxLength="4"
										formState={formState}
										setFormState={setFormState}
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
										placeholder="CVV"
										name="cvv"
										onChange={handleWrongTypeInput}
									/>
								</div>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<span className="text-sm font-medium text-gray-900">
									Promotion Price:
								</span>
								<span className="ml-2 text-lg font-bold text-blue-500">
									{totalPromotionPrice} $
								</span>
							</div>
						</div>

						<div>
							<button
								type="submit"
								className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
							>
								Pay Now
							</button>
						</div>
					</form>
				</div>
			</div>
		</MainLayout>
	);
};

export default PromotionPage;
