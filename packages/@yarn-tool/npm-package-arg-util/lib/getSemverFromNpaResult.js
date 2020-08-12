"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSemverFromNpaResult = void 0;
function getSemverFromNpaResult(npaResult) {
    let semver;
    switch (npaResult.type) {
        case 'alias':
            semver = npaResult.subSpec.rawSpec;
            break;
        default:
            semver = npaResult.rawSpec;
            break;
    }
    return semver;
}
exports.getSemverFromNpaResult = getSemverFromNpaResult;
exports.default = getSemverFromNpaResult;
//# sourceMappingURL=getSemverFromNpaResult.js.map