/**
 * Разбиение одного массива на несколько по length элементов.
 * @param {Array} arr Массив для разбиения.
 * @param {number} length Количество элементов в каждом новом массиве.
 * @returns {Array[]} - Массив, содержащий несколько массивов длиной length.
 */
export const chunkArray = (arr, length) => {
  const chunks = [];
  let i = 0;
  const n = arr.length;

  while (i < n) {
    chunks.push(arr.slice(i, (i += length)));
  }

  return chunks;
};

/**
 * Перебирает classifies и заменяет на other все классы, не содержащиеся в availableClasses.
 * @param {Array} classifies Массив классификаторов для замены.
 * @param {Array} availableClasses Массив доступных классов.
 * @returns {Array} - Обновленный массив классификаторов.
 */
export const prepareClassifies = (classifies, availableClasses) => classifies.map(pageResult => ({
  code: availableClasses.includes(pageResult) ? pageResult : "otherDocuments",
}));

/**
 * Таймаут для обещания.
 * @param {Promise<any>} promise Обещание, которое должно выполниться до таймаута.
 * @param {Error} err Ошибка, которая будет выброшена при истечении таймаута.
 * @param {number} timeout Время таймаута в секундах.
 * @returns {Promise<any>} - Обещание, которое либо выполнится до таймаута, либо выбросит ошибку.
 */
export const timeoutPromise = async (promise, err, timeout) => new Promise((resolve, reject) => {
  promise.then(resolve, reject);
  setTimeout(reject.bind(null, err), timeout * 1000);
});
