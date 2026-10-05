import { npmAutoFixAll } from '@yarn-tool/fix-all';
import { __ROOT_WS } from '../../__root_ws';

let cwd = __ROOT_WS;

export default npmAutoFixAll(cwd, {
	overwriteHostedGitInfo: true,
	/*
	 * 此呼叫點的 addStaticFiles 預設為 true / addStaticFiles defaults to true at this call site
	 * */
	addStaticFiles: true,
	//resetStaticFiles: true,
});
