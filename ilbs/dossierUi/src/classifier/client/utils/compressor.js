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
function getExifOrientation(file, callback) {
  // Suggestion from http://code.flickr.net/2012/06/01/parsing-exif-client-side-using-javascript-2/:
  if (file.slice) {
    file = file.slice(0, 131072);
  } else if (file.webkitSlice) {
    file = file.webkitSlice(0, 131072);
  }

  let reader = new FileReader();
  reader.onload = function (e) {
    let view = new DataView(e.target.result);
    if (view.getUint16(0, false) !== 0xffd8) {
      callback(-2);
      return;
    }
    let length = view.byteLength,
      offset = 2;
    while (offset < length) {
      let marker = view.getUint16(offset, false);
      offset += 2;
      if (marker === 0xffe1) {
        if (view.getUint32((offset += 2), false) !== 0x45786966) {
          callback(-1);
          return;
        }
        let little = view.getUint16((offset += 6), false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        let tags = view.getUint16(offset, little);
        offset += 2;
        for (let i = 0; i < tags; i++)
          if (view.getUint16(offset + i * 12, little) === 0x0112) {
            callback(view.getUint16(offset + i * 12 + 8, little));
            return;
          }
      } else if ((marker & 0xff00) !== 0xff00) break;
      else offset += view.getUint16(offset, false);
    }
    callback(-1);
  };
  reader.readAsArrayBuffer(file);
}

// Derived from https://stackoverflow.com/a/40867559, cc by-sa
function imgToCanvasWithOrientation(img, rawWidth, rawHeight, orientation) {
  let canvas = document.createElement('canvas');
  canvas.width = rawWidth;
  canvas.height = rawHeight;

  let ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, rawWidth, rawHeight);
  return canvas;
}

function processCompress(file, acceptFileSize, maxWidth, maxHeight, quality, callback) {
  if (file.size <= acceptFileSize * 1024) {
    callback(file);
    return;
  }
  let img = new Image();
  img.onerror = function () {
    URL.revokeObjectURL(this.src);
    callback(file);
  };
  img.onload = function () {
    URL.revokeObjectURL(this.src);
    getExifOrientation(file, function (orientation) {
      let w = img.width,
        h = img.height;
      let scale =
        orientation > 4
          ? Math.min(maxHeight / w, maxWidth / h, 1)
          : Math.min(maxWidth / w, maxHeight / h, 1);
      h = Math.round(h * scale);
      w = Math.round(w * scale);

      let canvas = imgToCanvasWithOrientation(img, w, h, orientation);
      canvas.toBlob(
        function (blob) {
          callback(blob);
        },
        'image/jpeg',
        quality
      );
    });
  };
  img.src = URL.createObjectURL(file);
}

/**
 * @param file
 * @param acceptFileSize
 * @param maxWidth
 * @param maxHeight
 * @param quality
 * @returns {Promise<BlobPart>}
 */
export const compress = async (file, acceptFileSize, maxWidth, maxHeight, quality) => {
  return await new Promise((resolve) =>
    processCompress(file, acceptFileSize, maxWidth, maxHeight, quality, resolve)
  );
};

