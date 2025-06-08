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

const currentYear = new Date().getFullYear();
const yearOptions = Array.from(
	{ length: currentYear - 1989 },
	(_, i) => currentYear - i
);

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
	const [filteredBrands, setFilteredBrands] = useState([]);
	const [activeStep, setActiveStep] = useState(1);
	const totalSteps = 3;

	const resetForm = () => {
		setFormState(initialState);
		setActiveStep(1);
	};

	const validateBasicInfo = () => {
		const { brand, model, year, price, listingType } = formState;
		let isValid = true;
		const newState = { ...formState };

		if (!brand.value) {
			newState.brand.error = "Brand is required";
			isValid = false;
		}

		if (!model.value) {
			newState.model.error = "Model is required";
			isValid = false;
		} else if (model.value.length < 2) {
			newState.model.error = "Model must be at least 2 characters";
			isValid = false;
		} else if (model.value.length > 50) {
			newState.model.error = "Model must be at most 50 characters";
			isValid = false;
		}

		if (!year.value) {
			newState.year.error = "Year is required";
			isValid = false;
		} else {
			const yearNum = parseInt(year.value);
			if (isNaN(yearNum) || yearNum < 1990 || yearNum > currentYear) {
				newState.year.error = `Year must be between 1990 and ${currentYear}`;
				isValid = false;
			}
		}

		if (!price.value) {
			newState.price.error = "Price is required";
			isValid = false;
		} else {
			const priceNum = parseInt(price.value);
			if (isNaN(priceNum) || priceNum <= 0) {
				newState.price.error = "Price must be a positive number";
				isValid = false;
			}
		}

		if (!listingType.value) {
			newState.listingType.error = "Please select listing type";
			isValid = false;
		}

		setFormState(newState);
		return isValid;
	};

	const validateCarDetails = () => {
		const { description, mileage, fuelType, transmission } = formState;
		let isValid = true;
		const newState = { ...formState };

		if (!description.value) {
			newState.description.error = "Description is required";
			isValid = false;
		} else if (description.value.length < 10) {
			newState.description.error = "Description must be at least 10 characters";
			isValid = false;
		} else if (description.value.length > 500) {
			newState.description.error = "Description must be at most 500 characters";
			isValid = false;
		}

		if (!mileage.value) {
			newState.mileage.error = "Mileage is required";
			isValid = false;
		} else {
			const mileageNum = parseInt(mileage.value);
			if (isNaN(mileageNum) || mileageNum < 0) {
				newState.mileage.error = "Mileage must be a positive number";
				isValid = false;
			} else if (mileageNum > 1000000) {
				newState.mileage.error = "Mileage cannot exceed 1,000,000 km";
				isValid = false;
			}
		}

		if (!fuelType.value) {
			newState.fuelType.error = "Fuel type is required";
			isValid = false;
		}

		if (!transmission.value) {
			newState.transmission.error = "Transmission type is required";
			isValid = false;
		}

		setFormState(newState);
		return isValid;
	};

	const validatePhotos = () => {
		const { photos } = formState;
		let isValid = true;
		const newState = { ...formState };

		if (!photos.value || photos.value.length === 0) {
			newState.photos.error = "At least one photo is required";
			isValid = false;
		} else if (photos.value.length > 10) {
			newState.photos.error = "Maximum 10 photos allowed";
			isValid = false;
		}

		// Check file types and sizes
		const invalidFiles = photos.value.filter(file => {
			const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
			const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
			return !isValidType || !isValidSize;
		});

		if (invalidFiles.length > 0) {
			newState.photos.error = "All photos must be JPG, PNG, or WebP and under 5MB";
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

	const handleBrandSearch = (searchTerm) => {
		if (!searchTerm) {
			setFilteredBrands(brands);
			return;
		}
		const filtered = brands.filter((brand) =>
			brand.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
		setFilteredBrands(filtered);
	};

	useEffect(() => {
		getBrandsApiCall().then((data) => {
			setBrands(data);
			setFilteredBrands(data);
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
								brands={filteredBrands}
								yearOptions={yearOptions}
								onBrandSearch={handleBrandSearch}
								currentYear={currentYear}
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
