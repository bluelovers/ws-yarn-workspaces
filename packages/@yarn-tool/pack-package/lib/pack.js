"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.packTargetPackage = exports.packTargetDirectory = void 0;
const tslib_1 = require("tslib");
const npm_packlist_1 = tslib_1.__importDefault(require("npm-packlist"));
const tar_1 = require("tar");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("./util");
function packTargetDirectory({ packageDir, packageTarball, }) {
    return (0, npm_packlist_1.default)({ path: packageDir })
        .then(files => {
        //console.dir(files)
        return (0, tar_1.create)({
            prefix: 'package/',
            cwd: packageDir,
            file: packageTarball,
            gzip: true,
            portable: true,
            mtime: new Date("1985-10-26T08:15:00.000Z"),
        }, files.map(f => `./${f}`));
    });
}
exports.packTargetDirectory = packTargetDirectory;
function packTargetPackage(options) {
    let { pkg, packageDir } = options;
    packageDir = (0, fs_1.realpathSync)(packageDir);
    if (!pkg) {
        pkg = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(options.packageDir, 'package.json')).toString());
    }
    let packageTarball = options.packageTarball || (0, util_1.getTarballName)(pkg, options.versionPrefix);
    packageTarball = (0, path_1.resolve)(packageDir, packageTarball);
    return packTargetDirectory({
        //...options,
        packageDir,
        packageTarball,
    })
        .then((ret) => {
        //console.dir(ret)
        return {
            ...options,
            pkg,
            packageDir,
            packageTarball,
        };
    });
}
exports.packTargetPackage = packTargetPackage;
exports.default = packTargetPackage;
//# sourceMappingURL=pack.js.map