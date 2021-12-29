"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortLernaJsonFile = exports.sortLernaJson = exports.sortLernaJsonCommand = exports.sortLernaJsonCommandEntry = void 0;
const sort_object_keys2_1 = require("sort-object-keys2");
const fs_json_1 = require("@bluelovers/fs-json");
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
exports.sortLernaJsonCommandEntry = sortLernaJsonCommandEntry;
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
exports.sortLernaJsonCommand = sortLernaJsonCommand;
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
exports.sortLernaJson = sortLernaJson;
function sortLernaJsonFile(file) {
    return (0, fs_json_1.writeJSONSync)(file, sortLernaJson((0, fs_json_1.readJSONSync)(file)), {
        spaces: 2,
    });
}
exports.sortLernaJsonFile = sortLernaJsonFile;
exports.default = sortLernaJson;
//# sourceMappingURL=index.js.map