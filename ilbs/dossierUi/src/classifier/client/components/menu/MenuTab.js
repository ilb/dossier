/* eslint-disable n/no-missing-import -- Отключение правила n/no-missing-import */
/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
import { useDroppable } from "@dnd-kit/core";
import classNames from "classnames";

import { useDocuments } from "../../hooks";
import { Alert, CheckSuccess, Hourglass, Question } from "../../icons/CustomIcons";
import Popup from "../elements/Popup.js";
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
/* eslint-enable n/no-missing-import -- Включение правила n/no-missing-import */

const statuses = {
  LOADED: "Документ загружен",
  VALIDATION_ERROR: "Ошибка валидации",
  ON_AUTOMATIC_VERIFICATION: "Документ на автоматической проверке",
  VERIFICATIONS_ERROR: "Ошибки автоматической проверки",
  VERIFICATION_SUCCESS: "Все автоматические проверки прошли успешно",
  ACCEPTED: "Документ акцептован на сделку",
};

/**
 * Возвращает статус и иконку для отображения
 * @param {string} status Статус документа
 * @param {string} errors Ошибки, если они есть
 * @returns {{content: string, icon: JSX.Element}} Статус и иконка
 */
const getStatusToShow = (status = "", errors = "") => {
  const statusToShow = {};

  switch (status) {
    case "LOADED":
      statusToShow.content = statuses.LOADED;
      statusToShow.icon = <CheckSuccess />;
      break;
    case "VALIDATION_ERROR":
      statusToShow.content = `${statuses.VALIDATION_ERROR}: \n ${errors}`;
      statusToShow.icon = <Alert />;
      break;
    case "ON_AUTOMATIC_VERIFICATION":
      statusToShow.content = statuses.ON_AUTOMATIC_VERIFICATION;
      statusToShow.icon = <Hourglass />;
      break;
    case "VERIFICATIONS_ERROR":
      statusToShow.content = `${statuses.VERIFICATIONS_ERROR}: \n ${errors}`;
      statusToShow.icon = <Alert />;
      break;
    case "VERIFICATION_SUCCESS":
      statusToShow.content = statuses.VERIFICATION_SUCCESS;
      statusToShow.icon = <CheckSuccess />;
      break;
    case "ACCEPTED":
      statusToShow.content = statuses.ACCEPTED;
      statusToShow.icon = <CheckSuccess />;
      break;
    default:
      statusToShow.content = "";
      statusToShow.icon = null;
  }

  return statusToShow;
};

/* eslint-disable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
/**
 * Компонент вкладки документа в меню
 * @param {Object} root0
 * @param {string} root0.uuid UUID документа
 * @param {Object} root0.document Объект документа
 * @param {boolean} root0.selected Выбран ли документ
 * @param {boolean} root0.disabled Отключен ли документ
 * @param {Function} root0.onDocumentSelect Функция для выбора документа
 * @param {boolean} root0.error Присутствует ли ошибка
 * @param {boolean} root0.hidden Скрыт ли документ
 * @param {string} root0.validationErrorMessage Сообщение об ошибке валидации
 * @param {string} root0.dossierUrl URL для запроса
 * @param {boolean} root0.isVersionOpened Открыта ли версия документа
 * @param {Function} root0.setIsVersionOpened Функция для открытия версии
 * @param {boolean} root0.collapsed Свёрнут ли документ
 * @param {Object} root0.context Дополнительный контекст
 * @returns {JSX.Element} Компонент вкладки меню
 */
const MenuTab = ({
  uuid,
  document,
  selected,
  disabled,
  onDocumentSelect,
  error,
  hidden,
  validationErrorMessage,
  dossierUrl,
  isVersionOpened,
  setIsVersionOpened,
  collapsed,
  context,
}) => {
  let className = "";
  const isRequired = document.required;
  const { documents: docsData } = useDocuments(uuid, dossierUrl, context); // Избегаем конфликта с именем 'data'
  const tabDocuments = docsData[document.type]?.pages;
  const countPages = tabDocuments?.length;

  // if (countPages && !tabDocuments[0].type.includes('image/')) {
  //   isNotImage = true;
  // }

  const { setNodeRef, isOver } = useDroppable({
    id: document.type,
    data: { tab: true },
    disabled: document.readonly || disabled,
  });

  if (error) {
    className += " error";
  }
  if (document.readonly) {
    className += "readonly";
  }

  const errors = docsData[document.type]?.errors;
  const currentStatus = docsData[document.type]?.state;
  const statusToShow = getStatusToShow(currentStatus, errors);

  const documentNameWords = document?.name?.split(" ");
  const documentNameFirstWord = documentNameWords[0];
  const documentNameRestWords =
    documentNameWords?.length > 0 ? documentNameWords?.slice(1)?.join(" ") : "";

  return (
    <div id={document.type}>
      {!hidden && (
        <div key={document.type} ref={setNodeRef}>
          <div
            className={classNames(
              className,
              "menuItem",
              "menuItemTab",
              selected && "menuItemSelected",
              disabled && "menuItemDisabled",
              selected && isOver && "menuItemTargeted ",
            )}
            onClick={e => {
              if (!disabled) {
                onDocumentSelect(e, { name: document.type });
              }
            }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div className="icons" style={{ display: "flex", minWidth: "44px" }}>
                {validationErrorMessage ? (
                  <Popup content={validationErrorMessage} trigger={<Alert />} />
                ) : (
                  currentStatus && (
                    <Popup content={statusToShow.content} trigger={statusToShow.icon} />
                  )
                )}

                {document.tooltip && <Popup content={document.tooltip} trigger={<Question />} />}
              </div>

              {collapsed && (
                <div
                  onClick={() => setIsVersionOpened(!isVersionOpened)}
                  style={{ cursor: "pointer", marginRight: "10px" }}>
                  {isVersionOpened && <i className="iconChevronUp icon" />}
                  {!isVersionOpened && <i className="iconChevronDown icon" />}
                </div>
              )}

              <div style={{ width: "100%", marginLeft: "5px", textAlign: "left" }}>
                <span lang="ru" style={{ hyphens: "auto" }}>
                  <span style={{ textTransform: "capitalize" }}>{documentNameFirstWord}</span>{" "}
                  <span>{documentNameRestWords}</span>
                  {countPages ? `(${countPages})` : ""}
                </span>
              </div>
              {isRequired && (
                <div style={{ alignSelf: "flex-start" }}>
                  <span style={{ color: "red" }}>*</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* eslint-enable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
export default MenuTab;
