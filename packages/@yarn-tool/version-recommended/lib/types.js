"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseTypes = void 0;
/**
 * 所有可作為旗標使用的 ReleaseType；
 * 順序即為 handleOptions 掃描旗標的優先順序
 *
 * Every ReleaseType usable as a flag; the order is the priority
 * used by handleOptions when scanning flags
 */
exports.releaseTypes = [
    'major',
    'minor',
    'patch',
    'premajor',
    'preminor',
    'prepatch',
    'prerelease',
];
//# sourceMappingURL=types.js.map