"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceTargetOfStaticFilesMapArrayEntry = replaceTargetOfStaticFilesMapArrayEntry;
function replaceTargetOfStaticFilesMapArrayEntry(entry, targetFile) {
    return [targetFile, ...entry.slice(1)];
}
//# sourceMappingURL=replaceTargetOfStaticFilesMapArrayEntry.js.map