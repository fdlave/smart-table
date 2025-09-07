import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // #5.1 — настроить компаратор для поиска
    const searchRules = [
        // Используем правило skipEmptyTargetValues правильно
        (key, sourceValue, targetValue, source, target) => {
            // Проверяем, есть ли непустые значения в target для поиска
            const hasSearchValue = Object.values(target).some(value => 
                value !== '' && value != null && value !== undefined
            );
            if (!hasSearchValue) return { skip: true };
            return { continue: true };
        },
        // Используем searchMultipleFields с правильными параметрами
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    ];

    // Создаем функцию сравнения
    const compare = (source, target) => {
        // Применяем правила сравнения
        for (const rule of searchRules) {
            for (const key in target) {
                const result = rule(key, source[key], target[key], source, target);
                if (result.skip) continue;
                if (result.result === false) return false;
                if (result.result === true) return true;
            }
        }
        return true;
    };

    return (data, state, action) => {
        // #5.2 — применить компаратор для фильтрации данных
        return data.filter(row => compare(row, state));
    }
}