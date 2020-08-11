import { simplifyRange } from './lib/simplifyRange';
import { handleVersionRange } from './lib/handleVersionRange';
import { satisfies } from './lib/satisfies';
import { maxSatisfying } from './lib/maxSatisfying';
import { minSatisfying } from './lib/minSatisfying';
import { validRange } from './lib/validRange';
import { Range } from './lib/Range';

export type { Options as IOptions } from 'semver';

export { reHandleVersionRange } from './lib/const';

export {
	satisfies,

	maxSatisfying,
	minSatisfying,

	validRange,
	simplifyRange,

	handleVersionRange,

	Range,
}

export default {
	satisfies,

	maxSatisfying,
	minSatisfying,

	validRange,
	simplifyRange,

	handleVersionRange,

	Range,
}
