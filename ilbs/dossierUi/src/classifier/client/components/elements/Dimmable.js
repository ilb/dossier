/**
 * Компонент с затемняемым фоном
 * @param {Object} root0 Свойства компонента
 * @param {React.ReactNode} root0.children Дочерние элементы
 * @returns {JSX.Element} Компонент с затемняемым фоном
 */
const Dimmable = ({ children }) => <div className="dimmable">{children}</div>;

export default Dimmable;
