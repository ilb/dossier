let listenerRegistered = null;
let callback = null;
let id = null;

// forStas 11:14  error  'document' is not defined  no-undef
/* eslint-disable no-undef -- Отключение правила no-undef */
/**
 * Получает элементы изображения из события
 * @param {Event} event
 * @returns {HTMLCollection|null} - Возвращает коллекцию изображений или null
 */
const getElements = event => {
  if (typeof document === "undefined") {
    return null;
  }

  const frame = document.getElementById("popup_iframe");

  if (!(frame && event.target.outerHTML)) {
    return null;
  }

  return frame.contentDocument.getElementsByTagName("img");
};

/**
 * Находит и возвращает URL изображения
 * @param {HTMLCollection} elements Коллекция элементов изображения
 * @returns {string|null} - Возвращает URL изображения или null
 */
const getImage = elements => {
  for (const img of elements) {
    const src = img.getAttribute("src");

    if (src) {
      return src;
    }
  }
  return null;
};

/**
 * Преобразует URL изображения в файл
 * @param {string} src URL изображения
 * @returns {Promise<File>} - Возвращает промис с объектом файла
 */
const srcToFile = src => fetch(src)
  .then(res => res.arrayBuffer())
  .then(buf => new File([buf], "document.png", { type: "image/png" }));

/**
 * Очищает цепочку миниатюр.
 * @returns {void}
 */
const clearChain = () => {
  if (typeof document === "undefined") {
    return;
  }

  const frame = document.getElementById("popup_iframe");
  const foo = frame.contentDocument.getElementById("thumbnail_chain");

  while (foo.firstChild) {
    foo.removeChild(foo.firstChild);
  }
};

/* eslint-disable n/callback-return -- Отключение правила n/callback-return */
/**
 * Обработчик события DOMNodeInserted для получения файла.
 * @param {Event} event
 * @returns {void}
 */
const getFile = event => {
  const elements = getElements(event);
  const image = elements ? getImage(elements) : null;

  if (image) {
    srcToFile(image).then(file => {
      callback(file);
      clearChain();
    });
  }
};
/* eslint-enable n/callback-return -- Отключение правила n/callback-return */

/**
 * Регистрирует обработчик события для загрузки изображений с Twain.
 * @param {function(File): void} onUpload Коллбэк для обработки загруженного файла.
 * @param {string} fileId Идентификатор файла.
 * @returns {boolean} - Возвращает true, если обработчик был зарегистрирован, иначе false.
 */
export const registerTwain = (onUpload, fileId) => {
  if (typeof document === "undefined") {
    return false;
  }

  callback = onUpload;
  const frame = document.getElementById("popup_iframe");
  const chain = frame && frame.contentDocument.getElementById("thumbnail_chain");

  if (chain && (!listenerRegistered || id !== fileId)) {
    chain.removeEventListener("DOMNodeInserted", getFile);
    chain.addEventListener("DOMNodeInserted", getFile);
    listenerRegistered = true;
    id = fileId;
    return true;
  }

  return false;
};
/* eslint-enable no-undef -- Отключение правила no-undef */
