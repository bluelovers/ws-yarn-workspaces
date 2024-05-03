"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDepsAllDeepRecordCore = findDepsAllDeepRecordCore;
exports.findDepsAllDeep = findDepsAllDeep;
exports.findDepsDeep = findDepsDeep;
const types_1 = require("@ts-type/package-dts/lib/package-json/types");
function findDepsAllDeepRecordCore(names, record, map = {}) {
    return names
        .reduce((map, name) => {
        var _a;
        if (map[name]) {
            return map;
        }
        let list = findDepsDeep(name, record);
        map[name] = (_a = map[name]) !== null && _a !== void 0 ? _a : [];
        if (list === null || list === void 0 ? void 0 : list.length) {
            findDepsAllDeepRecordCore(list, record, map);
        }
        map[name].push(...list);
        return map;
    }, map);
}
function findDepsAllDeep(names, record) {
    let map = findDepsAllDeepRecordCore(names, record);
    let list = Object.entries(map);
    list.sort((a, b) => {
        return (a[1].length - b[1].length);
    });
    list.forEach(a => {
        a[1].sort((a, b) => {
            return (map[a].length - map[b].length);
        });
    });
    return list;
}
function findDepsDeep(name, record, list = []) {
    if (name in record) {
        let row = record[name];
        types_1.packageJsonDependenciesFields
            .forEach(field => {
            var _a;
            Object.keys((_a = row[field]) !== null && _a !== void 0 ? _a : {})
                .forEach(name2 => {
                if ((name2 in record) && !list.includes(name2) && name2 !== name) {
                    list.push(name2);
                    findDepsDeep(name2, record, list);
                }
            });
        });
    }
    return list;
}
exports.default = findDepsAllDeep;
//# sourceMappingURL=find.js.map