const PhotoUpload = ({ formState, setFormState }) => {
	const handleImageUpload = (e) => {
		const files = Array.from(e.target.files);
		setFormState((prev) => ({
			...prev,
			photos: { value: [...prev.photos.value, ...files], error: "" },
		}));
	};

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold text-gray-800">Photos</h2>
			<div className="flex flex-col space-y-4">
				<div className="flex flex-col space-y-2">
					<label className="text-sm font-medium text-gray-700">
						Upload Photos (Max 5)
					</label>
					<input
						type="file"
						accept="image/*"
						multiple
						onChange={handleImageUpload}
						className="w-full text-sm text-gray-900 file:mr-4 file:rounded-full file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-600"
						disabled={formState.photos.value.length >= 5}
					/>
					<p className="text-xs text-gray-500">
						Upload up to 5 photos of your car. Supported formats:
						JPG, PNG
					</p>
				</div>
				{formState.photos.value.length > 0 && (
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{formState.photos.value.map((photo, index) => (
							<div key={index} className="relative">
								<img
									src={URL.createObjectURL(photo)}
									alt={`Uploaded car photo ${index + 1}`}
									className="h-32 w-full rounded-lg object-cover"
								/>
								<button
									type="button"
									onClick={() => {
										setFormState((prev) => ({
											...prev,
											photos: {
												value: prev.photos.value.filter(
													(_, i) => i !== index,
												),
												error: "",
											},
										}));
									}}
									className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default PhotoUpload;
