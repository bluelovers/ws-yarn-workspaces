"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeYarnLockFile = void 0;
const parse_1 = require("@yarn-tool/yarnlock/lib/parse");
const fs_extra_1 = require("fs-extra");
function writeYarnLockFile(file, data) {
    return (0, fs_extra_1.writeFileSync)(file, (0, parse_1.stringify)(data));
}
exports.writeYarnLockFile = writeYarnLockFile;
//# sourceMappingURL=writeYarnLockFile.js.map