"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yarnLockParsedToRawJSON = exports.yarnLockParsedV2ToRawJSON = exports.yarnLockParsedV1ToRawJSON = void 0;
const yarnlock_error_1 = require("@yarn-tool/yarnlock-error");
const yarnlock_parse_assert_1 = require("@yarn-tool/yarnlock-parse-assert");
function yarnLockParsedV1ToRawJSON(parsedObject) {
    return {
        ...parsedObject.meta,
        object: parsedObject.data,
    };
}
exports.yarnLockParsedV1ToRawJSON = yarnLockParsedV1ToRawJSON;
function yarnLockParsedV2ToRawJSON(parsedObject) {
    return {
        __metadata: parsedObject.meta,
        ...parsedObject.data,
    };
}
exports.yarnLockParsedV2ToRawJSON = yarnLockParsedV2ToRawJSON;
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
exports.yarnLockParsedToRawJSON = yarnLockParsedToRawJSON;
exports.default = yarnLockParsedToRawJSON;
//# sourceMappingURL=index.js.map