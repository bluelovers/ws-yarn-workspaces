// TODO break these down into escaped strings with meaningful comments and create using new RegExp()
//               |optional 'v'
//               | | 3 segment version
//               | |                    |optional release prefixed by '-'
//               | |                    |                                        |optional build prefixed by '+'
import { stringifySemver, stringifySemverFull } from './lib/stringifySemver';
import { stringifySemverRange } from './lib/stringifySemverRange';
import { parseSemverRange } from './lib/parseSemverRange';
import { parseSemver } from './lib/parseSemver';

export { parseSemver as parse };
export { parseSemverRange as parseRange };

export { stringifySemver as stringify };
export { stringifySemverFull as stringifyFull };
export { stringifySemverRange as stringifyRange };

export default stringifySemverRange
