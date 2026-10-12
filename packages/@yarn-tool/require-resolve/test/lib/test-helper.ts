import { buildResolvePaths } from "../../lib/core";
import { _handleResolvePackageCoreOptions, _nodeRequireResolveLazyForPkgDir, resolvePackageCore } from "../../lib/package";
import { handleOptionsPaths } from "../../lib/util";
import { sync as pkgDir } from 'pkg-dir';
import upath2 from 'upath2';

/**
 * 複製內部邏輯用來除錯用
 *
 * @internal
 * @see resolvePackageCore
 */
export function _testHelperLazyDebugResolvePackage(...argv: Parameters<typeof resolvePackageCore>)
{
	let [moduleName, options] = argv;

	options = _handleResolvePackageCoreOptions(options);

	let cwd = options?.cwd ?? process.cwd();

	const paths = buildResolvePaths(options ?? {});
	/**
	 * 此處使用與 resolvePackageCore 相同的邏輯來處理 options?.cwd
	 * @see resolvePackageCore
	 */
	const processedPaths = handleOptionsPaths(paths, options?.cwd);

	let entryPointLocation: string;
	let pkgRoot: string;

	try
	{
		entryPointLocation = _nodeRequireResolveLazyForPkgDir(moduleName, processedPaths);

		pkgRoot = pkgDir(entryPointLocation);
	}
	catch (e)
	{

	}

	let resultFromResolvePackageCore: ReturnType<typeof resolvePackageCore>;

	try
	{
		resultFromResolvePackageCore = resolvePackageCore(moduleName, options);
	}
	catch (e) {

	}

	const report = {
		moduleName,
		options,
		cwd,
		paths,
		processedPaths,
		entryPointLocation,
		pkgRoot,
		resultFromResolvePackageCore,
	};

	// console.dir(report, { depth: null });

	return report;
}

export function _isPathForSnapshot(path: string)
{
	return typeof path === 'string' && /node_modules|fnm_multishells|node_modules|ws-yarn-workspaces/.test(path);
}

export function _normalizePathForSnapshot(path: string, name: string | undefined)
{
	path = upath2.normalize(path);

	if (name?.length)
	{
		path = path
			.replace(new RegExp(`^.+installation\\/node_modules\\/(?=${name})`, 'g'), '<global/node_modules>/')
			.replace(new RegExp(`^.+node_modules\\/(?=${name})`, 'g'), '<node_modules>/')
		;
	}

	path = path
		.replace(/^.+fnm_multishells\/[\w_]+/, '<fnm>')
		.replace(/^.+ws-yarn-workspaces\//, '<ws-yarn-workspaces>/')
	;

	return path;
}
