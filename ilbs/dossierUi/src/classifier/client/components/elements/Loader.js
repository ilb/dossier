import classNames from "classnames";

/**
 * Компонент загрузчика
 * @param {Object} root0 Свойства компонента
 * @param {React.ReactNode} root0.children Дочерние элементы
 * @param {string} root0.loaderText Текст загрузки
 * @param {boolean} root0.active Активен ли загрузчик
 * @returns {JSX.Element} Компонент загрузки
 */
const Loader = ({ children, loaderText, active }) => (
  <>
    <div className={classNames("dimmer", active && "dimmerActive")}>
      <div className="loader" />
      {loaderText && <span className="loaderText">{loaderText}</span>}
      {children}
    </div>
  </>
);

export default Loader;
