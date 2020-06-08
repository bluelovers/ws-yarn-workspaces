/**
 * Created by user on 2020/6/9.
 */

import { findRoot, pathEqual } from '@yarn-tool/find-root';
import { gitDiffStaged, gitDiffStagedDir } from '@git-lazy/diff-staged';
import gitRoot from 'git-root2';

export function wsRootWithGitRoot(cwd: string)
{
	let rooData = findRoot({
		cwd,
	});

	let ws_root = rooData.root;
	let git_root = gitRoot(cwd)

	if (!pathEqual(ws_root, git_root))
	{
		throw new Error(`ws_root not same as git_root\nws_root: ${ws_root}\ngit_root: ${git_root}`);
	}

	return ws_root
}

export function wsGitDiffStagedFiles(cwd: string, options?: {
	gitBin?: string,
})
{
	cwd = wsRootWithGitRoot(cwd)

	let list = gitDiffStaged(cwd, {
		bin: options?.gitBin,
	})

	return {
		cwd,
		list,
	}
}

export function wsGitDiffStagedDir(cwd: string, options?: {
	gitBin?: string,
})
{
	cwd = wsRootWithGitRoot(cwd)

	let list = gitDiffStagedDir(cwd, {
		bin: options?.gitBin,
	})

	return {
		cwd,
		list,
	}
}
