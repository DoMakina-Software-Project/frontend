const StepIndicator = ({ activeStep, totalSteps }) => {
	return (
		<div className="mb-8 flex w-full items-center justify-center space-x-4">
			{[...Array(totalSteps)].map((_, index) => (
				<div key={index} className="flex items-center">
					<div
						className={`flex h-8 w-8 items-center justify-center rounded-full ${
							index + 1 === activeStep
								? "bg-blue-500 text-white"
								: index + 1 < activeStep
									? "bg-green-500 text-white"
									: "bg-gray-200 text-gray-600"
						}`}
					>
						{index + 1}
					</div>
					{index < totalSteps - 1 && (
						<div
							className={`h-1 w-16 ${
								index + 1 < activeStep
									? "bg-green-500"
									: "bg-gray-200"
							}`}
						/>
					)}
				</div>
			))}
		</div>
	);
};

export default StepIndicator;
