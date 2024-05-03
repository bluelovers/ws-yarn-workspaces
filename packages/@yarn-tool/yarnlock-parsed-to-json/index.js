"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnLockParsedV1ToRawJSON = yarnLockParsedV1ToRawJSON;
exports.yarnLockParsedV2ToRawJSON = yarnLockParsedV2ToRawJSON;
exports.yarnLockParsedToRawJSON = yarnLockParsedToRawJSON;
const yarnlock_error_1 = require("@yarn-tool/yarnlock-error");
const yarnlock_parse_assert_1 = require("@yarn-tool/yarnlock-parse-assert");
function yarnLockParsedV1ToRawJSON(parsedObject) {
    return {
        ...parsedObject.meta,
        object: parsedObject.data,
    };
}
function yarnLockParsedV2ToRawJSON(parsedObject) {
    return {
        __metadata: parsedObject.meta,
        ...parsedObject.data,
    };
}
function yarnLockParsedToRawJSON(parsedObject, options) {
    (0, yarnlock_parse_assert_1.assertYarnLockParsed)(parsedObject);
    if ((0, yarnlock_parse_assert_1.isYarnLockParsedV2)(parsedObject)) {
        return yarnLockParsedV2ToRawJSON(parsedObject);
    }
    else if ((0, yarnlock_parse_assert_1.isYarnLockParsedV1)(parsedObject)) {
        return yarnLockParsedV1ToRawJSON(parsedObject);
    }
    if (options === null || options === void 0 ? void 0 : options.throwError) {
        throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
    }
}
exports.default = yarnLockParsedToRawJSON;
//# sourceMappingURL=index.js.map