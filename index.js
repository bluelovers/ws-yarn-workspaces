"use strict";
/**
 * Created by user on 2018/9/20/020.
 */
const path = require("path");
const pkgDir = require("pkg-dir");
const fs = require("fs-extra");
function yarnListLink(cwd) {
    let root = pkgDir.sync(cwd);
    if (!root || !fs.existsSync(root)) {
        throw new Error(`can't found current package root`);
    }
    let file = path.join(root, 'node_modules', '.yarn-integrity');
    let ls;
    if (fs.existsSync(file)) {
        ls = fs.readJSONSync(file).linkedModules;
    }
    return ls || null;
}
exports.default = yarnListLink;
// @ts-ignore
Object.assign(yarnListLink, exports, {
    yarnListLink,
});
module.exports = yarnListLink;
//# sourceMappingURL=index.js.map