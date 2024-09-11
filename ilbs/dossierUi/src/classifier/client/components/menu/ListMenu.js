/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
import "react-select-search/style.css";

import SelectSearch from "react-select-search";

import Panel from "./Panel.js";
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */

/**
 * Компонент для отображения меню списка документов
 * @param {Object} root0
 * @param {boolean} root0.withViewTypes Включены ли типы представления
 * @param {string} root0.view Текущий вид
 * @param {Function} root0.onChangeView Функция для смены вида
 * @param {Array<Object>} root0.documents Массив документов
 * @param {string} root0.selected Выбранный документ
 * @param {Function} root0.onDocumentSelect Функция для выбора документа
 * @returns {JSX.Element} Компонент меню
 */
const ListMenu = ({ withViewTypes, view, onChangeView, documents, selected, onDocumentSelect }) => {
  const options = documents.map(document => ({ name: document.name, value: document.type }));

  return (
    <div className="classifier-menu-list">
      {withViewTypes && <Panel view={view} onChangeView={onChangeView} />}
      <SelectSearch
        options={options}
        value={selected}
        onChange={(value, option) => onDocumentSelect(option, { name: value })}
      />
    </div>
  );
};

export default ListMenu;
