import { useState } from "react";
import { EyeIcon, ClosedEyeIcon } from "../icons";

const DEFAULT_CLASS_NAME =
	"w-full px-3 py-2 text-[13px] rounded bg-theme-input text-theme-text placeholder-theme-light-gray";

const typesThatUseDefaultClassName = [
	"text",
	"email",
	"password",
	"date",
	"number",
];

const getDefaultClassName = (type) => {
	if (typesThatUseDefaultClassName.includes(type)) {
		return DEFAULT_CLASS_NAME;
	}

	return "";
};

const Input = ({
	className,
	wrapperClassName = "",
	extendClassName = false,
	passwordIcon = false,
	type = "text",
	name = "",
	formState,
	setFormState = () => {},
	value,
	onChange,
	...props
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const toggleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const formValue = formState?.[name]?.value;
	const errorMessage = formState?.[name]?.error;

	const defaultClassName = `${getDefaultClassName(type)} ${passwordIcon ? "pr-10" : ""} ${errorMessage ? "border border-red-500" : ""}`;

	const onFormChange = (e) => {
		const { name, value } = e.target;

		if (type === "checkbox") {
			setFormState((prev) => ({
				...prev,
				[name]: {
					value: !prev[name].value,
					error: "",
				},
			}));
			return;
		}

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
			<div className="relative flex w-full items-center">
				<input
					{...props}
					value={value || formValue}
					{...(type === "checkbox" && { checked: formValue })}
					name={name}
					className={
						extendClassName
							? `${defaultClassName} ${className}`
							: defaultClassName
					}
					type={showPassword ? "text" : type}
					onChange={onChange || onFormChange}
				/>
				{passwordIcon && (
					<button
						className="absolute right-3"
						onClick={toggleShowPassword}
						type="button"
					>
						{showPassword ? <ClosedEyeIcon /> : <EyeIcon />}
					</button>
				)}
			</div>
			{errorMessage && (
				<p className="ml-1 text-[12px] text-red-500">{errorMessage}</p>
			)}
		</div>
	);
};

export default Input;
