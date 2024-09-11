/**
 * Разбиение одного массива на несколько по length элементов
 * @param {Array} arr Массив для разбиения.
 * @param {number} length Количество элементов в каждой группе.
 * @returns {Array[]} - Возвращает массив, состоящий из групп элементов.
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
 * Перебирает classifies и заменяет на other все классы, не содержащиеся в availableClasses
 * @param {Array} classifies Массив классификаций для обработки.
 * @param {Array} availableClasses Список доступных классов.
 * @returns {Array} - Возвращает обработанный массив классификаций.
 */
export const prepareClassifies = (classifies, availableClasses) => classifies.map(pageResult =>
  (availableClasses.includes(pageResult.code)
    ? pageResult
    : { ...pageResult, code: "otherDocuments" }));

/**
 * Выполняет promise с ограничением по времени.
 * @param {Promise<any>} promise Промис для выполнения. Может возвращать любой тип.
 * @param {Error} err Ошибка, которая выбрасывается при превышении времени.
 * @param {number} timeout Время ожидания в секундах.
 * @returns {Promise<any>} - Возвращает либо результат промиса, либо ошибку при тайм-ауте.
 */
export const timeoutPromise = async (promise, err, timeout) => new Promise((resolve, reject) => {
  promise.then(resolve, reject);
  setTimeout(reject.bind(null, err), timeout * 1000);
});
