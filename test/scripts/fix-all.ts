import { npmAutoFixAll } from '@yarn-tool/fix-all';
import { __ROOT_WS } from '../../__root_ws';

let cwd = __ROOT_WS;

npmAutoFixAll(cwd, {
	overwriteHostedGitInfo: true,
});
