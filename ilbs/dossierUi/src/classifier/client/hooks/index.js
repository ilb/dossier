import useSWR, { useSWRConfig } from "swr";

/* eslint-disable n/no-missing-import -- Отключение правила n/no-missing-import */
import { fetcher } from "../utils/fetcher";
/* eslint-enable n/no-missing-import -- Отключение правила n/no-missing-import */

/**
 * Классификация документа
 * @param {string} uuid UUID документа
 * @param {File[]} files Массив файлов
 * @param {string[]} availableClasses Доступные классы для классификации
 * @param {string} dossierUrl URL для запросов
 * @param {string} buildQuery Строка запроса
 * @returns {Promise<{ok: boolean}>} - Результат классификации
 */
export const classifyDocument = async (uuid, files, availableClasses, dossierUrl, buildQuery) => {
  const formData = new FormData();

  files.forEach(f => {
    formData.append("documents", f);
  });

  availableClasses.map(availableClass => formData.append("availableClasses", availableClass));

  const result = await fetch(`${dossierUrl}/api/classifier/${uuid}${buildQuery}`, {
    method: "PUT",
    headers: {
      accept: "*/*",
    },
    body: formData,
  });

  if (result.ok) {
    return { ok: true };
  }
  return { ok: false };
};

/**
 * Загрузка страниц документа
 * @param {string} uuid UUID документа
 * @param {string} document Имя документа
 * @param {File[]} files Массив файлов
 * @param {string} dossierUrl URL для запросов
 * @param {string} buildQuery Строка запроса
 * @returns {Promise<{ok: boolean}>} - Результат загрузки
 */
export const uploadPages = async (uuid, document, files, dossierUrl, buildQuery) => {
  const formData = new FormData();

  files.forEach(f => {
    formData.append("documents", f);
  });

  const result = await fetch(
    `${dossierUrl}/api/dossier/${uuid}/documents/${document}${buildQuery}`,
    {
      method: "PUT",
      headers: {
        accept: "*/*",
      },
      body: formData,
    },
  );

  if (result.ok) {
    return { ok: true };
  }
  return { ok: false, ...(await result.json()) };
};

/**
 * Удаление страницы
 * @param {string} dossierUrl URL для запросов
 * @param {Object} pageSrc Источник страницы
 * @param {string} pageSrc.path Путь страницы
 * @param {string} pageSrc.uuid UUID страницы
 * @param {string} buildQuery Строка запроса
 * @returns {Promise<{ok: boolean}>} - Результат удаления
 */
export const deletePage = async (dossierUrl, pageSrc, buildQuery) => {
  const url = `${dossierUrl}` +
    `${pageSrc.path.slice(0, pageSrc.path.indexOf("?"))}${buildQuery}` +
    `${buildQuery ? `&pageUuid=${pageSrc.uuid}` : `?pageUuid=${pageSrc.uuid}`}`;

  const result = await fetch(url, {
    method: "DELETE",
  });

  if (result.ok) {
    return { ok: true };
  }
  return { ok: false };
};

/**
 * Коррекция документов
 * @param {string} uuid UUID документа
 * @param {Object[]} documents Массив документов
 * @param {string} dossierUrl URL для запросов
 * @param {string} buildQuery Строка запроса
 * @returns {Promise<{ok: boolean}>} - Результат коррекции
 */
export const correctDocuments = async (uuid, documents, dossierUrl, buildQuery) => {
  const res = await fetch(`${dossierUrl}/api/dossier/${uuid}/documents/correction${buildQuery}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    body: JSON.stringify({ documents }),
  });

  if (res.ok) {
    return { ok: true };
  }
  const error = new Error("An error occured while correcting the documents");

  error.info = res.text();
  error.status = res.status;
  throw error;
};

/**
 * Получение схемы
 * @param {string} project Имя проекта
 * @param {string} dossierUrl URL для запросов
 * @returns {Promise<Object>} - Схема
 */
export const getSchema = async (project, dossierUrl) => {
  const res = fetch(`${dossierUrl}/api/schema/${project}`, {
    method: "GET",
  });

  if (res.ok) {
    return await res.json();
  }
  throw Error("Не удалось получить схему");
};

/* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
/**
 * Хук для получения страниц
 * @param {string} uuid UUID документа
 * @param {string} documentName Имя документа
 * @param {string} dossierUrl URL для запросов
 * @returns {Object} - Страницы и функции для обновления
 */
export const usePages = (uuid, documentName, dossierUrl) => {
  const { mutate: mutateGlobal } = useSWRConfig();
  const { data: pages, mutate } = useSWR(
    documentName ? `${dossierUrl}/api/dossier/${uuid}/documents/${documentName}` : null,
    fetcher,
    {
      fallbackData: [],
    },
  );

  return {
    pages,
    mutatePages: mutate,
    /**
     * Переобновление документов
     * @returns {Promise<void>}
     */
    revalidatePages: () =>
      mutateGlobal(
        documentName ? `${dossierUrl}/api/dossier/${uuid}/documents/${documentName}` : null,
      ),
  };
};
/* eslint-disable no-shadow -- Отключение правила no-shadow */
/**
 * Хук для получения документов
 * @param {string} uuid UUID документа
 * @param {string} dossierUrl URL для запросов
 * @param {Object} context Дополнительные параметры
 * @returns {Object} - Документы и функции для обновления
 */
export const useDocuments = (uuid, dossierUrl, context) => {
  const buildQuery = context
    ? `?${Object.entries(context)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")}`
    : "";
  const { mutate: mutateGlobal } = useSWRConfig();
  const { data, mutate } = useSWR(
    `${dossierUrl}/api/dossier/${uuid}/documents${buildQuery}`,
    fetcher,
    {
      fallbackData: {},
    },
  );

  return {
    tasksCount: data?.tasksCount || 0,
    documents: data?.documents || {},
    mutateDocuments: mutate,
    /**
     * Коррекция документов
     * @param {Object[]} documents Массив документов
     * @returns {Promise<{ok: boolean}>}
     */
    correctDocuments: documents => correctDocuments(uuid, documents, dossierUrl, buildQuery),
    /**
     * Переобновление документов
     * @returns {Promise<void>}
     */
    revalidateDocuments: () =>
      mutateGlobal(`${dossierUrl}/api/dossier/${uuid}/documents${buildQuery}`),
    /**
     * Классификация документа
     * @param {string} uuid UUID документа
     * @param {File[]} files Массив файлов
     * @param {string[]} availableClasses Доступные классы
     * @returns {Promise<{ok: boolean}>}
     */
    classifyDocument: (uuid, files, availableClasses) =>
      classifyDocument(uuid, files, availableClasses, dossierUrl, buildQuery),
    /**
     * Загрузка страниц
     * @param {string} uuid UUID документа
     * @param {string} document Имя документа
     * @param {File[]} files Массив файлов
     * @returns {Promise<{ok: boolean}>} - Результат загрузки страниц
     */
    uploadPages: (uuid, document, files) =>
      uploadPages(uuid, document, files, dossierUrl, buildQuery),
    /**
     * Удаление страницы
     * @param {Object} pageSrc Источник страницы
     * @returns {Promise<{ok: boolean}>}
     */
    deletePage: pageSrc => deletePage(dossierUrl, pageSrc, buildQuery),
  };
};
/* eslint-enable no-shadow -- Отключение правила no-shadow */
/**
 * Хук для получения задач
 * @param {string} uuid UUID документа
 * @param {string} dossierUrl URL для запросов
 * @returns {Object} - Задачи
 */
export const useTasks = (uuid, dossierUrl) => {
  const { data: tasks } = useSWR(`${dossierUrl}/api/classifier/${uuid}`, fetcher, {
    fallbackData: [],
    refreshInterval: 5000,
  });

  return { tasks };
};
/* eslint-enable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
