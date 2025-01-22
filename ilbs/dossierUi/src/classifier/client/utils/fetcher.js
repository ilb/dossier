import Resource from "@ilb/core/src/resources/Resource.js";

/**
 * @param {string} url
 * @returns {Promise<any>}
 */
export const fetcher = url => Resource.processRequest("get", url).then(res => res);
