export const clearErrors = (setFormState = () => {}) => {
	setFormState((prev) => {
		const newState = { ...prev };
		Object.keys(newState).forEach((key) => {
			newState[key].error = "";
		});

		return newState;
	});
};
