import { MainLayout } from "../../../components/layouts";
import { Button, Input } from "../../../components/ui";
import { createBrand } from "../../../api/staff";
import { useState, useEffect } from "react";
import { useApi } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { clearErrors } from "../../../utils/form";

const initialState = {
	name: { value: "", error: "" },
	icon: { value: null, error: "" }, // Store single file, not an array
};

const StaffCreateBrandPage = () => {
	const { handleApiCall: createBrandApiCall, loading: loadingCreateBrand } =
		useApi(createBrand, {
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
	const [formState, setFormState] = useState(initialState);
	const [preview, setPreview] = useState(null); // Store preview URL

	useEffect(() => {
		// Revoke the object URL to avoid memory leaks
		return () => {
			if (preview) {
				URL.revokeObjectURL(preview);
			}
		};
	}, [preview]);

	const resetForm = () => {
		setFormState(initialState);
		setPreview(null);
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const maxSize = 5 * 1024 * 1024; // 5MB max size

		if (file.size > maxSize) {
			alert("File is too large. Max size is 5MB.");
			return;
		}

		setFormState((prev) => ({
			...prev,
			icon: { value: file, error: "" }, // Store single file, not array
		}));

		// Generate preview
		const objectUrl = URL.createObjectURL(file);
		setPreview(objectUrl);
	};

	const handleCreateBrand = async (e) => {
		e.preventDefault();
		if (loadingCreateBrand) return;
		clearErrors(setFormState);

		const { name, icon } = formState;

		const formData = new FormData();
		formData.append("name", name.value);

		if (icon.value) {
			formData.append("icon", icon.value);
		}

		const response = await createBrandApiCall(formData);
		if (response) {
			resetForm();
			navigate("/admin/brands");
		}
	};

	return (
		<MainLayout>
			<div className="flex flex-grow items-center justify-center">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm">
					<form
						onSubmit={handleCreateBrand}
						className="flex w-full max-w-[300px] flex-col items-center justify-center space-y-10"
					>
						<div className="flex flex-col items-center justify-center space-y-1">
							<h1 className="text-[26px]">Create Brand</h1>
							<p className="text-[13px] text-theme-light-gray">
								Please provide the details for the new brand.
							</p>
						</div>
						<div className="flex w-full flex-col space-y-1.5">
							<Input
								type="text"
								placeholder="Brand Name"
								name="name"
								formState={formState}
								setFormState={setFormState}
								required
								minLength={2}
								maxLength={50}
							/>
							<div className="flex flex-col space-y-2">
								<input
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									className="w-full text-sm text-theme-text file:mr-4 file:rounded-full file:border-0 file:bg-blue-300 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-500"
								/>
								{preview && (
									<div className="mt-2 flex flex-wrap gap-2">
										<img
											src={preview}
											alt="icon preview"
											className="h-20 w-20 rounded object-cover"
										/>
									</div>
								)}
							</div>
						</div>
						<Button type="submit" className="w-full">
							Create Brand
						</Button>
					</form>
				</div>
			</div>
		</MainLayout>
	);
};

export default StaffCreateBrandPage;
