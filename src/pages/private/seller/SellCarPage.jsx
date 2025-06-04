import { MainLayout } from "../../../components/layouts";
import { useEffect, useState } from "react";
import { createCar } from "../../../api/seller";
import { getAllBrands } from "../../../api/public";
import { useApi } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { clearErrors } from "../../../utils/form";
import {
	StepIndicator,
	BasicInfo,
	CarDetails,
	PhotoUpload,
	NavigationButtons,
} from "../../../components/pages/SellCar";

const initialState = {
	brand: { value: "", error: "" },
	model: { value: "", error: "" },
	year: { value: "", error: "" },
	price: { value: "", error: "" },
	description: { value: "", error: "" },
	photos: { value: [], error: "" },
	listingType: { value: "SALE", error: "" },
	fuelType: { value: "PETROL", error: "" },
	transmission: { value: "MANUAL", error: "" },
	mileage: { value: "", error: "" },
};

const SellCarPage = () => {
	const { handleApiCall: createCarApiCall, loading: loadingCreateCar } =
		useApi(createCar, {
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

	const { handleApiCall: getBrandsApiCall, loading: loadingBrands } =
		useApi(getAllBrands);

	const navigate = useNavigate();

	const [formState, setFormState] = useState(initialState);
	const [brands, setBrands] = useState([]);
	const [activeStep, setActiveStep] = useState(1);
	const totalSteps = 3;

	const resetForm = () => {
		setFormState(initialState);
		setActiveStep(1);
	};

	const validateBasicInfo = () => {
		const { brand, model, year, price } = formState;
		let isValid = true;
		const newState = { ...formState };

		if (!brand.value) {
			newState.brand.error = "Brand is required";
			isValid = false;
		}
		if (!model.value) {
			newState.model.error = "Model is required";
			isValid = false;
		}
		if (!year.value) {
			newState.year.error = "Year is required";
			isValid = false;
		}
		if (!price.value) {
			newState.price.error = "Price is required";
			isValid = false;
		}

		setFormState(newState);
		return isValid;
	};

	const validateCarDetails = () => {
		const { description, mileage } = formState;
		let isValid = true;
		const newState = { ...formState };

		if (!description.value) {
			newState.description.error = "Description is required";
			isValid = false;
		} else if (description.value.length < 10) {
			newState.description.error =
				"Description must be at least 10 characters";
			isValid = false;
		}
		if (!mileage.value) {
			newState.mileage.error = "Mileage is required";
			isValid = false;
		}

		setFormState(newState);
		return isValid;
	};

	const validatePhotos = () => {
		const { photos } = formState;
		let isValid = true;
		const newState = { ...formState };

		if (photos.value.length === 0) {
			newState.photos.error = "At least one photo is required";
			isValid = false;
		}

		setFormState(newState);
		return isValid;
	};

	const handleSellCar = async (e) => {
		e.preventDefault();
		if (loadingCreateCar || loadingBrands) return;
		clearErrors(setFormState);

		const {
			brand,
			model,
			year,
			price,
			description,
			photos,
			listingType,
			fuelType,
			transmission,
			mileage,
		} = formState;

		const formData = new FormData();
		formData.append("brandId", brand.value);
		formData.append("model", model.value);
		formData.append("year", year.value);
		formData.append("price", price.value);
		formData.append("description", description.value);
		formData.append("listingType", listingType.value);
		formData.append("fuelType", fuelType.value);
		formData.append("transmission", transmission.value);
		formData.append("mileage", mileage.value);
		photos.value.forEach((photo) => {
			formData.append("images", photo);
		});

		const response = await createCarApiCall(formData);
		if (response) {
			resetForm();
			navigate("/seller");
		}
	};

	const handleNext = (e) => {
		e.preventDefault();
		let canProceed = false;

		switch (activeStep) {
			case 1:
				canProceed = validateBasicInfo();
				break;
			case 2:
				canProceed = validateCarDetails();
				break;
			case 3:
				canProceed = validatePhotos();
				break;
			default:
				canProceed = false;
		}

		if (canProceed) {
			setActiveStep(activeStep + 1);
		}
	};

	const handlePrevious = (e) => {
		e.preventDefault();
		setActiveStep(activeStep - 1);
	};

	useEffect(() => {
		getBrandsApiCall().then((data) => {
			setBrands(data);
		});
	}, []);

	return (
		<MainLayout mainOptions={{ centerHorizontal: true }}>
			<div className="flex flex-col items-center justify-center bg-gray-50 py-12">
				<div className="w-full max-w-4xl rounded-2xl bg-white p-8 shadow-lg">
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold text-gray-900">
							List a Car
						</h1>
						<p className="mt-2 text-sm text-gray-600">
							Please provide the details of your car to create a
							listing.
						</p>
					</div>

					<StepIndicator
						activeStep={activeStep}
						totalSteps={totalSteps}
					/>

					<form onSubmit={handleSellCar} className="space-y-8">
						{activeStep === 1 && (
							<BasicInfo
								formState={formState}
								setFormState={setFormState}
								brands={brands}
							/>
						)}
						{activeStep === 2 && (
							<CarDetails
								formState={formState}
								setFormState={setFormState}
							/>
						)}
						{activeStep === 3 && (
							<PhotoUpload
								formState={formState}
								setFormState={setFormState}
							/>
						)}

						<NavigationButtons
							activeStep={activeStep}
							totalSteps={totalSteps}
							onPrevious={handlePrevious}
							onNext={handleNext}
							loading={loadingCreateCar}
						/>
					</form>
				</div>
			</div>
		</MainLayout>
	);
};

export default SellCarPage;
