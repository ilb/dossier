// Port of lower_bound from https://en.cppreference.com/w/cpp/algorithm/lower_bound
// Used to compute insertion index to keep queue sorted after insertion
/**
 * Возвращает индекс для вставки значения в отсортированный массив.
 * @param {Array} array Массив, в который выполняется вставка.
 * @param {any} value Значение, которое нужно вставить.
 * @param {Function} comparator Функция-компаратор для сравнения элементов.
 * @returns {number} Индекс для вставки значения.
 */
export default function lowerBound(array, value, comparator) {
  let first = 0;
  let count = array.length;

  while (count > 0) {
    const step = Math.trunc(count / 2);
    let it = first + step;

    if (comparator(array[it], value) <= 0) {
      first = ++it;
      count -= step + 1;
    } else {
      count = step;
    }
  }
  return first;
}
//
