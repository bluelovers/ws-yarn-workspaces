// TODO break these down into escaped strings with meaningful comments and create using new RegExp()
//               |optional 'v'
//               | | 3 segment version
//               | |                    |optional release prefixed by '-'
//               | |                    |                                        |optional build prefixed by '+'
import { stringifySimpleSemVer, stringifySemverFull } from './lib/stringifySimpleSemVer';
import { stringifySimpleSemVerRange } from './lib/stringifySimpleSemVerRange';
import { parseSimpleSemVerRange } from './lib/parseSimpleSemVerRange';
import { parseSimpleSemVer } from './lib/parseSimpleSemVer';

export * from './lib/checker';

export { parseSimpleSemVer as parse };
export { parseSimpleSemVerRange as parseRange };

export { stringifySimpleSemVer as stringify };
export { stringifySemverFull as stringifyFull };
export { stringifySimpleSemVerRange as stringifyRange };

export default stringifySimpleSemVerRange
