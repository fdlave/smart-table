import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";


import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    
    // Преобразуем строковые значения в числа
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState();
    let result = [...data];
    
    // Применяем поиск ПЕРЕД фильтрацией
    if (applySearching) {
        result = applySearching(result, state, action);
    }
    
    // Применяем фильтрацию
    if (applyFiltering) {
        result = applyFiltering(result, state, action);
    }
    
    // Применяем сортировку
    if (applySorting) {
        result = applySorting(result, state, action);
    }
    
    // Применяем пагинацию
    if (applyPagination) {
        result = applyPagination(result, state, action);
    }

    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'], 
    after: ['pagination']
}, render);

// Инициализируем поиск
const applySearching = initSearching('search');

// Инициализируем фильтрацию
const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

// Инициализируем сортировку
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Инициализируем пагинацию
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);


render();


console.log('Таблица инициализирована с данными:', data.length, 'записей');
console.log('Доступные индексы:', Object.keys(indexes));