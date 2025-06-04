import { Button } from "../../ui";

const NavigationButtons = ({
	activeStep,
	totalSteps,
	onPrevious,
	onNext,
	loading,
}) => {
	return (
		<div className="mt-8 flex justify-between">
			{activeStep > 1 && (
				<Button
					type="button"
					onClick={onPrevious}
					className="bg-gray-500 hover:bg-gray-600"
				>
					Previous
				</Button>
			)}
			{activeStep < totalSteps ? (
				<Button type="button" onClick={onNext} className="ml-auto">
					Next
				</Button>
			) : (
				<Button type="submit" className="ml-auto" disabled={loading}>
					{loading ? "Creating..." : "Create Listing"}
				</Button>
			)}
		</div>
	);
};

export default NavigationButtons;
