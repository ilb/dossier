/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
import classNames from "classnames";
import { useEffect, useState } from "react";

import MenuBlock from "./MenuBlock.js";
import Panel from "./Panel.js";
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */

/**
 * Компонент меню для отображения документов
 * @param {Object} root0
 * @param {string} root0.uuid UUID документа
 * @param {Object} root0.classifier Классификатор документов
 * @param {Array<Object>} root0.documents Массив документов
 * @param {Array<Object>} root0.blocks Массив блоков документов
 * @param {string} root0.selected Выбранный документ
 * @param {Function} root0.onDocumentSelect Функция для выбора документа
 * @param {Array<string>} root0.hiddenTabs Скрытые вкладки
 * @param {boolean} root0.withViewTypes Включены ли типы представления
 * @param {string} root0.view Текущий вид
 * @param {Function} root0.onChangeView Функция для смены вида
 * @param {string} root0.dossierUrl URL для запросов
 * @param {Object} root0.errors Объект с ошибками документов
 * @param {Object} root0.context Дополнительный контекст для запросов
 * @returns {JSX.Element} Компонент меню
 */
const Menu = ({
  uuid,
  classifier,
  documents,
  blocks,
  selected,
  onDocumentSelect,
  hiddenTabs,
  withViewTypes,
  view,
  onChangeView,
  dossierUrl,
  errors,
  context,
}) => {
  const [docBlocks, setDocBlocks] = useState([]);

  useEffect(() => {
    setDocBlocks(
      blocks.map(block => {
        const blockDocs = documents.filter(document => document.block === block.type);

        return {
          documents: blockDocs,
          collapsed: block.collapsed,
          name: block.name,
          type: block.type,
          open: block.open,
        };
      }),
    );
  }, [blocks]);

  return (
    <>
      {!!documents.length && (
        <div className="menu">
          {withViewTypes && <Panel view={view} onChangeView={onChangeView} />}
          {!classifier.disabled && (
            <>
              <div
                className={classNames(
                  "classifier-tab",
                  "menuItem",
                  "menuItemTab",
                  classifier.readonly && "menuItemDisabled",
                  selected === "classifier" && !classifier.readonly && "menuAutomatBtnSelected",
                )}
                onClick={e => {
                  onDocumentSelect(e, { name: "classifier" });
                }}>
                <div>
                  <span style={{ padding: 10 }}>Автомат</span>
                  {/* <Checkbox*/}
                  {/*  style={{ top: 5 }}*/}
                  {/*  className="native-checkbox"*/}
                  {/*  checked={selected === 'classifier'}*/}
                  {/*  toggle*/}
                  {/* />*/}
                </div>
              </div>

              <div className="divider" />
            </>
          )}
          {docBlocks.map(block => (
            <MenuBlock
              uuid={uuid}
              errors={errors}
              key={block.type}
              hiddenTabs={hiddenTabs}
              selected={selected}
              onDocumentSelect={onDocumentSelect}
              block={block}
              dossierUrl={dossierUrl}
              context={context}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Menu;
