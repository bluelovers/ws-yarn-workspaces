"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsconfig_1 = require("tsconfig");
const find_root_1 = require("@yarn-tool/find-root");
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * find tsconfig and only allow inside current pkg/ws path
 *
 * @param {string} cwd
 * @returns {string}
 */
function findTsconfig(cwd) {
    let rooData = find_root_1.findRoot({
        cwd,
    });
    let file = tsconfig_1.findSync(cwd);
    if (!file) {
        file = tsconfig_1.findSync(fs_1.realpathSync(cwd));
    }
    if (file) {
        file = path_1.normalize(file);
        if (file.includes(path_1.normalize(rooData.pkg)) || rooData.hasWorkspace && !rooData.isWorkspace && file.includes(path_1.normalize(rooData.ws))) {
            return file;
        }
    }
}
exports.findTsconfig = findTsconfig;
exports.default = findTsconfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFvQztBQUNwQyxvREFBZ0Q7QUFDaEQsMkJBQWtDO0FBQ2xDLCtCQUFpQztBQUVqQzs7Ozs7R0FLRztBQUNILFNBQWdCLFlBQVksQ0FBQyxHQUFXO0lBRXZDLElBQUksT0FBTyxHQUFHLG9CQUFRLENBQUM7UUFDdEIsR0FBRztLQUNILENBQUMsQ0FBQztJQUVILElBQUksSUFBSSxHQUFXLG1CQUFRLENBQUMsR0FBRyxDQUFXLENBQUM7SUFFM0MsSUFBSSxDQUFDLElBQUksRUFDVDtRQUNDLElBQUksR0FBRyxtQkFBUSxDQUFDLGlCQUFZLENBQUMsR0FBRyxDQUFDLENBQVcsQ0FBQztLQUM3QztJQUVELElBQUksSUFBSSxFQUNSO1FBQ0MsSUFBSSxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFdkIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUNqSTtZQUNDLE9BQU8sSUFBSSxDQUFDO1NBQ1o7S0FDRDtBQUNGLENBQUM7QUF0QkQsb0NBc0JDO0FBRUQsa0JBQWUsWUFBWSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmluZFN5bmMgfSBmcm9tICd0c2NvbmZpZyc7XG5pbXBvcnQgeyBmaW5kUm9vdCB9IGZyb20gJ0B5YXJuLXRvb2wvZmluZC1yb290JztcbmltcG9ydCB7IHJlYWxwYXRoU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IG5vcm1hbGl6ZSB9IGZyb20gJ3BhdGgnO1xuXG4vKipcbiAqIGZpbmQgdHNjb25maWcgYW5kIG9ubHkgYWxsb3cgaW5zaWRlIGN1cnJlbnQgcGtnL3dzIHBhdGhcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY3dkXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZFRzY29uZmlnKGN3ZDogc3RyaW5nKTogc3RyaW5nXG57XG5cdGxldCByb29EYXRhID0gZmluZFJvb3Qoe1xuXHRcdGN3ZCxcblx0fSk7XG5cblx0bGV0IGZpbGU6IHN0cmluZyA9IGZpbmRTeW5jKGN3ZCkgYXMgc3RyaW5nO1xuXG5cdGlmICghZmlsZSlcblx0e1xuXHRcdGZpbGUgPSBmaW5kU3luYyhyZWFscGF0aFN5bmMoY3dkKSkgYXMgc3RyaW5nO1xuXHR9XG5cblx0aWYgKGZpbGUpXG5cdHtcblx0XHRmaWxlID0gbm9ybWFsaXplKGZpbGUpO1xuXG5cdFx0aWYgKGZpbGUuaW5jbHVkZXMobm9ybWFsaXplKHJvb0RhdGEucGtnKSkgfHwgcm9vRGF0YS5oYXNXb3Jrc3BhY2UgJiYgIXJvb0RhdGEuaXNXb3Jrc3BhY2UgJiYgZmlsZS5pbmNsdWRlcyhub3JtYWxpemUocm9vRGF0YS53cykpKVxuXHRcdHtcblx0XHRcdHJldHVybiBmaWxlO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBmaW5kVHNjb25maWdcbiJdfQ==