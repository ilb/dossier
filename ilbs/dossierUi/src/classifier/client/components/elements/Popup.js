import { useRef, useState } from "react";

/**
 * Компонент всплывающей подсказки (tooltip)
 * @param {Object} root0 Свойства компонента
 * @param {React.ReactNode} root0.content Содержимое подсказки
 * @param {React.ReactNode} root0.trigger Триггер для отображения подсказки
 * @returns {JSX.Element} Компонент всплывающей подсказки
 */
const Popup = ({ content, trigger }) => {
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const tooltipRef = useRef(null);

  /**
   * Скрывает подсказку
   * @returns {void}
   */
  const handleHideTooltip = () => {
    setTooltipPosition(null);
  };

  /* eslint-disable no-undef -- Отключение правила no-undef */
  /**
   * Показывает подсказку
   * @param {MouseEvent} e Событие наведения мыши
   * @returns {void}
   */
  const handleShowTooltip = e => {
    const targetRect = e.target.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const documentHeight = window?.innerHeight || 0; // Использование window вместо document
    const documentWidth = window?.innerWidth || 0; // Использование window вместо document

    const top = Math.min(targetRect.top, documentHeight - tooltipRect.height);
    const left = Math.min(targetRect.x + 10, documentWidth - tooltipRect.width);

    setTooltipPosition({
      top,
      left,
    });
  };

  /* eslint-enable no-undef -- Отключение правила no-undef */
  return (
    <div className="target" onMouseEnter={handleShowTooltip} onMouseLeave={handleHideTooltip}>
      {trigger}
      <div
        className="tooltip"
        ref={tooltipRef}
        style={
          tooltipPosition
            ? {
              zIndex: 10000,
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              visibility: "visible",
            }
            : { visibility: "hidden" }
        }
      >
        {content}
      </div>
    </div>
  );
};

export default Popup;
