/**
 * find tsconfig and only allow inside current pkg/ws path
 *
 * @param {string} cwd
 * @returns {string}
 */
export declare function findTsconfig(cwd: string): string;
export default findTsconfig;
