/* eslint-disable camelcase -- Отключение правила camelcase */
/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
/* eslint-disable n/no-missing-import -- Отключение правила n/no-missing-import */
import classNames from "classnames";
import Image from "next/image";

import horizontal_icon from "../../icons/view_agenda_outline_icon_139089.svg";
import grid_icon from "../../icons/view_grid_icon_181217.svg";
/* eslint-enable no-unused-vars -- Отключение правила no-unused-vars */
/* eslint-enable n/no-missing-import -- Отключение правила n/no-missing-import */


/* eslint-disable no-shadow -- Отключение правила no-shadow */
/**
 * Панель переключения видов
 * @param {Object} props
 * @param {Function} props.onChangeView Функция для смены вида
 * @param {string} props.view Текущий вид
 * @returns {JSX.Element} Компонент панели переключения
 */
const Panel = ({ onChangeView, view }) => {
  /**
   * Обработчик клика по кнопке вида
   * @param {string} view Вид, который нужно установить
   * @returns {void}
   */
  const onClick = view => {
    onChangeView(view);
  };

  /* eslint-enable no-shadow -- Отключение правила no-shadow */
  return (
    <div className="classifier-panel">
      <span
        className={classNames("classifier-panel-btn", view === "grid" && "selected")}
        onClick={() => onClick("grid")}>
        <Image src={grid_icon.src} alt="Picture of the author" width={30} height={30} />
      </span>
      <span
        className={classNames("classifier-panel-btn", view === "list" && "selected")}
        onClick={() => onClick("list")}>
        <Image src={horizontal_icon.src} alt="Picture of the author" width={30} height={30} />
      </span>
    </div>
  );
};

/* eslint-enable camelcase -- Отключение правила camelcase */
export default Panel;
