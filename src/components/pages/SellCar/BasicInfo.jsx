import { Input, SelectInput } from "../../ui";

const BasicInfo = ({ formState, setFormState, brands }) => {
	const brandOptions = brands.map((brand) => ({
		value: brand.id,
		label: brand.name,
	}));

	return (
		<div className="space-y-6">
			<h2 className="text-xl font-semibold text-gray-800">
				Basic Information
			</h2>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
				<SelectInput
					name="brand"
					value={formState.brand.value}
					options={brandOptions}
					placeholder="Select Brand"
					formState={formState}
					setFormState={setFormState}
					required
				/>
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
			</div>
		</div>
	);
};

export default BasicInfo;
