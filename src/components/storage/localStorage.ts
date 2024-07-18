interface LocalStorageData<T> {
	key: string;
	value: T;
}

export const saveToLocalStorage = <T>({
	key,
	value,
}: LocalStorageData<T>): void => {
	try {
		const serializedValue = JSON.stringify(value);
		localStorage.setItem(key, serializedValue);
	} catch (error) {
		console.error(`Ошибка сохранения в localStorage: ${error}`);
	}
};

export const loadFromLocalStorage = <T>(key: string): T | null => {
	try {
		const serializedValue = localStorage.getItem(key);
		if (serializedValue === null) {
			return null;
		}
		return JSON.parse(serializedValue);
	} catch (error) {
		console.error(`Ошибка загрузки из localStorage: ${error}`);
		return null;
	}
};
