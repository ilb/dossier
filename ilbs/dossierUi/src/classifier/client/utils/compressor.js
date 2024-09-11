// From https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob, needed for Safari:
// if (!HTMLCanvasElement.prototype.toBlob) {
//   Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
//     value: function (callback, type, quality) {
//       let binStr = atob(this.toDataURL(type, quality).split(',')[1]),
//         len = binStr.length,
//         arr = new Uint8Array(len);
//       for (let i = 0; i < len; i++) {
//         arr[i] = binStr.charCodeAt(i);
//       }
//
//       callback(new Blob([arr], { type: type || 'image/png' }));
//     }
//   });
// }
//
// window.URL = window.URL || window.webkitURL;

// Modified from https://stackoverflow.com/a/32490603, cc by-sa 3.0
// -2 = not jpeg, -1 = no data, 1..8 = orientations

/* eslint-disable no-param-reassign -- Отключение правила no-param-reassign */
/**
 * Получает ориентацию изображения EXIF.
 * @param {File} file Файл изображения.
 * @param {function(number): void} callback Функция, вызываемая с ориентацией изображения.
 * @returns {void}
 */
function getExifOrientation(file, callback) {
  // Suggestion from http://code.flickr.net/2012/06/01/parsing-exif-client-side-using-javascript-2/:
  if (file.slice) {
    file = file.slice(0, 131072);
  } else if (file.webkitSlice) {
    file = file.webkitSlice(0, 131072);
  }

  /* eslint-disable no-undef -- Отключение правила no-undef */
  const reader = new FileReader();


  /**
   * Обработчик события загрузки файла.
   * @param {ProgressEvent<FileReader>} e Событие загрузки файла.
   * @returns {void}
   */
  reader.onload = function(e) {
    const view = new DataView(e.target.result);

    if (view.getUint16(0, false) !== 0xffd8) {
      callback(-2);
      return;
    }
    const length = view.byteLength;
    let offset = 2;

    while (offset < length) {
      const marker = view.getUint16(offset, false);

      offset += 2;
      if (marker === 0xffe1) {
        if (view.getUint32((offset += 2), false) !== 0x45786966) {
          callback(-1);
          return;
        }
        const little = view.getUint16((offset += 6), false) === 0x4949;

        offset += view.getUint32(offset + 4, little);
        const tags = view.getUint16(offset, little);

        offset += 2;
        for (let i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) === 0x0112) {
            callback(view.getUint16(offset + i * 12 + 8, little));
            return;
          }
        }
      } else if ((marker & 0xff00) !== 0xff00) {
        break;
      } else {
        offset += view.getUint16(offset, false);
      }
    }
    callback(-1);
  };
  reader.readAsArrayBuffer(file);
}
/* eslint-enable no-param-reassign -- Отключение правила no-param-reassign */

/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
// Derived from https://stackoverflow.com/a/40867559, cc by-sa
/**
 * Преобразует изображение в canvas с учетом ориентации.
 * @param {HTMLImageElement} img Изображение.
 * @param {number} rawWidth Ширина изображения.
 * @param {number} rawHeight Высота изображения.
 * @param {number} [orientation] Ориентация изображения
 * @returns {HTMLCanvasElement} - Элемент canvas с изображением.
 */
function imgToCanvasWithOrientation(img, rawWidth, rawHeight, orientation) {
  const canvas = document.createElement("canvas");

  canvas.width = rawWidth;
  canvas.height = rawHeight;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(img, 0, 0, rawWidth, rawHeight);
  return canvas;
}
/* eslint-enable no-unused-vars -- Отключение правила no-unused-vars */

/**
 * Обрабатывает сжатие изображения.
 * @param {File} file Файл изображения.
 * @param {number} acceptFileSize Допустимый размер файла в КБ.
 * @param {number} maxWidth Максимальная ширина изображения.
 * @param {number} maxHeight Максимальная высота изображения.
 * @param {number} quality Качество изображения (от 0 до 1).
 * @param {function(BlobPart): void} callback Коллбэк для сжатого файла.
 * @returns {void}
 */
function processCompress(file, acceptFileSize, maxWidth, maxHeight, quality, callback) {
  if (file.size <= acceptFileSize * 1024) {
    callback(file);
    return;
  }
  const img = new Image();
  /* eslint-enable no-undef -- Отключение правила no-undef */

  /**
   * Обработчик ошибки загрузки изображения.
   * @returns {void}
   */
  img.onerror = function() {
    URL.revokeObjectURL(this.src);
    callback(file);
  };
  /**
   * Обработчик загрузки изображения.
   * @returns {void}
   */
  img.onload = function() {
    URL.revokeObjectURL(this.src);
    getExifOrientation(file, orientation => {
      let w = img.width,
        h = img.height;
      const scale =
        orientation > 4
          ? Math.min(maxHeight / w, maxWidth / h, 1)
          : Math.min(maxWidth / w, maxHeight / h, 1);

      h = Math.round(h * scale);
      w = Math.round(w * scale);

      const canvas = imgToCanvasWithOrientation(img, w, h, orientation);

      canvas.toBlob(
        blob => {
          callback(blob);
        },
        "image/jpeg",
        quality,
      );
    });
  };
  img.src = URL.createObjectURL(file);
}

/**
 * Сжимает изображение.
 * @param {File} file Файл изображения.
 * @param {number} acceptFileSize Допустимый размер файла в КБ.
 * @param {number} maxWidth Максимальная ширина изображения.
 * @param {number} maxHeight Максимальная высота изображения.
 * @param {number} quality Качество изображения (от 0 до 1).
 * @returns {Promise<BlobPart>} - Промис с результатом сжатия.
 */
export const compress = async (file, acceptFileSize, maxWidth, maxHeight, quality) => await new Promise(resolve =>
  processCompress(file, acceptFileSize, maxWidth, maxHeight, quality, resolve));
