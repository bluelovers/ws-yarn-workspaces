"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npaToDepsValue = exports.npaResultToDepsValue = void 0;
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const parseSimpleSemVerRange_1 = require("@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange");
function npaResultToDepsValue(result, options) {
    var _a, _b, _c;
    let semver;
    let operator;
    let fetchQuery;
    switch (result.type) {
        case 'git':
            semver = result.saveSpec;
            break;
        case 'tag':
            if (((_a = result.fetchSpec) === null || _a === void 0 ? void 0 : _a.length) && (options === null || options === void 0 ? void 0 : options.preserveTag)) {
                semver = result.fetchSpec;
            }
            else {
                operator = '^';
                fetchQuery = true;
            }
            break;
        case 'range':
            if ((_b = result.fetchSpec) === null || _b === void 0 ? void 0 : _b.length) {
                let ls = (0, parseSimpleSemVerRange_1.parseSimpleSemVerRange)(result.fetchSpec);
                if (ls.length > 1) {
                    semver = result.fetchSpec;
                }
                else if (options === null || options === void 0 ? void 0 : options.preserveRange) {
                    semver = result.fetchSpec;
                }
                else if (ls.length === 1) {
                    let entry = ls[0];
                    if (!entry.operator) {
                        semver = result.fetchSpec;
                        fetchQuery = true;
                    }
                    else if (entry.operator !== '^') {
                        semver = result.fetchSpec;
                    }
                    else {
                        operator = '^';
                        fetchQuery = true;
                    }
                }
                else {
                    operator = '^';
                    fetchQuery = true;
                }
            }
            else {
                operator = '^';
                fetchQuery = true;
            }
            break;
        default:
            if ((_c = result.fetchSpec) === null || _c === void 0 ? void 0 : _c.length) {
                semver = result.fetchSpec;
            }
            break;
    }
    return {
        name: result.name,
        semver,
        operator,
        fetchQuery,
        result,
    };
}
exports.npaResultToDepsValue = npaResultToDepsValue;
function npaToDepsValue(arg, options) {
    let result = (0, npm_package_arg_util_1.npa)(arg, options === null || options === void 0 ? void 0 : options.where);
    return npaResultToDepsValue(result);
}
exports.npaToDepsValue = npaToDepsValue;
exports.default = npaToDepsValue;
//# sourceMappingURL=index.js.map