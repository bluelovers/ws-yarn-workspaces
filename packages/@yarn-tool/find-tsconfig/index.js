"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TsconfigLib = require("tsconfig");
const find_root_1 = require("@yarn-tool/find-root");
const fs = require("fs");
const path = require("path");
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
    let file = TsconfigLib.findSync(cwd);
    if (!file) {
        file = TsconfigLib.findSync(fs.realpathSync(cwd));
    }
    if (file) {
        file = path.normalize(file);
        if (file.includes(path.normalize(rooData.pkg)) || rooData.hasWorkspace && !rooData.isWorkspace && file.includes(path.normalize(rooData.ws))) {
            return file;
        }
    }
}
exports.findTsconfig = findTsconfig;
exports.default = findTsconfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF5QztBQUN6QyxvREFBZ0Q7QUFDaEQseUJBQTBCO0FBQzFCLDZCQUE4QjtBQUU5Qjs7Ozs7R0FLRztBQUNILFNBQWdCLFlBQVksQ0FBQyxHQUFXO0lBRXZDLElBQUksT0FBTyxHQUFHLG9CQUFRLENBQUM7UUFDdEIsR0FBRztLQUNILENBQUMsQ0FBQztJQUVILElBQUksSUFBSSxHQUFXLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFXLENBQUM7SUFFdkQsSUFBSSxDQUFDLElBQUksRUFDVDtRQUNDLElBQUksR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQVcsQ0FBQztLQUM1RDtJQUVELElBQUksSUFBSSxFQUNSO1FBQ0MsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFNUIsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUMzSTtZQUNDLE9BQU8sSUFBSSxDQUFDO1NBQ1o7S0FDRDtBQUNGLENBQUM7QUF0QkQsb0NBc0JDO0FBRUQsa0JBQWUsWUFBWSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRzY29uZmlnTGliID0gcmVxdWlyZSgndHNjb25maWcnKTtcbmltcG9ydCB7IGZpbmRSb290IH0gZnJvbSAnQHlhcm4tdG9vbC9maW5kLXJvb3QnO1xuaW1wb3J0IGZzID0gcmVxdWlyZSgnZnMnKTtcbmltcG9ydCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG4vKipcbiAqIGZpbmQgdHNjb25maWcgYW5kIG9ubHkgYWxsb3cgaW5zaWRlIGN1cnJlbnQgcGtnL3dzIHBhdGhcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY3dkXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZFRzY29uZmlnKGN3ZDogc3RyaW5nKTogc3RyaW5nXG57XG5cdGxldCByb29EYXRhID0gZmluZFJvb3Qoe1xuXHRcdGN3ZCxcblx0fSk7XG5cblx0bGV0IGZpbGU6IHN0cmluZyA9IFRzY29uZmlnTGliLmZpbmRTeW5jKGN3ZCkgYXMgc3RyaW5nO1xuXG5cdGlmICghZmlsZSlcblx0e1xuXHRcdGZpbGUgPSBUc2NvbmZpZ0xpYi5maW5kU3luYyhmcy5yZWFscGF0aFN5bmMoY3dkKSkgYXMgc3RyaW5nO1xuXHR9XG5cblx0aWYgKGZpbGUpXG5cdHtcblx0XHRmaWxlID0gcGF0aC5ub3JtYWxpemUoZmlsZSk7XG5cblx0XHRpZiAoZmlsZS5pbmNsdWRlcyhwYXRoLm5vcm1hbGl6ZShyb29EYXRhLnBrZykpIHx8IHJvb0RhdGEuaGFzV29ya3NwYWNlICYmICFyb29EYXRhLmlzV29ya3NwYWNlICYmIGZpbGUuaW5jbHVkZXMocGF0aC5ub3JtYWxpemUocm9vRGF0YS53cykpKVxuXHRcdHtcblx0XHRcdHJldHVybiBmaWxlO1xuXHRcdH1cblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBmaW5kVHNjb25maWdcbiJdfQ==