"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YarnLockDiff = void 0;
const command_1 = require("@oclif/command");
const formatter_1 = require("./formatter");
const diff_service_1 = require("./diff-service");
const path_1 = require("path");
const fs_1 = require("fs");
class YarnLockDiff extends command_1.Command {
    constructor() {
        super(...arguments);
        this.checkIfExist = (filePathString) => {
            const filePath = path_1.resolve(process.cwd(), filePathString);
            return fs_1.existsSync(filePath);
        };
        this.reportNonExistantFiles = (filePathString) => {
            if (!this.checkIfExist(filePathString)) {
                this.error(`File does not exist "${filePathString}"`);
            }
            return filePathString;
        };
        this.checkIfLockFile = (filePathString) => {
            const fileExtension = path_1.extname(filePathString);
            return fileExtension === ".lock";
        };
        this.reportNonLockFile = (filePathString) => {
            if (!this.checkIfLockFile(filePathString)) {
                this.error(`File is not a lock file "${filePathString}"`);
            }
            return filePathString;
        };
    }
    async run() {
        const { flags } = this.parse(YarnLockDiff);
        const oldYarnLockPaths = flags.old;
        const newYarnLockPaths = flags.new;
        [...oldYarnLockPaths, ...newYarnLockPaths]
            .map(this.reportNonExistantFiles)
            .map(this.reportNonLockFile);
        const oldContents = oldYarnLockPaths.map(path => fs_1.readFileSync(path, "utf8"));
        const newContents = newYarnLockPaths.map(path => fs_1.readFileSync(path, "utf8"));
        diff_service_1.buildDiff(oldContents, newContents)
            .map(formatter_1.buildDiffTable)
            .map(this.log);
    }
}
exports.YarnLockDiff = YarnLockDiff;
YarnLockDiff.description = "Given one or more old yarn.lock files and one or more new yarn.lock files, compute the diff";
YarnLockDiff.flags = {
    version: command_1.flags.version({ char: "v" }),
    help: command_1.flags.help({ char: "h" }),
    old: command_1.flags.string({
        char: "o",
        description: "old yarn.lock file(s)",
        multiple: true,
        required: true,
    }),
    new: command_1.flags.string({
        char: "n",
        description: "new yarn.lock file(s)",
        multiple: true,
        required: true,
    }),
};
exports.default = YarnLockDiff;
//# sourceMappingURL=index.js.map