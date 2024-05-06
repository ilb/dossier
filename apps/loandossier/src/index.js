import Kernel from './Kernel.js';
import JsonResponse from './core/responses/JsonResponse.js';
import JsonContext from '@ilbru/core/src/contexts/JsonContext.js';
// import nc from 'next-connect';

export function handle(usecases, method, responseHandler = JsonResponse) {
  return async (req, res) => {
    try {
      const context = await JsonContext.build({ req, res });
      const scope = await createScope(context);
      const instance = new usecases(scope.cradle);
      const result = await instance[method](scope.cradle);
      return responseHandler.build(result, res);
    } catch (exception) {
      console.log(exception);
      return responseHandler.exception(exception, res);
    }
  };
}

export function middlewareHandle(usecases, method, middleware, responseHandler = JsonResponse) {
  return async (req, res, next) => {
    try {
      const context = await JsonContext.build({ req, res });
      const scope = await createScope(context);
      const instance = new usecases(scope.cradle);
      const result = await instance[method](scope.cradle);

      return middleware(req, res, next, result);
    } catch (exception) {
      console.log(exception);
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

export async function createScope(context) {
  const kernel = new Kernel();

  return kernel.createApplication(context);
}
