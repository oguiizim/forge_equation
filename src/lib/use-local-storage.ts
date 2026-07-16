import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
	const [value, setValue] = useState<T>(() => {
		if (typeof window === "undefined") return initialValue;
		try {
			const stored = localStorage.getItem(key);
			return stored !== null ? (JSON.parse(stored) as T) : initialValue;
		} catch {
			return initialValue;
		}
	});

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue] as const;
}

export function usePersistedNumber(key: string, initialValue: number) {
	const [value, setValue] = useLocalStorage<number>(key, initialValue);

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const parsed = parseFloat(e.target.value);
			setValue(Number.isNaN(parsed) ? 0 : parsed);
		},
		[setValue],
	);

	return { value, onChange, displayValue: value || "", setValue } as const;
}
