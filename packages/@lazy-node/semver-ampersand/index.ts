import { simplifyRange } from './lib/simplifyRange';
import { handleAmpersandAndSpaces } from './lib/handleAmpersandAndSpaces';
import { satisfies } from './lib/satisfies';
import { maxSatisfying } from './lib/maxSatisfying';
import { minSatisfying } from './lib/minSatisfying';
import { validRange } from './lib/validRange';
import { Range } from './lib/Range';

export type { Options as IOptions } from 'semver';

export { reAmpersandAndSpaces } from './lib/const';

export {
	satisfies,

	maxSatisfying,
	minSatisfying,

	validRange,
	simplifyRange,

	handleAmpersandAndSpaces,

	Range,
}

export default {
	satisfies,

	maxSatisfying,
	minSatisfying,

	validRange,
	simplifyRange,

	handleAmpersandAndSpaces,

	Range,
}
