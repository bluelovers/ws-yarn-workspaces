"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceTargetOfStaticFilesMapArrayEntry = void 0;
function replaceTargetOfStaticFilesMapArrayEntry(entry, targetFile) {
    return [targetFile, ...entry.slice(1)];
}
exports.replaceTargetOfStaticFilesMapArrayEntry = replaceTargetOfStaticFilesMapArrayEntry;
//# sourceMappingURL=replaceTargetOfStaticFilesMapArrayEntry.js.map