/* eslint-disable no-use-before-define -- Отключение правила no-use-before-define */
import Kernel from "../Kernel.js";
import JsonContext from "./contexts/JsonContext.js";
import JsonResponse from "./responses/JsonResponse.js";
// import nc from 'next-connect';

/**
 * Обрабатывает вызовы для usecase и возвращает ответ.
 * @param {Object} usecases Класс usecase, который будет вызван.
 * @param {string} method Метод, который будет выполнен.
 * @param {Object} [responseHandler=JsonResponse] Класс, обрабатывающий ответ (по умолчанию JsonResponse).
 * @returns {Function} - Функция для обработки запроса и ответа.
 */
export function handle(usecases, method, responseHandler = JsonResponse) {
  return async (req, res) => {
    try {
      const context = await JsonContext.build({ req, res });
      const scope = await createScope(context);

      const instance = new usecases(scope.cradle); // eslint-disable-line new-cap -- Отключение ошибки new-cap для создания экземпляра usecase
      const result = await instance[method](scope.cradle);

      return responseHandler.build(result, res);
    } catch (exception) {
      console.log(exception); // eslint-disable-line no-restricted-syntax -- Отключение правила для логирования в консоль
      return responseHandler.exception(exception, res);
    }
  };
}

// export function crudHandler(nameOrUsecases, usecases) {
//   usecases = usecases || nameOrUsecases;
//   const name = nameOrUsecases || usecases.constructor.name.substring(0, -8);

//   return (
//     nc()
//       // .get(`/${name}`, handle(DocumentsUsecases, 'list'))
//       .post(`/${name}`, handle(DocumentsUsecases, 'create'))
//       .get(`/${name}/:uuid`, handle(DocumentsUsecases, 'read'))
//       // .put(`/${name}/:uuid`, handle(DocumentsUsecases, 'update'))
//       .delete(`/${name}/:uuid`, handle(DocumentsUsecases, 'delete'))
//   );
// }

/**
 * Создает и возвращает scope для приложения на основе переданного контекста.
 * @param {Object} context Контекст, содержащий данные запроса и ответа.
 * @returns {Promise<Object>} - Возвращает созданное приложение с указанным контекстом.
 */
export async function createScope(context) {
  const kernel = new Kernel();

  return kernel.createApplication(context);
}
/* eslint-enable no-use-before-define -- Включение правила no-use-before-define */
