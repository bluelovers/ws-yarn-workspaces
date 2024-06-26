"use strict";
/**
 * Created by user on 2020/4/9.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTarballName = getTarballName;
function getTarballName(pkg, versionPrefix) {
    const name = pkg.name[0] === "@"
        ? // scoped packages get special treatment
            pkg.name.substr(1).replace(/\//g, "-")
        : pkg.name;
    return `${name}-${versionPrefix !== null && versionPrefix !== void 0 ? versionPrefix : ''}${pkg.version}.tgz`;
}
//# sourceMappingURL=util.js.map