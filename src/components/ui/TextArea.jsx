const DEFAULT_CLASS_NAME =
	"w-full px-3 py-2 min-h-20 text-[13px] rounded bg-theme-input text-theme-text placeholder-theme-light-gray";

const TextArea = ({
	className,
	name = "",
	formState,
	setFormState = () => {},
	wrapperClassName = "",
	value,
	onChange,
	...props
}) => {
	const formValue = formState?.[name]?.value;
	const errorMessage = formState?.[name]?.error;

	const defaultClassName = `${DEFAULT_CLASS_NAME} ${errorMessage ? "border border-red-500" : ""}`;

	const onFormChange = (e) => {
		const { value } = e.target;

		setFormState((prev) => ({
			...prev,
			[name]: {
				value,
				error: "",
			},
		}));
	};

	return (
		<div
			className={`flex max-w-[300px] flex-col space-y-px ${wrapperClassName ? wrapperClassName : "w-full"}`}
		>
			<textarea
				className={`${defaultClassName} ${className}`}
				value={value || formValue}
				onChange={onChange || onFormChange}
				{...props}
			/>
			{errorMessage && (
				<p className="text-[12px] text-red-500">{errorMessage}</p>
			)}
		</div>
	);
};

export default TextArea;
