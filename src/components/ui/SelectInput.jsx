const SelectInput = ({
	name,
	value,
	onChange,
	options,
	placeholder,
	required,
	formState,
	setFormState,
	className = "",
	disabled = false,
}) => {
	const handleChange = (e) => {
		const value = e.target.value;
		setFormState((prev) => ({
			...prev,
			[name]: { value, error: "" },
		}));
		onChange?.(e);
	};

	return (
		<div className="flex flex-col space-y-1.5">
			<select
				className={`w-full rounded-lg border ${
					formState[name].error
						? "border-red-500 focus:border-red-500"
						: "border-gray-300 focus:border-blue-500"
				} bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none ${
					disabled ? "cursor-not-allowed opacity-50" : ""
				} ${className}`}
				value={value}
				onChange={handleChange}
				required={required}
				disabled={disabled}
			>
				{placeholder && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			{formState[name].error && (
				<p className="text-xs text-red-500">{formState[name].error}</p>
			)}
		</div>
	);
};

export default SelectInput;
