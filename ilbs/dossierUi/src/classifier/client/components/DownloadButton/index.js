/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
/* eslint-disable no-undef -- Отключение правила no-undef */
import React from "react";

/**
 * Компонент кнопки для скачивания файла
 * @param {Object} props Свойства компонента
 * @param {Object} props.src Объект с информацией о файле
 * @returns {JSX.Element} Кнопка скачивания файла
 */
function DownloadButton({ src }) {
  /**
   * Функция для загрузки файла
   * @returns {Promise<void>} Промис, представляющий завершение загрузки файла
   */
  const downloadFile = async () => {
    try {
      const response = await fetch(src.path);
      // Получаем содержимое файла в формате Blob
      const blob = await response.blob();

      // Из заголовка contentDisposition получаем имя файлы с расширением
      // const contentDisposition = response.headers.get('Content-Disposition');
      // const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      // const matches = filenameRegex.exec(contentDisposition);
      const fileName = src.originalName;
      // if (matches != null && matches[1]) {
      //   fileName = matches[1].replace(/['"]/g, '');
      // }

      // Создаем ссылку для скачивания файла
      const url = window.URL.createObjectURL(new Blob([blob]));
      // Создаем ссылку для скачивания и нажимаем на нее (выполняем клик)
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Ошибка загрузки файла:", error);
    }
  };

  return (
    <button
      style={{
        position: "absolute",
        top: "10px",
        right: "45px",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={downloadFile}>
      Скачать
    </button>
  );
}

export default DownloadButton;
/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
/* eslint-enable no-undef -- Включение правила no-undef */
