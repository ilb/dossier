/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
import { useState } from "react";

import MenuTab from "./MenuTab.js";

/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */

/**
 * Компонент блока меню
 * @param {Object} root0
 * @param {string} root0.uuid UUID документа
 * @param {Object} root0.block Блок документов
 * @param {string} root0.selected Текущий выбранный документ
 * @param {Array<string>} root0.hiddenTabs Скрытые вкладки
 * @param {Function} root0.onDocumentSelect Функция для выбора документа
 * @param {string} root0.dossierUrl URL для запросов
 * @param {Object} root0.errors Ошибки, связанные с документами
 * @param {Object} root0.context Дополнительный контекст для запроса
 * @returns {JSX.Element} Компонент блока меню
 */
const MenuBlock = ({
  uuid,
  block,
  selected,
  hiddenTabs,
  onDocumentSelect,
  dossierUrl,
  errors = {},
  context,
}) => {
  const [isOpened, setOpen] = useState(block.open);
  const [isVersionOpened, setIsVersionOpened] = useState(false);

  const mainBlock = block.documents ? block.documents[0] : null;
  const versionBlock = block.documents ? block.documents.slice(1) : [];

  /**
   * Функция для построения вкладок меню
   * @returns {JSX.Element} Вкладки меню
   */
  const tabBuilder = () => (
    !(!isOpened && block.collapsed) && (
      <>
        {mainBlock.collapsed ? (
          <div>
            <MenuTab
              uuid={uuid}
              validationErrorMessage={errors[mainBlock.type]}
              disabled={hiddenTabs.includes(mainBlock.type)}
              key={mainBlock.type}
              id={mainBlock.type}
              document={mainBlock}
              selected={mainBlock.type === selected}
              onDocumentSelect={onDocumentSelect}
              dossierUrl={dossierUrl}
              collapsed={mainBlock.collapsed}
              isVersionOpened={isVersionOpened}
              setIsVersionOpened={setIsVersionOpened}
              context={context}
            />
            {versionBlock.map(doc => (
              <MenuTab
                uuid={uuid}
                validationErrorMessage={errors[doc.type]}
                disabled={hiddenTabs.includes(doc.type)}
                key={doc.type}
                id={doc.type}
                document={doc}
                selected={doc.type === selected}
                onDocumentSelect={onDocumentSelect}
                hidden={!isVersionOpened}
                dossierUrl={dossierUrl}
                context={context}
              />
            ))}
          </div>
        ) : (
          <>
            {block.documents.map(document => (
              <MenuTab
                uuid={uuid}
                validationErrorMessage={errors[document.type]}
                disabled={hiddenTabs.includes(document.type)}
                key={document.type}
                id={document.type}
                document={document}
                selected={document.type === selected}
                onDocumentSelect={onDocumentSelect}
                dossierUrl={dossierUrl}
                context={context}
              />
            ))}
          </>
        )}
      </>
    )
  );

  return (
    <>
      {!!block?.documents?.length && (
        <>
          {block.collapsed && (
            <div
              className="menuItem"
              onClick={() => setOpen(!isOpened)}
              style={{ cursor: "pointer" }}>
              {isOpened && <i className="iconChevronUp icon" />}
              {!isOpened && <i className="iconChevronDown icon" />}
              <span style={{ marginLeft: "5px" }}>{block.name}</span>
            </div>
          )}

          {tabBuilder()}
        </>
      )}
    </>
  );
};

export default MenuBlock;
