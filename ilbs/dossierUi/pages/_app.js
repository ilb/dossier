import "../src/styles/style.css";

/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
/**
 * Главный компонент приложения
 * @param {Object} root0 Свойства компонента
 * @param {React.ComponentType} root0.Component Компонент страницы
 * @param {Object} root0.pageProps Свойства страницы
 * @returns {JSX.Element} Главный компонент приложения
 */
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */

export default MyApp;
