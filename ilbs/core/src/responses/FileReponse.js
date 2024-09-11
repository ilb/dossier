import Response from "./Response.js";

export default class FileResponse extends Response {
  /**
   * Создает ответ с файлом для скачивания.
   * @param {Object} res Ответ сервера.
   * @param {Buffer} res.file Файл, который нужно отправить.
   * @param {string} res.mimeType MIME-тип файла.
   * @param {string} res.filename Имя файла.
   * @returns {void} - Функция не возвращает значение.
   */
  static build({ file, mimeType, filename }, res) {
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Length", file.length);
    res.setHeader("Content-Type", mimeType);
    res.write(file, "binary");
    res.end();
  }

  /**
   * Обрабатывает исключение и возвращает JSON-ответ с ошибкой.
   * @param {Error} exception Исключение, которое нужно обработать.
   * @param {Object} res Ответ сервера (по умолчанию null).
   * @returns {void} - Функция не возвращает значение.
   */
  static exception(exception, res = null) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(exception.status || 500);
    res.end(JSON.stringify({ error: exception.message || "Упс... Что-то пошло не так" }));
  }
}
