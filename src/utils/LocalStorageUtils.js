const LocalStorageUtils = {
	// Add or update a key-value pair
	setItem: (key, value) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			console.log(`Item with key "${key}" set successfully.`);
		} catch (error) {
			console.error(`Error setting item "${key}":`, error);
		}
	},

	// Get a value by key
	getItem: (key) => {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : null;
		} catch (error) {
			console.error(`Error getting item "${key}":`, error);
			return null;
		}
	},

	// Remove a key-value pair
	removeItem: (key) => {
		try {
			localStorage.removeItem(key);
			console.log(`Item with key "${key}" removed successfully.`);
		} catch (error) {
			console.error(`Error removing item "${key}":`, error);
		}
	},

	// Check if a key exists
	hasKey: (key) => {
		return localStorage.getItem(key) !== null;
	},

	// Update an existing key's value
	updateItem: (key, newValue) => {
		if (LocalStorageUtils.hasKey(key)) {
			LocalStorageUtils.setItem(key, newValue);
		} else {
			console.warn(`Key "${key}" does not exist. Use setItem to add it.`);
		}
	},

	// Clear all localStorage entries
	clearAll: () => {
		try {
			localStorage.clear();
			console.log("All localStorage items cleared.");
		} catch (error) {
			console.error("Error clearing localStorage:", error);
		}
	},
};

export default LocalStorageUtils;
