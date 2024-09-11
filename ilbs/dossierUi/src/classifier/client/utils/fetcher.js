/**
 * @param {...any} args
 * @returns {Promise<any>}
 */
export const fetcher = (...args) => fetch(...args).then(res => res.json());
