"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortLernaJsonCommandEntry = sortLernaJsonCommandEntry;
exports.sortLernaJsonCommand = sortLernaJsonCommand;
exports.sortLernaJson = sortLernaJson;
exports.sortLernaJsonFile = sortLernaJsonFile;
const sort_object_keys2_1 = require("sort-object-keys2");
const fs_json_1 = require("@bluelovers/fs-json");
const write_package_json_1 = require("@yarn-tool/write-package-json");
function sortLernaJsonCommandEntry(value) {
    return (0, sort_object_keys2_1.sortObjectKeys)(value, {
        keys: [
            'concurrency',
            'stream',
            'loglevel',
            'ignoreChanges',
            'message',
            'bump',
            'noPrivate',
            'conventionalCommits',
            'conventionalGraduate',
            'changelogPreset',
        ],
        useSource: true,
    });
}
function sortLernaJsonCommand(value) {
    Object.values(value).forEach(sortLernaJsonCommandEntry);
    return (0, sort_object_keys2_1.sortObjectKeys)(value, {
        keys: [
            'publish',
            'version',
            'run',
            'exec',
        ],
        useSource: true,
    });
}
function sortLernaJson(json) {
    sortLernaJsonCommand(json.command);
    return (0, sort_object_keys2_1.sortObjectKeys)(json, {
        keys: [
            'workspaces',
            'packages',
            'command',
            'npmClient',
            'useWorkspaces',
            'version',
        ],
        useSource: true,
    });
}
function sortLernaJsonFile(file) {
    return (0, write_package_json_1.writePackageJSONSync)(file, sortLernaJson((0, fs_json_1.readJSONSync)(file)));
}
exports.default = sortLernaJson;
//# sourceMappingURL=index.js.map