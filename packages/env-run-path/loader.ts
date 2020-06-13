/**
 * Created by user on 2019/12/25.
 */

import { processRunPathEnv } from './index';

export const processEnv = processRunPathEnv({
	overwrite: true,
	appendExecPath: true,
});

export default processEnv;
