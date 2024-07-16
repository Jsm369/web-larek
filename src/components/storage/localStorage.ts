interface LocalStorageData<T> {
	key: string;
	value: T;
}

// Функция для сохранения данных в localStorage
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

// Функция для загрузки данных из localStorage
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
