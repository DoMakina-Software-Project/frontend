import { MainLayout } from "../../../components/layouts";
import { Button, Input, TextArea } from "../../../components/ui";
import { useEffect, useState } from "react";
import { createCar } from "../../../api/seller";
import { getAllBrands } from "../../../api/public";
import { useApi } from "../../../hooks";
import { useNavigate } from "react-router-dom";

const initialState = {
	brand: { value: "", error: "" },
	model: { value: "", error: "" },
	year: { value: "", error: "" },
	price: { value: "", error: "" },
	description: { value: "", error: "" },
	photos: { value: [], error: "" },
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

	const resetForm = () => {
		setFormState(initialState);
	};

	const clearErrors = () => {
		setFormState((prev) => {
			const newState = { ...prev };
			Object.keys(newState).forEach((key) => {
				newState[key].error = "";
			});

			return newState;
		});
	};

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);

		// Update state with actual file objects (for FormData)
		setFormState((prev) => ({
			...prev,
			photos: { value: [...prev.photos.value, ...files], error: "" },
		}));
	};

	const handleSellCar = async (e) => {
		e.preventDefault();
		if (loadingCreateCar || loadingBrands) return;
		clearErrors();

		const { brand, model, year, price, description, photos } = formState;

		const formData = new FormData();

		formData.append("brandId", brand.value);
		formData.append("model", model.value);
		formData.append("year", year.value);
		formData.append("price", price.value);
		formData.append("description", description.value);
		photos.value.forEach((photo) => {
			formData.append("images", photo);
		});

		const response = await createCarApiCall(formData);
		if (response) {
			resetForm();
			navigate("/dashboard");
		}
	};

	useEffect(() => {
		getBrandsApiCall().then((data) => {
			setBrands(data);
		});
	}, []);

	return (
		<MainLayout>
			<div className="flex flex-grow items-center justify-center">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm">
					<form
						onSubmit={handleSellCar}
						className="flex w-full max-w-[300px] flex-col items-center justify-center space-y-10"
					>
						<div className="flex flex-col items-center justify-center space-y-1">
							<h1 className="text-[26px]">Sell your Car</h1>
							<p className="text-[13px] text-theme-light-gray">
								Please provide the details of your car.
							</p>
						</div>
						<div className="flex w-full flex-col space-y-1.5">
							<select
								className="w-full rounded bg-theme-input px-3 py-2 text-[13px] text-theme-text placeholder-theme-light-gray"
								value={formState.brand.value}
								onChange={(e) =>
									setFormState((prev) => ({
										...prev,
										brand: {
											value: e.target.value,
											error: "",
										},
									}))
								}
								required
							>
								<option value="" disabled>
									Select Brand
								</option>
								{brands.map((brand) => (
									<option key={brand.id} value={brand.id}>
										{brand.name}
									</option>
								))}
							</select>
							<Input
								type="text"
								placeholder="Model"
								name="model"
								formState={formState}
								setFormState={setFormState}
								required
								minLength={2}
								maxLength={50}
							/>
							<Input
								type="number"
								placeholder="Year"
								name="year"
								formState={formState}
								setFormState={setFormState}
								required
								min={1885}
								max={new Date().getFullYear()}
							/>
							<Input
								type="number"
								placeholder="Price (USD)"
								name="price"
								formState={formState}
								setFormState={setFormState}
								required
								min={0}
								max={1000000000}
							/>
							<TextArea
								placeholder="Description"
								name="description"
								formState={formState}
								setFormState={setFormState}
								required
								minLength={10}
								maxLength={500}
							/>
							<div className="flex flex-col space-y-2">
								<label className="text-sm text-theme-text">
									Upload Photos
								</label>
								<input
									type="file"
									accept="image/*"
									multiple
									onChange={handleImageUpload}
									className="w-full text-sm text-theme-text file:mr-4 file:rounded-full file:border-0 file:bg-blue-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-500"
								/>
								{formState.photos.value.length > 0 && (
									<div className="mt-2 flex flex-wrap gap-2">
										{formState.photos.value.map(
											(photo, index) => (
												<img
													key={index}
													src={URL.createObjectURL(
														photo,
													)} // Create URL from File object
													alt={`Uploaded car photo ${index + 1}`}
													className="h-20 w-20 rounded object-cover"
												/>
											),
										)}
									</div>
								)}
							</div>
						</div>
						<Button type="submit" className="w-full">
							Create Post
						</Button>
					</form>
				</div>
			</div>
		</MainLayout>
	);
};

export default SellCarPage;
