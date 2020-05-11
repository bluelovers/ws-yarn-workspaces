/**
 * Created by user on 2020/5/11.
 */
import { spawnWsRootExecSync, spawnWsRootRunSync } from '../index';
import crossSpawn, { SpawnSyncReturns } from 'cross-spawn-extra';

let argv = process.argv.slice(2);
let cp: SpawnSyncReturns<Buffer>;

if (argv[0] === 'run')
{
	spawnWsRootRunSync(argv.slice(1))
}
else if (argv[0] === 'run')
{
	spawnWsRootExecSync(argv.slice(1))
}
else
{
	throw new Error(`failed spawn script, ${argv}`)
}

if (cp.status)
{
	process.exit(cp.status)
}
