import {
	IWriteOptions,
	writeJSONSync,
	outputJSONSync,
	writeJSON,
	outputJSON,
} from '@bluelovers/fs-json';

export function _handleOptions<T extends IWriteOptions>(options: T): T
{
	// @ts-ignore
	let { spaces = 2 } = options;

	return {
		// @ts-ignore
		...options,
		spaces,
	}
}

export function writePackageJSONSync(file: string, data: unknown, options: IWriteOptions = {})
{
	return writeJSONSync(file, data, _handleOptions(options));
}

export function outputPackageJSONSync(file: string, data: unknown, options: IWriteOptions = {})
{
	return outputJSONSync(file, data, _handleOptions(options));
}

export function writePackageJSON(file: string, data: unknown, options: IWriteOptions = {})
{
	return writeJSON(file, data, _handleOptions(options));
}

export function outputPackageJSON(file: string, data: unknown, options: IWriteOptions = {})
{
	return outputJSON(file, data, _handleOptions(options));
}

export default writePackageJSONSync
