"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmCheckUpdates = void 0;
const options_1 = require("../options");
const npm_check_updates_1 = require("npm-check-updates");
const bluebird_1 = __importDefault(require("bluebird"));
const util_1 = require("../util");
const npm_package_arg_1 = __importDefault(require("npm-package-arg"));
const queryVersion_1 = require("@yarn-tool/pkg-version-query/lib/queryVersion");
const mergeSimpleSemVer_1 = require("@lazy-node/semver-simple-parse/lib/mergeSimpleSemVer");
const parseSimpleSemVer_1 = require("@lazy-node/semver-simple-parse/lib/parseSimpleSemVer");
const stringifySimpleSemVer_1 = require("@lazy-node/semver-simple-parse/lib/stringifySimpleSemVer");
const index_1 = require("@yarn-tool/pkg-version-query/index");
const deps_table_1 = __importDefault(require("@yarn-tool/table/lib/deps-table"));
async function npmCheckUpdates(cache, ncuOptions) {
    //ncuOptions.silent = false;
    //ncuOptions.json = false;
    //ncuOptions.cli = true;
    //ncuOptions.args = [];
    //ncuOptions.loglevel = 'verbose';
    ncuOptions = options_1.npmCheckUpdatesOptions(ncuOptions);
    ncuOptions.cwd = cache.cwd;
    ncuOptions.json_new = JSON.parse(ncuOptions.packageData);
    ncuOptions.list_updated = await npm_check_updates_1.run(ncuOptions);
    let json_changed = false;
    const current = {};
    const list_updated = {};
    await bluebird_1.default
        .resolve([
        'dependencies',
        'devDependencies',
        'peerDependencies',
        'optionalDependencies',
    ])
        .each(async (key) => {
        var _a;
        const deps = (_a = ncuOptions.json_new[key]) !== null && _a !== void 0 ? _a : {};
        await bluebird_1.default
            .resolve(Object.keys(deps))
            .each(async (name) => {
            var _a;
            const version_new = ncuOptions.list_updated[name];
            const version_old = deps[name];
            if (version_new === null || version_new === void 0 ? void 0 : version_new.length) {
                if (version_old !== version_new && util_1.allowUpdateVersion(version_old)) {
                    list_updated[name] = version_new;
                    current[name] = version_old;
                    deps[name] = version_new;
                    json_changed = true;
                }
            }
            else if (!/[\s|&]/.test(version_old)) {
                let key = `${name}@${version_old}`;
                let check = npm_package_arg_1.default(key);
                let prefix = (_a = /^([\^~\s]+)/.exec(version_old)) === null || _a === void 0 ? void 0 : _a[1];
                if ((prefix === null || prefix === void 0 ? void 0 : prefix.length) && check.type === 'range') {
                    let version_new = await queryVersion_1.queryVersionWithCache(name, version_old)
                        .then(v => prefix + v)
                        .catch(e => null);
                    if ((version_new === null || version_new === void 0 ? void 0 : version_new.length) && version_new !== version_old) {
                        try {
                            let { target } = mergeSimpleSemVer_1.mergeSimpleSemVer(parseSimpleSemVer_1.parseSimpleSemVer(version_old), parseSimpleSemVer_1.parseSimpleSemVer(version_new));
                            let version = stringifySimpleSemVer_1.stringifySemverFull(target);
                            if ((version === null || version === void 0 ? void 0 : version.length) > 0) {
                                list_updated[name] = version;
                                current[name] = version_old;
                                deps[name] = version;
                                json_changed = true;
                            }
                        }
                        catch (err) { }
                    }
                }
            }
        });
    });
    await index_1.getCache().fsDump();
    ncuOptions.json_changed = json_changed;
    ncuOptions.list_updated = list_updated;
    ncuOptions.current = current;
    const table = deps_table_1.default({
        from: ncuOptions.current,
        to: ncuOptions.list_updated,
    }).toString();
    table && console.log(`\n${table}\n`);
    return ncuOptions;
}
exports.npmCheckUpdates = npmCheckUpdates;
//# sourceMappingURL=npmCheckUpdates.js.map