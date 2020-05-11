import findWorkspaceRoot from 'find-yarn-workspace-root2/core';
import crossSpawn, { SpawnSyncOptions, SpawnOptions, SpawnSyncReturns, SpawnASyncReturnsPromise } from 'cross-spawn-extra';

export type INpmClient = string | 'npm' | 'yarn' | 'lerna';

export function spawnWsRootRun(argv: string[], opts?: {
	cwd?: string,
	npmClient?: INpmClient,
	spawnOptions?: SpawnOptions,
})
{
	let cwd = findWorkspaceRoot(opts?.cwd);

	return crossSpawn.async(opts?.npmClient || 'yarn', [
		'run',
		...argv,
	], {
		stdio: 'inherit',
		...opts?.spawnOptions,
		cwd,
	})
}

export function spawnWsRootExec(argv: string[], opts?: {
	cwd?: string,
	npmClient?: INpmClient,
	spawnOptions?: SpawnOptions,
})
{
	let cwd = findWorkspaceRoot(opts?.cwd);

	return crossSpawn.async(opts?.npmClient || 'yarn', [
		'exec',
		...argv,
	], {
		stdio: 'inherit',
		...opts?.spawnOptions,
		cwd,
	})
}

export function spawnWsRootRunSync(argv: string[], opts?: {
	cwd?: string,
	npmClient?: INpmClient,
	spawnOptions?: SpawnSyncOptions,
})
{
	let cwd = findWorkspaceRoot(opts?.cwd);

	return crossSpawn.sync(opts?.npmClient || 'yarn', [
		'run',
		...argv,
	], {
		stdio: 'inherit',
		...opts?.spawnOptions,
		cwd,
	})
}

export function spawnWsRootExecSync(argv: string[], opts?: {
	cwd?: string,
	npmClient?: INpmClient,
	spawnOptions?: SpawnSyncOptions,
})
{
	let cwd = findWorkspaceRoot(opts?.cwd);

	return crossSpawn.sync(opts?.npmClient || 'yarn', [
		'exec',
		...argv,
	], {
		stdio: 'inherit',
		...opts?.spawnOptions,
		cwd,
	})
}

export default spawnWsRootRun
