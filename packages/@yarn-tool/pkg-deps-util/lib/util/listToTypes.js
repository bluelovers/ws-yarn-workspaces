"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listToTypes = void 0;
const index_1 = require("array-hyper-unique/index");
const packageNameToTypes_1 = require("@yarn-tool/npm-package-arg-util/lib/packageNameToTypes");
const generatePackageArg_1 = require("@yarn-tool/npm-package-arg-util/lib/generatePackageArg");
function listToTypes(input, includeVersion) {
    return (0, index_1.array_unique_overwrite)(input.reduce(function (a, b) {
        let result = (0, packageNameToTypes_1.packageNameToTypes)(b);
        a.push((0, generatePackageArg_1.generatePackageArg)(result, includeVersion));
        return a;
    }, []));
}
exports.listToTypes = listToTypes;
//# sourceMappingURL=listToTypes.js.map