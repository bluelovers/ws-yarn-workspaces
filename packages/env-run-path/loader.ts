/**
 * Created by user on 2019/12/25.
 */

import { processRunPathEnv } from './index';

/**
 * 以 overwrite 寫回 process.env 並附加 execPath：
 * loader 是被 `node -r` 或 `import 'env-run-path/loader'` 直接載入的副作用入口，
 * 因此刻意直接修改共用的 process.env，讓後續行程皆能取得合併後的 PATH。
 *
 * Writes back to process.env with overwrite and appends execPath:
 * the loader is a side-effect entry loaded via `node -r` or `import 'env-run-path/loader'`,
 * so it deliberately mutates the shared process.env so later steps see the merged PATH.
 */
export const processEnv = processRunPathEnv({
	overwrite: true,
	appendExecPath: true,
});

export default processEnv;
