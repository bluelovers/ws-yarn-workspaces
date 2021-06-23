"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUpDepsAllDeep = exports.findUpDepsAllDeepRecordCore = exports.findUpDepsDeepRecordCore = void 0;
const types_1 = require("@ts-type/package-dts/lib/package-json/types");
const core_1 = require("array-hyper-unique/core");
const find_1 = require("./find");
function findUpDepsDeepRecordCore(target, record, map = {}) {
    var _a, _b;
    if (!record[target] || ((_a = map[target]) === null || _a === void 0 ? void 0 : _a.length)) {
        return map;
    }
    map[target] = (_b = map[target]) !== null && _b !== void 0 ? _b : [];
    Object.values(record)
        .reduce((map, row) => {
        let bool = types_1.packageJsonDependenciesFields
            .some(field => {
            var _a, _b;
            return (_b = (_a = row === null || row === void 0 ? void 0 : row[field]) === null || _a === void 0 ? void 0 : _a[target]) === null || _b === void 0 ? void 0 : _b.length;
        });
        if (bool) {
            map[target].push(row.name);
            findUpDepsDeepRecordCore(row.name, record, map);
            map[target].push(...map[row.name]);
        }
        return map;
    }, map);
    (0, core_1.array_unique_overwrite)(map[target]);
    return map;
}
exports.findUpDepsDeepRecordCore = findUpDepsDeepRecordCore;
function findUpDepsAllDeepRecordCore(targets, record, map = {}) {
    return targets
        .reduce((map, target) => {
        findUpDepsDeepRecordCore(target, record, map);
        return map;
    }, map);
}
exports.findUpDepsAllDeepRecordCore = findUpDepsAllDeepRecordCore;
function findUpDepsAllDeep(targets, record) {
    let map = findUpDepsAllDeepRecordCore(targets, record);
    let map2 = (0, find_1.findDepsAllDeepRecordCore)(Object.keys(map), record);
    let list = Object.entries(map);
    list.sort((a, b) => {
        return b[1].length - a[1].length;
    });
    list.forEach(a => {
        a[1].sort((a, b) => {
            return (map2[a].length - map2[b].length) || (map[b].length - map[a].length);
        });
    });
    return list;
}
exports.findUpDepsAllDeep = findUpDepsAllDeep;
exports.default = findUpDepsAllDeep;
//# sourceMappingURL=find-up.js.map