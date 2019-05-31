"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("upath2");
const findYarnWorkspaceRoot = require("find-yarn-workspace-root2");
const core_1 = require("find-yarn-workspace-root2/core");
const pkgDir = require("pkg-dir");
function findRoot(options, _throwError) {
    if (!options.cwd) {
        throw new TypeError(`options.cwd is '${options.cwd}'`);
    }
    let ws;
    if (!options.skipCheckWorkspace) {
        ws = findYarnWorkspaceRoot(options.cwd);
    }
    let pkg = pkgDir.sync(options.cwd);
    let { throwError = _throwError } = options;
    if (pkg == null && throwError) {
        let err = new TypeError(`can't found package root from target directory '${options.cwd}'`);
        throw err;
    }
    let hasWorkspace = ws && ws != null;
    let isWorkspace = hasWorkspace && pathEqual(ws, pkg);
    let root = hasWorkspace ? ws : pkg;
    return {
        pkg,
        ws,
        hasWorkspace,
        isWorkspace,
        root,
    };
}
exports.findRoot = findRoot;
function pathEqual(a, b) {
    return path.normalize(a) === path.normalize(b);
}
exports.pathEqual = pathEqual;
function listMatchedPatternByPath(ws, pkg) {
    const manifest = core_1.readPackageJSON(ws);
    if (!manifest || !manifest.workspaces) {
        throw new Error(`not a package.json of yarn workspaces`);
    }
    const workspaces = core_1.extractWorkspaces(manifest);
    const relativePath = path.relative(ws, pkg);
    if (relativePath == '') {
        throw new RangeError(`pkg should not same as ws`);
    }
    const { ignores, list } = workspaces.reduce((a, b) => {
        if (b.startsWith('!')) {
            a.ignores.push(b);
        }
        else {
            a.list.push(b);
        }
        return a;
    }, {
        ignores: [],
        list: [],
    });
    return list
        .reduce(function (a, b) {
        if (core_1.isMatchWorkspaces(relativePath, [
            b,
            ...ignores,
        ])) {
            a.push(b);
        }
        return a;
    }, []);
}
exports.listMatchedPatternByPath = listMatchedPatternByPath;
exports.default = findRoot;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFnQztBQUNoQyxtRUFBb0U7QUFDcEUseURBQXVHO0FBR3ZHLGtDQUFtQztBQUVuQyxTQUFnQixRQUFRLENBQUMsT0FJeEIsRUFBRSxXQUFxQjtJQUV2QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFDaEI7UUFDQyxNQUFNLElBQUksU0FBUyxDQUFDLG1CQUFtQixPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQTtLQUN0RDtJQUVELElBQUksRUFBVSxDQUFDO0lBRWYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsRUFDL0I7UUFDQyxFQUFFLEdBQUcscUJBQXFCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3hDO0lBRUQsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFbkMsSUFBSSxFQUFFLFVBQVUsR0FBRyxXQUFXLEVBQUUsR0FBRyxPQUFPLENBQUM7SUFFM0MsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLFVBQVUsRUFDN0I7UUFDQyxJQUFJLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyxtREFBbUQsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDM0YsTUFBTSxHQUFHLENBQUM7S0FDVjtJQUVELElBQUksWUFBWSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksSUFBSSxDQUFDO0lBQ3BDLElBQUksV0FBVyxHQUFHLFlBQVksSUFBSSxTQUFTLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JELElBQUksSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFFbkMsT0FBTztRQUNOLEdBQUc7UUFDSCxFQUFFO1FBQ0YsWUFBWTtRQUNaLFdBQVc7UUFDWCxJQUFJO0tBQ0osQ0FBQTtBQUNGLENBQUM7QUF2Q0QsNEJBdUNDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTO0lBRTdDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQy9DLENBQUM7QUFIRCw4QkFHQztBQUVELFNBQWdCLHdCQUF3QixDQUFDLEVBQVUsRUFBRSxHQUFXO0lBRS9ELE1BQU0sUUFBUSxHQUFHLHNCQUFlLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFckMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQ3JDO1FBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFBO0tBQ3hEO0lBRUQsTUFBTSxVQUFVLEdBQUcsd0JBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFL0MsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFFNUMsSUFBSSxZQUFZLElBQUksRUFBRSxFQUN0QjtRQUNDLE1BQU0sSUFBSSxVQUFVLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtLQUNqRDtJQUVELE1BQU0sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUVwRCxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQ3JCO1lBQ0MsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEI7YUFFRDtZQUNDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2Y7UUFFRCxPQUFPLENBQUMsQ0FBQztJQUNWLENBQUMsRUFBRTtRQUNGLE9BQU8sRUFBRSxFQUFjO1FBQ3ZCLElBQUksRUFBRSxFQUFjO0tBQ3BCLENBQUMsQ0FBQztJQUVILE9BQU8sSUFBSTtTQUNULE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1FBRXJCLElBQUksd0JBQWlCLENBQUMsWUFBWSxFQUFFO1lBQ25DLENBQUM7WUFDRCxHQUFHLE9BQU87U0FDVixDQUFDLEVBQ0Y7WUFDQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ1Q7UUFFRCxPQUFPLENBQUMsQ0FBQztJQUNWLENBQUMsRUFBRSxFQUFjLENBQUMsQ0FDbEI7QUFDRixDQUFDO0FBakRELDREQWlEQztBQUVELGtCQUFlLFFBQVEsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoID0gcmVxdWlyZSgndXBhdGgyJyk7XG5pbXBvcnQgZmluZFlhcm5Xb3Jrc3BhY2VSb290ID0gcmVxdWlyZSgnZmluZC15YXJuLXdvcmtzcGFjZS1yb290MicpO1xuaW1wb3J0IHsgZXh0cmFjdFdvcmtzcGFjZXMsIGlzTWF0Y2hXb3Jrc3BhY2VzLCByZWFkUGFja2FnZUpTT04gfSBmcm9tICdmaW5kLXlhcm4td29ya3NwYWNlLXJvb3QyL2NvcmUnO1xuaW1wb3J0IHsgcmVhZFBhY2thZ2VKc29uIH0gZnJvbSAnQHRzLXR5cGUvcGFja2FnZS1kdHMnO1xuXG5pbXBvcnQgcGtnRGlyID0gcmVxdWlyZSgncGtnLWRpcicpO1xuXG5leHBvcnQgZnVuY3Rpb24gZmluZFJvb3Qob3B0aW9uczoge1xuXHRjd2Q6IHN0cmluZyxcblx0c2tpcENoZWNrV29ya3NwYWNlPzogYm9vbGVhbiB8IHN0cmluZyxcblx0dGhyb3dFcnJvcj86IGJvb2xlYW4sXG59LCBfdGhyb3dFcnJvcj86IGJvb2xlYW4pXG57XG5cdGlmICghb3B0aW9ucy5jd2QpXG5cdHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBvcHRpb25zLmN3ZCBpcyAnJHtvcHRpb25zLmN3ZH0nYClcblx0fVxuXG5cdGxldCB3czogc3RyaW5nO1xuXG5cdGlmICghb3B0aW9ucy5za2lwQ2hlY2tXb3Jrc3BhY2UpXG5cdHtcblx0XHR3cyA9IGZpbmRZYXJuV29ya3NwYWNlUm9vdChvcHRpb25zLmN3ZCk7XG5cdH1cblxuXHRsZXQgcGtnID0gcGtnRGlyLnN5bmMob3B0aW9ucy5jd2QpO1xuXG5cdGxldCB7IHRocm93RXJyb3IgPSBfdGhyb3dFcnJvciB9ID0gb3B0aW9ucztcblxuXHRpZiAocGtnID09IG51bGwgJiYgdGhyb3dFcnJvcilcblx0e1xuXHRcdGxldCBlcnIgPSBuZXcgVHlwZUVycm9yKGBjYW4ndCBmb3VuZCBwYWNrYWdlIHJvb3QgZnJvbSB0YXJnZXQgZGlyZWN0b3J5ICcke29wdGlvbnMuY3dkfSdgKTtcblx0XHR0aHJvdyBlcnI7XG5cdH1cblxuXHRsZXQgaGFzV29ya3NwYWNlID0gd3MgJiYgd3MgIT0gbnVsbDtcblx0bGV0IGlzV29ya3NwYWNlID0gaGFzV29ya3NwYWNlICYmIHBhdGhFcXVhbCh3cywgcGtnKTtcblx0bGV0IHJvb3QgPSBoYXNXb3Jrc3BhY2UgPyB3cyA6IHBrZztcblxuXHRyZXR1cm4ge1xuXHRcdHBrZyxcblx0XHR3cyxcblx0XHRoYXNXb3Jrc3BhY2UsXG5cdFx0aXNXb3Jrc3BhY2UsXG5cdFx0cm9vdCxcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0aEVxdWFsKGE6IHN0cmluZywgYjogc3RyaW5nKVxue1xuXHRyZXR1cm4gcGF0aC5ub3JtYWxpemUoYSkgPT09IHBhdGgubm9ybWFsaXplKGIpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0TWF0Y2hlZFBhdHRlcm5CeVBhdGgod3M6IHN0cmluZywgcGtnOiBzdHJpbmcpXG57XG5cdGNvbnN0IG1hbmlmZXN0ID0gcmVhZFBhY2thZ2VKU09OKHdzKTtcblxuXHRpZiAoIW1hbmlmZXN0IHx8ICFtYW5pZmVzdC53b3Jrc3BhY2VzKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBub3QgYSBwYWNrYWdlLmpzb24gb2YgeWFybiB3b3Jrc3BhY2VzYClcblx0fVxuXG5cdGNvbnN0IHdvcmtzcGFjZXMgPSBleHRyYWN0V29ya3NwYWNlcyhtYW5pZmVzdCk7XG5cblx0Y29uc3QgcmVsYXRpdmVQYXRoID0gcGF0aC5yZWxhdGl2ZSh3cywgcGtnKTtcblxuXHRpZiAocmVsYXRpdmVQYXRoID09ICcnKVxuXHR7XG5cdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoYHBrZyBzaG91bGQgbm90IHNhbWUgYXMgd3NgKVxuXHR9XG5cblx0Y29uc3QgeyBpZ25vcmVzLCBsaXN0IH0gPSB3b3Jrc3BhY2VzLnJlZHVjZSgoYSwgYikgPT4ge1xuXG5cdFx0aWYgKGIuc3RhcnRzV2l0aCgnIScpKVxuXHRcdHtcblx0XHRcdGEuaWdub3Jlcy5wdXNoKGIpO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0YS5saXN0LnB1c2goYik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGE7XG5cdH0sIHtcblx0XHRpZ25vcmVzOiBbXSBhcyBzdHJpbmdbXSxcblx0XHRsaXN0OiBbXSBhcyBzdHJpbmdbXSxcblx0fSk7XG5cblx0cmV0dXJuIGxpc3Rcblx0XHQucmVkdWNlKGZ1bmN0aW9uIChhLCBiKVxuXHRcdHtcblx0XHRcdGlmIChpc01hdGNoV29ya3NwYWNlcyhyZWxhdGl2ZVBhdGgsIFtcblx0XHRcdFx0Yixcblx0XHRcdFx0Li4uaWdub3Jlcyxcblx0XHRcdF0pKVxuXHRcdFx0e1xuXHRcdFx0XHRhLnB1c2goYilcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGE7XG5cdFx0fSwgW10gYXMgc3RyaW5nW10pXG5cdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmluZFJvb3RcbiJdfQ==