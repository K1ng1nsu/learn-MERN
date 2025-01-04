export const isFalsy = (...values: any[]): boolean => {
    for (const value of values) {
        if (
            value === null ||
            value === undefined ||
            value === false ||
            (typeof value === 'string' && value.trim() === '') || // 문자열 트림 후 빈 문자열 확인
            Number.isNaN(value) ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && value !== null && Object.keys(value).length === 0)
        ) {
            return true; // Falsy 값을 발견하면 즉시 true 반환
        }
    }

    return false; // 모든 값이 Truthy일 경우 false 반환
};
