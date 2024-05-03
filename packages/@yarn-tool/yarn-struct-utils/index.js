"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResolutionOrDescriptor = parseResolutionOrDescriptor;
const core_1 = require("@yarnpkg/core");
const parseResolution_1 = require("@yarn-tool/yarnlock-parse-raw/lib/v2/parseResolution");
const parseRange_1 = require("./lib/parseRange");
const pkg_name_util_1 = require("@yarn-tool/pkg-name-util");
function parseResolutionOrDescriptor(rawInput) {
    var _a;
    try {
        let parsed = (0, parseResolution_1.parseResolution)(rawInput);
        return {
            fullName: parsed.descriptor.fullName,
            description: parsed.descriptor.description,
            isResolution: true,
            parsed,
            rawInput,
        };
    }
    catch (e) {
        let parsed = core_1.structUtils.tryParseDescriptor(rawInput, true);
        if (parsed) {
            let parsedRange = (0, parseRange_1.parseRange)(parsed.range);
            return {
                fullName: (0, pkg_name_util_1.formatPackageName)(parsed),
                description: (_a = parsedRange.params) === null || _a === void 0 ? void 0 : _a.version,
                isResolution: false,
                parsed,
                parsedRange,
                rawInput,
            };
        }
    }
    return null;
}
//# sourceMappingURL=index.js.map