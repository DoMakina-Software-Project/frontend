import { Input, TextArea, SelectInput } from "../../ui";

const CarDetails = ({ formState, setFormState }) => {
	const fuelTypeOptions = [
		{ value: "PETROL", label: "Petrol" },
		{ value: "DIESEL", label: "Diesel" },
		{ value: "ELECTRIC", label: "Electric" },
		{ value: "HYBRID", label: "Hybrid" },
		{ value: "OTHER", label: "Other" },
	];

	const transmissionOptions = [
		{ value: "MANUAL", label: "Manual" },
		{ value: "AUTOMATIC", label: "Automatic" },
		{ value: "SEMI_AUTOMATIC", label: "Semi-Automatic" },
	];

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold text-gray-800">Car Details</h2>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<SelectInput
					name="fuelType"
					value={formState.fuelType.value}
					options={fuelTypeOptions}
					placeholder="Select fuel type"
					formState={formState}
					setFormState={setFormState}
					required
				/>
				<SelectInput
					name="transmission"
					value={formState.transmission.value}
					options={transmissionOptions}
					placeholder="Select transmission"
					formState={formState}
					setFormState={setFormState}
					required
				/>
				<Input
					type="number"
					placeholder="Mileage (km)"
					name="mileage"
					formState={formState}
					setFormState={setFormState}
					required
					min={0}
					max={1000000}
					wrapperClassName="max-w-none"
				/>
			</div>
			<div className="mt-6">
				<TextArea
					placeholder="Description"
					name="description"
					formState={formState}
					setFormState={setFormState}
					required
					minLength={10}
					maxLength={500}
					wrapperClassName="w-full h-[150px] resize-none"
				/>
			</div>
		</div>
	);
};

export default CarDetails;
