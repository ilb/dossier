import lowerBound from "./lower-bound.js";

/**
 * Сравнивает два объекта на предмет их поверхностного равенства.
 * @param {Object} object1 Первый объект для сравнения.
 * @param {Object} object2 Второй объект для сравнения.
 * @returns {boolean} - Возвращает true, если объекты поверхностно равны, иначе false.
 */
function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  // const keys2 = Object.keys(object2); //forStas 'keys2' is assigned a value but never used  no-unused-vars

  // if (keys1.length !== keys2.length) {
  //   return false;
  // }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}

export default class PriorityQueueEx {
  /**
   * Создает экземпляр очереди с приоритетом.
   */
  constructor() {
    Object.defineProperty(this, "_queue", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: [],
    });
  }
  /**
   * Добавляет элемент в очередь.
   * @param {Function} run Функция, которая должна быть выполнена.
   * @param {Object} options Параметры элемента, включая приоритет.
   * @returns {void}
   */
  enqueue(run, options) {
    /* eslint-disable no-underscore-dangle -- Отключение правила no-underscore-dangle */
    let _a;
    /* eslint-enable no-underscore-dangle -- Отключение правила no-underscore-dangle */

    /* eslint-disable no-param-reassign -- Отключение правила no-param-reassign */
    options = {
      priority: 0,
      ...options,
    };
    const element = {
      run,
      ...options,
    };
    /* eslint-enable no-param-reassign -- Отключение правила no-param-reassign */

    // console.log({ element });
    if (
      this.size &&
      ((_a = this._queue[this.size - 1]) === null || _a === void 0 ? void 0 : _a.priority) >=
        options.priority
    ) {
      this._queue.push(element);
      return;
    }
    const index = lowerBound(this._queue, element, (a, b) => b.priority - a.priority);

    this._queue.splice(index, 0, element);
  }
  /**
   * Извлекает и удаляет первый элемент из очереди.
   * @returns {Function|undefined} - Возвращает функцию, если элемент существует, или undefined.
   */
  dequeue() {
    const item = this._queue.shift();

    return item === null || item === void 0 ? void 0 : item.run;
  }
  /**
   * Фильтрует элементы очереди по параметрам.
   * @param {Object} options Параметры для фильтрации элементов.
   * @returns {Array<Function>} - Возвращает массив функций, удовлетворяющих условиям фильтрации.
   */
  filter(options) {
    // console.log({ options });
    return this._queue
      .filter(element => shallowEqual(options, element))
      .map(element => element.run);
  }
  /**
   * Возвращает количество элементов в очереди.
   * @returns {number} - Количество элементов в очереди.
   */
  get size() {
    return this._queue.length;
  }
}
//
