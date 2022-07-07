"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixWsVersions = exports.fixWsVersionsCore = exports.fixPkgDepsVersionsCore = void 0;
const deps_tree_1 = require("ws-pkg-list/lib/deps-tree");
const types_1 = require("@ts-type/package-dts/lib/package-json/types");
const util_1 = require("ws-pkg-list/lib/util");
const semver_simple_parse_1 = require("@lazy-node/semver-simple-parse");
const replaceSimpleSemVerVersion_1 = require("@lazy-node/semver-simple-parse/lib/replaceSimpleSemVerVersion");
function fixPkgDepsVersionsCore(row, cache) {
    var _a, _b, _c, _d;
    const record = (_a = cache.record) !== null && _a !== void 0 ? _a : (cache.record = (0, util_1.listableToRecord)(cache.listable));
    const names = (_b = cache.names) !== null && _b !== void 0 ? _b : (cache.names = Object.keys(cache.record));
    const map = (_c = cache.map) !== null && _c !== void 0 ? _c : (cache.map = {});
    (_d = map.data) !== null && _d !== void 0 ? _d : (map.data = {});
    let changed;
    types_1.packageJsonDependenciesFields
        .forEach(field => {
        if (row[field]) {
            names
                .forEach(name => {
                const old = row[field][name];
                if (typeof old !== 'undefined') {
                    const parsed = (0, semver_simple_parse_1.parseRange)(old);
                    const version = record[name].version;
                    const semver = (0, replaceSimpleSemVerVersion_1.replaceSimpleSemVerVersion)(parsed[0], version).toFullString();
                    if (semver !== old) {
                        row[field][name] = semver;
                        changed = true;
                        map.data[name] = version;
                    }
                }
            });
        }
    });
    return {
        row,
        map,
        changed,
        cache: cache,
    };
}
exports.fixPkgDepsVersionsCore = fixPkgDepsVersionsCore;
function fixWsVersionsCore(listable, cwd) {
    const record = (0, util_1.listableToRecord)(listable);
    const names = Object.keys(record);
    const result = listable.reduce((map, row) => {
        let changed;
        ({
            changed,
            map,
        } = fixPkgDepsVersionsCore(row, {
            listable,
            record,
            names,
            map,
        }));
        if (changed) {
            map.changed.push(row);
        }
        else {
            map.others.push(row);
        }
        return map;
    }, {
        changed: [],
        others: [],
        data: {},
    });
    return {
        cwd,
        listable,
        record,
        names,
        ...result,
    };
}
exports.fixWsVersionsCore = fixWsVersionsCore;
function fixWsVersions(cwd) {
    return fixWsVersionsCore((0, deps_tree_1.wsPkgDepsListable)(cwd), cwd);
}
exports.fixWsVersions = fixWsVersions;
exports.default = fixWsVersions;
//# sourceMappingURL=index.js.map