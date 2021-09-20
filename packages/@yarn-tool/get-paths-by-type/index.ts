import { npm, yarn } from 'global-dirs';

const SymbolCurrentDirectory = Symbol.for('cwd');
/**
 * SymbolGlobalYarn + SymbolGlobalNpm
 */
const SymbolGlobal = Symbol.for('global');
const SymbolGlobalNpm = Symbol.for('npm');
const SymbolGlobalYarn = Symbol.for('yarn');
const SymbolModuleMain = Symbol.for('module.main');

export {
	SymbolCurrentDirectory,
	SymbolGlobal,
	SymbolGlobalNpm,
	SymbolGlobalYarn,
	SymbolModuleMain,
}

export type IPathItem =
	typeof SymbolCurrentDirectory
	| typeof SymbolGlobal
	| typeof SymbolGlobalNpm
	| typeof SymbolGlobalYarn
	| typeof SymbolModuleMain;

export function getPathsByType(valueType: string | IPathItem, cwd?: string)
{
	const paths: string[] = [];

	switch (valueType)
	{
		case SymbolGlobal:
			paths.push(yarn.packages)
			paths.push(npm.packages)
			break;
		case SymbolCurrentDirectory:
			paths.push(cwd ?? process.cwd())
			break;
		case SymbolGlobalNpm:
			paths.push(npm.packages)
			break;
		case SymbolGlobalYarn:
			paths.push(yarn.packages)
			break;
		case SymbolModuleMain:
			if (typeof module !== 'undefined' && require.main !== module)
			{
				paths.push(require.main.path)
			}
			break;
		default:
			throw new TypeError(`Not supported type: ${valueType}`)
	}

	return paths
}

export default getPathsByType
