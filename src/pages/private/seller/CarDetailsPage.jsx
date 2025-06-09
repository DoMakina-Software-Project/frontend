import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "../../../components/layouts";
import {
	DateRangePicker,
	AvailabilityPeriodsList,
	Button,
} from "../../../components/ui";
import {
	FaCar,
	FaArrowLeft,
	FaEdit,
	FaSave,
	FaTimes,
	FaPlus,
	FaCalendarAlt,
	FaEye,
	FaImage,
	FaClock,
	FaCheckCircle,
	FaExclamationTriangle,
	FaInfoCircle,
} from "react-icons/fa";
import {
	getCar,
	updateCar,
	addRentalAvailability,
	removeRentalAvailability,
	getAvailableDatesInRange,
} from "../../../api/seller";
import { getAllBrandsSimple } from "../../../api/public";
import { useApi } from "../../../hooks";

const CarDetailsPage = () => {
	const { carId } = useParams();
	const navigate = useNavigate();

	const [car, setCar] = useState(null);
	const [brands, setBrands] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editForm, setEditForm] = useState({});
	const [newImages, setNewImages] = useState([]);
	const [allImages, setAllImages] = useState([]); // Combined existing + new images for display
	const [removedImageIds, setRemovedImageIds] = useState(new Set());
	const [availabilityPeriods, setAvailabilityPeriods] = useState([]);
	const [showDateRange, setShowDateRange] = useState({ start: "", end: "" });
	const [activeTab, setActiveTab] = useState("details");

	// API hooks
	const { handleApiCall: getCarApiCall, loading: loadingCar } =
		useApi(getCar);
	const { handleApiCall: updateCarApiCall, loading: loadingUpdate } = useApi(
		updateCar,
		{
			disableSuccessToast: false,
			successMessage: "Car updated successfully!",
			onValidationError: (errors) => {
				// Handle validation errors
				console.error("Validation errors:", errors);
			},
		},
	);
	const { handleApiCall: getBrandsApiCall } = useApi(getAllBrandsSimple);
	const { handleApiCall: addAvailabilityApiCall, loading: loadingAdd } =
		useApi(addRentalAvailability, {
			disableSuccessToast: false,
			successMessage: "Availability period added successfully!",
		});
	const { handleApiCall: removeAvailabilityApiCall, loading: loadingRemove } =
		useApi(removeRentalAvailability, {
			disableSuccessToast: false,
			successMessage: "Availability period removed successfully!",
		});
	const {
		handleApiCall: getAvailabilityApiCall,
		loading: loadingAvailability,
	} = useApi(getAvailableDatesInRange);

	useEffect(() => {
		if (carId) {
			fetchCar();
			fetchBrands();
		}
	}, [carId]);

	useEffect(() => {
		if (car && car.listingType === "RENT" && activeTab === "availability") {
			fetchAvailability();
		}
	}, [car, activeTab]);

	const fetchCar = async () => {
		const data = await getCarApiCall({ id: carId });
		if (data) {
			setCar(data);
			initializeEditForm(data);
		}
	};

	const fetchBrands = async () => {
		const data = await getBrandsApiCall();
		if (data) {
			setBrands(data);
		}
	};

	const initializeEditForm = (carData) => {
		setEditForm({
			brandId: carData.brandId || "",
			model: carData.model || "",
			year: carData.year || "",
			price: carData.price || "",
			description: carData.description || "",
			mileage: carData.mileage || "",
			fuelType: carData.fuelType || "PETROL",
			transmission: carData.transmission || "MANUAL",
			listingType: carData.listingType || "SALE",
		});

		// Initialize images - create objects with id and url for existing images
		const existingImageObjects = (carData.images || []).map(
			(url, index) => ({
				id: carData.imageIds?.[index] || null,
				url,
				isNew: false,
			}),
		);

		setAllImages(existingImageObjects);
		setNewImages([]);
		setRemovedImageIds(new Set());
	};

	const fetchAvailability = async () => {
		if (!car) return;

		const startDate = new Date();
		const endDate = new Date();
		endDate.setFullYear(endDate.getFullYear() + 1);

		setShowDateRange({
			start: startDate.toISOString().split("T")[0],
			end: endDate.toISOString().split("T")[0],
		});

		const data = await getAvailabilityApiCall({
			carId: car.id,
			startDate: startDate.toISOString().split("T")[0],
			endDate: endDate.toISOString().split("T")[0],
		});

		if (data) {
			setAvailabilityPeriods(data);
		}
	};

	const handleInputChange = (field, value) => {
		setEditForm((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		const validFiles = files.filter((file) => {
			const isValidType = [
				"image/jpeg",
				"image/png",
				"image/webp",
			].includes(file.type);
			const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
			return isValidType && isValidSize;
		});

		if (validFiles.length !== files.length) {
			alert(
				"Some files were skipped. Please ensure all images are JPG, PNG, or WebP and under 5MB.",
			);
		}

		// Add to new images
		setNewImages((prev) => [...prev, ...validFiles]);

		// Create preview objects for new images and add to allImages
		validFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onload = (e) => {
				const newImageObject = {
					id: null, // No ID for new images
					url: e.target.result,
					isNew: true,
					file, // Keep reference to file for upload
				};
				setAllImages((prev) => [...prev, newImageObject]);
			};
			reader.readAsDataURL(file);
		});
	};

	const removeImage = (index) => {
		const imageToRemove = allImages[index];

		if (imageToRemove.isNew) {
			// Remove new image from both arrays
			setNewImages((prev) =>
				prev.filter((_, i) => {
					// Find the index of this file in newImages array
					const fileIndex = prev.findIndex(
						(f) => f === imageToRemove.file,
					);
					return fileIndex !== i;
				}),
			);
		} else {
			// Add existing image ID to removal list
			if (imageToRemove.id) {
				setRemovedImageIds(
					(prev) => new Set([...prev, imageToRemove.id]),
				);
			}
		}

		// Remove from display array
		setAllImages((prev) => prev.filter((_, i) => i !== index));
	};

	const validateForm = () => {
		const errors = {};

		if (!editForm.brandId) errors.brandId = "Brand is required";
		if (!editForm.model || editForm.model.length < 2)
			errors.model = "Model must be at least 2 characters";
		if (
			!editForm.year ||
			editForm.year < 1990 ||
			editForm.year > new Date().getFullYear()
		) {
			errors.year = `Year must be between 1990 and ${new Date().getFullYear()}`;
		}
		if (!editForm.price || editForm.price <= 0)
			errors.price = "Price must be a positive number";
		if (!editForm.description || editForm.description.length < 10) {
			errors.description = "Description must be at least 10 characters";
		}
		if (!editForm.mileage || editForm.mileage < 0)
			errors.mileage = "Mileage must be a positive number";

		// Check final image count
		const finalImageCount = allImages.length;
		if (finalImageCount === 0)
			errors.images = "At least one image is required";
		if (finalImageCount > 10) errors.images = "Maximum 10 images allowed";

		return errors;
	};

	const handleUpdateCar = async () => {
		const errors = validateForm();
		if (Object.keys(errors).length > 0) {
			// Show validation errors
			Object.values(errors).forEach((error) => alert(error));
			return;
		}

		const updateData = {
			id: car.id,
			...editForm,
		};

		// Add new images if any
		if (newImages.length > 0) {
			updateData.newImages = newImages;
		}

		// Add removed image IDs if any
		if (removedImageIds.size > 0) {
			updateData.removedImageIds = Array.from(removedImageIds);
		}

		const data = await updateCarApiCall(updateData);
		if (data) {
			setIsEditing(false);
			await fetchCar(); // Refresh car data
		}
	};

	const handleAddAvailability = async (dateRange) => {
		if (!car) return;

		const data = await addAvailabilityApiCall({
			carId: car.id,
			periods: [dateRange],
		});

		if (data) {
			await fetchAvailability();
		}
	};

	const handleRemoveAvailability = async (period) => {
		if (!car) return;

		const data = await removeAvailabilityApiCall({
			carId: car.id,
			periods: [period],
		});

		if (data) {
			await fetchAvailability();
		}
	};

	const getVerificationStatusBadge = () => {
		const status = car?.verificationStatus;
		const statusConfig = {
			PENDING: {
				color: "bg-yellow-100 text-yellow-800",
				icon: FaClock,
				text: "Pending Review",
			},
			APPROVED: {
				color: "bg-green-100 text-green-800",
				icon: FaCheckCircle,
				text: "Approved",
			},
			REJECTED: {
				color: "bg-red-100 text-red-800",
				icon: FaExclamationTriangle,
				text: "Rejected",
			},
		};

		const config = statusConfig[status] || statusConfig.PENDING;
		const Icon = config.icon;

		return (
			<span
				className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${config.color}`}
			>
				<Icon size={12} />
				{config.text}
			</span>
		);
	};

	if (loadingCar) {
		return (
			<MainLayout mainOptions={{ paddingVertical: false }}>
				<div className="flex min-h-screen items-center justify-center">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
				</div>
			</MainLayout>
		);
	}

	if (!car) {
		return (
			<MainLayout mainOptions={{ paddingVertical: false }}>
				<div className="flex min-h-screen items-center justify-center">
					<div className="text-center">
						<FaCar className="mx-auto mb-4 text-6xl text-gray-400" />
						<h2 className="mb-2 text-xl font-semibold text-gray-900">
							Car not found
						</h2>
						<p className="text-gray-600">
							The car you&apos;re looking for doesn&apos;t exist.
						</p>
						<Button
							onClick={() => navigate("/seller")}
							className="mt-4"
						>
							Back to Dashboard
						</Button>
					</div>
				</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout mainOptions={{ paddingVertical: false }}>
			<div className="min-h-screen w-full bg-gray-50">
				<div className="mx-auto max-w-6xl px-6 py-8">
					{/* Header */}
					<div className="mb-8 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<button
								onClick={() => navigate("/seller")}
								className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition-colors hover:bg-gray-50"
							>
								<FaArrowLeft />
							</button>
							<div>
								<h1 className="text-3xl font-bold text-gray-900">
									{car.brand} {car.model} ({car.year})
								</h1>
								<p className="text-gray-600">
									Manage car details and availability
								</p>
							</div>
						</div>
					</div>

					{/* Car Info Header */}
					<div className="mb-6 flex items-center gap-4 rounded-lg bg-theme-blue p-4 text-white">
						<div className="flex-shrink-0">
							{car.images && car.images.length > 0 ? (
								<img
									src={car.images[0]}
									alt={`${car.brand} ${car.model}`}
									className="h-16 w-16 rounded-md object-cover"
								/>
							) : (
								<div className="flex h-16 w-16 items-center justify-center rounded-md bg-white/20">
									<FaCar className="text-2xl" />
								</div>
							)}
						</div>
						<div className="flex-1">
							<h2 className="text-xl font-semibold">
								{car.brand} {car.model} ({car.year})
							</h2>
							<p className="text-blue-100">
								${car.price?.toLocaleString()}
								{car.listingType === "RENT" && "/day"} •{" "}
								{car.listingType === "SALE"
									? "For Sale"
									: "For Rent"}
							</p>
						</div>
					</div>

					{/* Tabs */}
					<div className="mb-6">
						<div className="border-b border-gray-200">
							<nav className="-mb-px flex space-x-8">
								<button
									onClick={() => setActiveTab("details")}
									className={`border-b-2 px-1 py-2 text-sm font-medium ${
										activeTab === "details"
											? "border-theme-blue text-theme-blue"
											: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
									}`}
								>
									<div className="flex items-center gap-2">
										<FaEye size={16} />
										Car Details
									</div>
								</button>
								{car.listingType === "RENT" && (
									<button
										onClick={() =>
											setActiveTab("availability")
										}
										className={`border-b-2 px-1 py-2 text-sm font-medium ${
											activeTab === "availability"
												? "border-theme-blue text-theme-blue"
												: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
										}`}
									>
										<div className="flex items-center gap-2">
											<FaCalendarAlt size={16} />
											Availability
										</div>
									</button>
								)}
							</nav>
						</div>
					</div>

					{/* Tab Content */}
					<div className="rounded-lg bg-white p-6 shadow-sm">
						{activeTab === "details" && (
							<div className="space-y-6">
								{/* Car Images Section */}
								<div className="space-y-4">
									<div className="flex items-center justify-between">
										<h3 className="text-lg font-semibold text-gray-900">
											Car Images
										</h3>
										{isEditing && (
											<div className="flex items-center gap-2">
												<label className="flex cursor-pointer items-center gap-2 rounded bg-theme-blue px-3 py-1 text-sm text-white hover:bg-blue-600">
													<FaPlus size={12} />
													Add Images
													<input
														type="file"
														multiple
														accept="image/jpeg,image/png,image/webp"
														onChange={
															handleImageUpload
														}
														className="hidden"
													/>
												</label>
											</div>
										)}
									</div>

									{allImages.length > 0 ? (
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
											{allImages.map(
												(imageObj, index) => {
													return (
														<div
															key={index}
															className="group relative"
														>
															<img
																src={
																	imageObj.url
																}
																alt={`${car.brand} ${car.model} - ${index + 1}`}
																className="h-48 w-full rounded-lg object-cover shadow-md transition-opacity"
															/>
															{isEditing && (
																<button
																	onClick={() =>
																		removeImage(
																			index,
																		)
																	}
																	className="absolute right-2 top-2 rounded-full bg-red-600 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
																>
																	<FaTimes
																		size={
																			12
																		}
																	/>
																</button>
															)}
															{/* New image indicator */}
															{imageObj.isNew && (
																<div className="absolute left-2 top-2 rounded bg-green-600 px-2 py-1 text-xs text-white">
																	New
																</div>
															)}
														</div>
													);
												},
											)}
										</div>
									) : (
										<div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8">
											<FaImage className="mx-auto mb-3 text-4xl text-gray-400" />
											<p className="text-gray-600">
												No images uploaded
											</p>
											{isEditing && (
												<label className="mt-2 cursor-pointer rounded bg-theme-blue px-4 py-2 text-white hover:bg-blue-600">
													Upload Images
													<input
														type="file"
														multiple
														accept="image/jpeg,image/png,image/webp"
														onChange={
															handleImageUpload
														}
														className="hidden"
													/>
												</label>
											)}
										</div>
									)}
								</div>

								{/* Car Information Card */}
								<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
									<div className="mb-4 flex items-center justify-between">
										<h3 className="text-lg font-semibold text-gray-900">
											Car Information
										</h3>
										<div className="flex items-center gap-2">
											{getVerificationStatusBadge()}
											{!isEditing ? (
												<button
													onClick={() =>
														setIsEditing(true)
													}
													className="flex items-center gap-1 rounded bg-theme-blue px-3 py-1 text-sm text-white hover:bg-blue-600"
												>
													<FaEdit size={12} />
													Edit
												</button>
											) : (
												<div className="flex gap-2">
													<button
														onClick={
															handleUpdateCar
														}
														disabled={loadingUpdate}
														className="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
													>
														<FaSave size={12} />
														{loadingUpdate
															? "Saving..."
															: "Save"}
													</button>
													<button
														onClick={() => {
															setIsEditing(false);
															initializeEditForm(
																car,
															);
														}}
														className="flex items-center gap-1 rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
													>
														<FaTimes size={12} />
														Cancel
													</button>
												</div>
											)}
										</div>
									</div>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										<div className="space-y-4">
											{/* Brand */}
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Brand
												</label>
												{isEditing ? (
													<select
														value={editForm.brandId}
														onChange={(e) =>
															handleInputChange(
																"brandId",
																e.target.value,
															)
														}
														className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
													>
														<option value="">
															Select Brand
														</option>
														{brands.map((brand) => (
															<option
																key={brand.id}
																value={brand.id}
															>
																{brand.name}
															</option>
														))}
													</select>
												) : (
													<p className="mt-1 text-gray-900">
														{car.brand}
													</p>
												)}
											</div>

											{/* Model */}
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Model
												</label>
												{isEditing ? (
													<input
														type="text"
														value={editForm.model}
														onChange={(e) =>
															handleInputChange(
																"model",
																e.target.value,
															)
														}
														className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
													/>
												) : (
													<p className="mt-1 text-gray-900">
														{car.model}
													</p>
												)}
											</div>

											{/* Year */}
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Year
												</label>
												{isEditing ? (
													<input
														type="number"
														min="1990"
														max={new Date().getFullYear()}
														value={editForm.year}
														onChange={(e) =>
															handleInputChange(
																"year",
																e.target.value,
															)
														}
														className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
													/>
												) : (
													<p className="mt-1 text-gray-900">
														{car.year}
													</p>
												)}
											</div>

											{/* Price */}
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Price
												</label>
												{isEditing ? (
													<input
														type="number"
														min="0"
														value={editForm.price}
														onChange={(e) =>
															handleInputChange(
																"price",
																e.target.value,
															)
														}
														className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
													/>
												) : (
													<p className="mt-1 text-gray-900">
														$
														{car.price?.toLocaleString()}
														{car.listingType ===
															"RENT" && "/day"}
													</p>
												)}
											</div>

											{/* Listing Type */}
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Listing Type
												</label>
												{isEditing ? (
													<select
														value={
															editForm.listingType
														}
														onChange={(e) =>
															handleInputChange(
																"listingType",
																e.target.value,
															)
														}
														className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
													>
														<option value="SALE">
															For Sale
														</option>
														<option value="RENT">
															For Rent
														</option>
													</select>
												) : (
													<p className="mt-1 text-gray-900">
														{car.listingType ===
														"SALE"
															? "For Sale"
															: "For Rent"}
													</p>
												)}
											</div>
										</div>

										<div className="space-y-4">
											{/* Mileage */}
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Mileage
												</label>
												{isEditing ? (
													<input
														type="number"
														min="0"
														value={editForm.mileage}
														onChange={(e) =>
															handleInputChange(
																"mileage",
																e.target.value,
															)
														}
														className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
													/>
												) : (
													<p className="mt-1 text-gray-900">
														{car.mileage?.toLocaleString()}{" "}
														miles
													</p>
												)}
											</div>

											{/* Fuel Type */}
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Fuel Type
												</label>
												{isEditing ? (
													<select
														value={
															editForm.fuelType
														}
														onChange={(e) =>
															handleInputChange(
																"fuelType",
																e.target.value,
															)
														}
														className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
													>
														<option value="PETROL">
															Petrol
														</option>
														<option value="DIESEL">
															Diesel
														</option>
														<option value="ELECTRIC">
															Electric
														</option>
														<option value="HYBRID">
															Hybrid
														</option>
														<option value="OTHER">
															Other
														</option>
													</select>
												) : (
													<p className="mt-1 text-gray-900">
														{car.fuelType}
													</p>
												)}
											</div>

											{/* Transmission */}
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Transmission
												</label>
												{isEditing ? (
													<select
														value={
															editForm.transmission
														}
														onChange={(e) =>
															handleInputChange(
																"transmission",
																e.target.value,
															)
														}
														className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
													>
														<option value="MANUAL">
															Manual
														</option>
														<option value="AUTOMATIC">
															Automatic
														</option>
														<option value="SEMI_AUTOMATIC">
															Semi-Automatic
														</option>
													</select>
												) : (
													<p className="mt-1 text-gray-900">
														{car.transmission}
													</p>
												)}
											</div>

											{/* Status */}
											<div>
												<label className="block text-sm font-medium text-gray-700">
													Status
												</label>
												<p className="mt-1 text-gray-900">
													{car.status}
												</p>
											</div>
										</div>
									</div>

									{/* Description */}
									<div className="mt-4">
										<label className="block text-sm font-medium text-gray-700">
											Description
										</label>
										{isEditing ? (
											<textarea
												value={editForm.description}
												onChange={(e) =>
													handleInputChange(
														"description",
														e.target.value,
													)
												}
												rows={4}
												className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-theme-blue focus:outline-none focus:ring-1 focus:ring-theme-blue"
												placeholder="Describe your car..."
											/>
										) : (
											<p className="mt-1 text-gray-900">
												{car.description}
											</p>
										)}
									</div>

									{/* Rejection Reason */}
									{car.verificationStatus === "REJECTED" &&
										car.rejectionReason && (
											<div className="mt-4 rounded-lg bg-red-50 p-4">
												<div className="mb-2 flex items-center gap-2">
													<FaExclamationTriangle className="text-red-600" />
													<h4 className="font-medium text-red-800">
														Rejection Reason:
													</h4>
												</div>
												<p className="text-sm text-red-700">
													{car.rejectionReason}
												</p>
											</div>
										)}
								</div>

								{/* Actions */}
								{/* {!isEditing && (
									<div className="flex justify-end gap-4">
										<button
											onClick={handleDeleteCar}
											disabled={loadingDelete}
											className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
										>
											<FaTrash size={16} />
											{loadingDelete
												? "Deleting..."
												: "Delete Car"}
										</button>
									</div>
								)} */}
							</div>
						)}

						{activeTab === "availability" &&
							car.listingType === "RENT" && (
								<div className="space-y-6">
									{/* Info Banner */}
									<div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
										<FaInfoCircle className="mt-0.5 text-theme-blue" />
										<div className="text-sm text-blue-800">
											<p className="mb-1 font-medium">
												Availability Management Tips:
											</p>
											<ul className="space-y-1 text-blue-700">
												<li>
													• Add date ranges when your
													car is available for rent
												</li>
												<li>
													• Overlapping periods will
													be automatically merged
												</li>
												<li>
													• You can remove periods
													that are no longer available
												</li>
												<li>
													• Past dates cannot be
													selected
												</li>
											</ul>
										</div>
									</div>

									{/* Date Range Display */}
									{showDateRange.start &&
										showDateRange.end && (
											<div className="rounded-lg bg-gray-50 p-4">
												<div className="mb-2 flex items-center gap-2">
													<FaCalendarAlt className="text-gray-600" />
													<span className="font-medium text-gray-700">
														Viewing Availability:
													</span>
												</div>
												<p className="text-gray-600">
													{new Date(
														showDateRange.start,
													).toLocaleDateString()}{" "}
													-{" "}
													{new Date(
														showDateRange.end,
													).toLocaleDateString()}
												</p>
											</div>
										)}

									{/* Availability Management */}
									<DateRangePicker
										onAddRange={handleAddAvailability}
										onRemoveRange={handleRemoveAvailability}
										disabled={loadingAdd || loadingRemove}
									/>

									{/* Current Availability */}
									{loadingAvailability ? (
										<div className="flex items-center justify-center py-8">
											<div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
										</div>
									) : (
										<AvailabilityPeriodsList
											periods={availabilityPeriods}
											onRemovePeriod={
												handleRemoveAvailability
											}
											loading={loadingRemove}
										/>
									)}
								</div>
							)}
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default CarDetailsPage;
