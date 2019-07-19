/**
 * Created by user on 2019/7/19.
 */

import _isNpx = require("is-npx");

export function isNpx(data: {
	__dirname?: string,
}): boolean
{
	const { __dirname = '' } = data;

	return (_isNpx() || __dirname.includes('_npx'))
}

export default isNpx
