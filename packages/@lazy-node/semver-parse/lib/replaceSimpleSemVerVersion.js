"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceSimpleSemVerVersion = void 0;
const parseSimpleSemVer_1 = require("./parseSimpleSemVer");
const checker_1 = require("./checker");
function replaceSimpleSemVerVersion(oldSemVer, new_version) {
    if (typeof oldSemVer === 'string') {
        oldSemVer = (0, parseSimpleSemVer_1.parseSimpleSemVer)(oldSemVer);
    }
    (0, checker_1.assertSimpleSemVerObjectOrOperatorLike)(oldSemVer);
    const operator = oldSemVer.operator;
    const obj = (0, parseSimpleSemVer_1.parseSimpleSemVer)(new_version);
    // @ts-ignore
    obj.operator = operator;
    return obj;
}
exports.replaceSimpleSemVerVersion = replaceSimpleSemVerVersion;
//# sourceMappingURL=replaceSimpleSemVerVersion.js.map