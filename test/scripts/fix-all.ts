import { npmAutoFixAll } from '@yarn-tool/fix-all';
import { __ROOT_WS } from '../../__root_ws';

let cwd = __ROOT_WS;

export default npmAutoFixAll(cwd, {
	overwriteHostedGitInfo: true,
	//resetStaticFiles: true,
});
