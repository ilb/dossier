/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
/* eslint-disable n/no-missing-import -- Отключение правила n/no-missing-import */
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
/* eslint-enable n/no-missing-import -- Включение правила n/no-missing-import */

/* eslint-disable no-undef -- Включение правила no-undef */
/**
 * Компонент элемента сегмента изображения
 * @param {Object} root0 Свойства компонента
 * @param {string} root0.src Путь к изображению
 * @param {Function} root0.onClick Функция клика на изображение
 * @param {number} root0.rotation Угол поворота изображения
 * @param {number} root0.scale Масштаб изображения
 * @returns {JSX.Element} Компонент сегмента изображения
 */
const SegmentItem = ({ src, onClick, rotation, scale }) => {
  const [[width, height], setWidthHeight] = useState([460, 600]);
  const contentRef = useRef(null);

  useEffect(() => {
    const imgContainer = contentRef.current;
    const containerStyles = window.getComputedStyle(imgContainer);
    const containerWidth = parseFloat(containerStyles.width);
    const containerHeight = parseFloat(containerStyles.height);

    setWidthHeight([containerWidth, containerHeight]);
  }, [width, height]);

  /* eslint-enable no-undef -- Включение правила no-undef */

  return (
    <ScrollContainer
      hideScrollbars={false}
      innerRef={contentRef}
      style={{
        height: "75vh",
        position: "relative",
        overflow: "auto",
        cursor: "grab",
        lineHeight: 0,
      }}
    >
      {src && (
        <Image
          loader={() => src}
          src={src}
          alt="alt"
          width={rotation === 0 || rotation === 180 ? width * scale : height * scale}
          height={rotation === 90 || rotation === 270 ? width * scale : height * scale}
          layout="fixed"
          quality={70}
          onClick={onClick}
          objectFit="contain"
          style={{
            overflow: "visible",
            transform: `rotate(${rotation}deg)`,
            userSelect: "none",
            MozUserSelect: "none",
            WebkitUserSelect: "none",
            WebkitUserDrag: "none",
          }}
        />
      )}
    </ScrollContainer>
  );
};

SegmentItem.displayName = "SegmentItem";
export default SegmentItem;
