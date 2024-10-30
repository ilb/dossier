/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
/* eslint-disable n/no-missing-import -- Отключение правила n/no-missing-import */
import Image from "next/image";
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
/* eslint-enable n/no-missing-import -- Включение правила n/no-missing-import */

/**
 * Компонент для отображения элемента галереи
 * @param {Object} root0 Свойства компонента
 * @param {string} root0.src Путь к изображению
 * @returns {JSX.Element} Компонент сегмента галереи
 */
const SegmentItem = ({ src }) => (
  <div
    className="classifier-list-gallery-item"
    style={{
      position: "relative",
      overflow: "auto",
      cursor: "grab",
      lineHeight: 0,
    }}
  >
    {src && (
      <Image
        loader={() => src}
        alt="alt"
        src={src}
        width={1000}
        height={1000}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    )}
  </div>
);

SegmentItem.displayName = "SegmentItem";
export default SegmentItem;
