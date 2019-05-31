"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("upath2");
const core_1 = require("find-yarn-workspace-root2/core");
const pkgDir = require("pkg-dir");
function findRoot(options, _throwError) {
    if (!options.cwd) {
        throw new TypeError(`options.cwd is '${options.cwd}'`);
    }
    let ws;
    if (!options.skipCheckWorkspace) {
        ws = core_1.findWorkspaceRoot(options.cwd);
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
function pathNormalize(input) {
    return path.normalize(input);
}
exports.pathNormalize = pathNormalize;
function pathEqual(a, b) {
    return pathNormalize(a) === pathNormalize(b);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUFnQztBQUNoQyx5REFBbUo7QUFHbkosa0NBQW1DO0FBRW5DLFNBQWdCLFFBQVEsQ0FBQyxPQUl4QixFQUFFLFdBQXFCO0lBRXZCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUNoQjtRQUNDLE1BQU0sSUFBSSxTQUFTLENBQUMsbUJBQW1CLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBO0tBQ3REO0lBRUQsSUFBSSxFQUFVLENBQUM7SUFFZixJQUFJLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUMvQjtRQUNDLEVBQUUsR0FBRyx3QkFBcUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDeEM7SUFFRCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVuQyxJQUFJLEVBQUUsVUFBVSxHQUFHLFdBQVcsRUFBRSxHQUFHLE9BQU8sQ0FBQztJQUUzQyxJQUFJLEdBQUcsSUFBSSxJQUFJLElBQUksVUFBVSxFQUM3QjtRQUNDLElBQUksR0FBRyxHQUFHLElBQUksU0FBUyxDQUFDLG1EQUFtRCxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUMzRixNQUFNLEdBQUcsQ0FBQztLQUNWO0lBRUQsSUFBSSxZQUFZLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxJQUFJLENBQUM7SUFDcEMsSUFBSSxXQUFXLEdBQUcsWUFBWSxJQUFJLFNBQVMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDckQsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUVuQyxPQUFPO1FBQ04sR0FBRztRQUNILEVBQUU7UUFDRixZQUFZO1FBQ1osV0FBVztRQUNYLElBQUk7S0FDSixDQUFBO0FBQ0YsQ0FBQztBQXZDRCw0QkF1Q0M7QUFFRCxTQUFnQixhQUFhLENBQUMsS0FBYTtJQUUxQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDN0IsQ0FBQztBQUhELHNDQUdDO0FBRUQsU0FBZ0IsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTO0lBRTdDLE9BQU8sYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM3QyxDQUFDO0FBSEQsOEJBR0M7QUFFRCxTQUFnQix3QkFBd0IsQ0FBQyxFQUFVLEVBQUUsR0FBVztJQUUvRCxNQUFNLFFBQVEsR0FBRyxzQkFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRXJDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUNyQztRQUNDLE1BQU0sSUFBSSxLQUFLLENBQUMsdUNBQXVDLENBQUMsQ0FBQTtLQUN4RDtJQUVELE1BQU0sVUFBVSxHQUFHLHdCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRS9DLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRTVDLElBQUksWUFBWSxJQUFJLEVBQUUsRUFDdEI7UUFDQyxNQUFNLElBQUksVUFBVSxDQUFDLDJCQUEyQixDQUFDLENBQUE7S0FDakQ7SUFFRCxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFFcEQsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUNyQjtZQUNDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO2FBRUQ7WUFDQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNmO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDVixDQUFDLEVBQUU7UUFDRixPQUFPLEVBQUUsRUFBYztRQUN2QixJQUFJLEVBQUUsRUFBYztLQUNwQixDQUFDLENBQUM7SUFFSCxPQUFPLElBQUk7U0FDVCxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUVyQixJQUFJLHdCQUFpQixDQUFDLFlBQVksRUFBRTtZQUNuQyxDQUFDO1lBQ0QsR0FBRyxPQUFPO1NBQ1YsQ0FBQyxFQUNGO1lBQ0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtTQUNUO1FBRUQsT0FBTyxDQUFDLENBQUM7SUFDVixDQUFDLEVBQUUsRUFBYyxDQUFDLENBQ2xCO0FBQ0YsQ0FBQztBQWpERCw0REFpREM7QUFFRCxrQkFBZSxRQUFRLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCA9IHJlcXVpcmUoJ3VwYXRoMicpO1xuaW1wb3J0IHsgZXh0cmFjdFdvcmtzcGFjZXMsIGlzTWF0Y2hXb3Jrc3BhY2VzLCByZWFkUGFja2FnZUpTT04sIGZpbmRXb3Jrc3BhY2VSb290IGFzIGZpbmRZYXJuV29ya3NwYWNlUm9vdCB9IGZyb20gJ2ZpbmQteWFybi13b3Jrc3BhY2Utcm9vdDIvY29yZSc7XG5pbXBvcnQgeyByZWFkUGFja2FnZUpzb24gfSBmcm9tICdAdHMtdHlwZS9wYWNrYWdlLWR0cyc7XG5cbmltcG9ydCBwa2dEaXIgPSByZXF1aXJlKCdwa2ctZGlyJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUm9vdChvcHRpb25zOiB7XG5cdGN3ZDogc3RyaW5nLFxuXHRza2lwQ2hlY2tXb3Jrc3BhY2U/OiBib29sZWFuIHwgc3RyaW5nLFxuXHR0aHJvd0Vycm9yPzogYm9vbGVhbixcbn0sIF90aHJvd0Vycm9yPzogYm9vbGVhbilcbntcblx0aWYgKCFvcHRpb25zLmN3ZClcblx0e1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYG9wdGlvbnMuY3dkIGlzICcke29wdGlvbnMuY3dkfSdgKVxuXHR9XG5cblx0bGV0IHdzOiBzdHJpbmc7XG5cblx0aWYgKCFvcHRpb25zLnNraXBDaGVja1dvcmtzcGFjZSlcblx0e1xuXHRcdHdzID0gZmluZFlhcm5Xb3Jrc3BhY2VSb290KG9wdGlvbnMuY3dkKTtcblx0fVxuXG5cdGxldCBwa2cgPSBwa2dEaXIuc3luYyhvcHRpb25zLmN3ZCk7XG5cblx0bGV0IHsgdGhyb3dFcnJvciA9IF90aHJvd0Vycm9yIH0gPSBvcHRpb25zO1xuXG5cdGlmIChwa2cgPT0gbnVsbCAmJiB0aHJvd0Vycm9yKVxuXHR7XG5cdFx0bGV0IGVyciA9IG5ldyBUeXBlRXJyb3IoYGNhbid0IGZvdW5kIHBhY2thZ2Ugcm9vdCBmcm9tIHRhcmdldCBkaXJlY3RvcnkgJyR7b3B0aW9ucy5jd2R9J2ApO1xuXHRcdHRocm93IGVycjtcblx0fVxuXG5cdGxldCBoYXNXb3Jrc3BhY2UgPSB3cyAmJiB3cyAhPSBudWxsO1xuXHRsZXQgaXNXb3Jrc3BhY2UgPSBoYXNXb3Jrc3BhY2UgJiYgcGF0aEVxdWFsKHdzLCBwa2cpO1xuXHRsZXQgcm9vdCA9IGhhc1dvcmtzcGFjZSA/IHdzIDogcGtnO1xuXG5cdHJldHVybiB7XG5cdFx0cGtnLFxuXHRcdHdzLFxuXHRcdGhhc1dvcmtzcGFjZSxcblx0XHRpc1dvcmtzcGFjZSxcblx0XHRyb290LFxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRoTm9ybWFsaXplKGlucHV0OiBzdHJpbmcpXG57XG5cdHJldHVybiBwYXRoLm5vcm1hbGl6ZShpbnB1dClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGhFcXVhbChhOiBzdHJpbmcsIGI6IHN0cmluZylcbntcblx0cmV0dXJuIHBhdGhOb3JtYWxpemUoYSkgPT09IHBhdGhOb3JtYWxpemUoYilcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RNYXRjaGVkUGF0dGVybkJ5UGF0aCh3czogc3RyaW5nLCBwa2c6IHN0cmluZylcbntcblx0Y29uc3QgbWFuaWZlc3QgPSByZWFkUGFja2FnZUpTT04od3MpO1xuXG5cdGlmICghbWFuaWZlc3QgfHwgIW1hbmlmZXN0LndvcmtzcGFjZXMpXG5cdHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYG5vdCBhIHBhY2thZ2UuanNvbiBvZiB5YXJuIHdvcmtzcGFjZXNgKVxuXHR9XG5cblx0Y29uc3Qgd29ya3NwYWNlcyA9IGV4dHJhY3RXb3Jrc3BhY2VzKG1hbmlmZXN0KTtcblxuXHRjb25zdCByZWxhdGl2ZVBhdGggPSBwYXRoLnJlbGF0aXZlKHdzLCBwa2cpO1xuXG5cdGlmIChyZWxhdGl2ZVBhdGggPT0gJycpXG5cdHtcblx0XHR0aHJvdyBuZXcgUmFuZ2VFcnJvcihgcGtnIHNob3VsZCBub3Qgc2FtZSBhcyB3c2ApXG5cdH1cblxuXHRjb25zdCB7IGlnbm9yZXMsIGxpc3QgfSA9IHdvcmtzcGFjZXMucmVkdWNlKChhLCBiKSA9PiB7XG5cblx0XHRpZiAoYi5zdGFydHNXaXRoKCchJykpXG5cdFx0e1xuXHRcdFx0YS5pZ25vcmVzLnB1c2goYik7XG5cdFx0fVxuXHRcdGVsc2Vcblx0XHR7XG5cdFx0XHRhLmxpc3QucHVzaChiKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYTtcblx0fSwge1xuXHRcdGlnbm9yZXM6IFtdIGFzIHN0cmluZ1tdLFxuXHRcdGxpc3Q6IFtdIGFzIHN0cmluZ1tdLFxuXHR9KTtcblxuXHRyZXR1cm4gbGlzdFxuXHRcdC5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpXG5cdFx0e1xuXHRcdFx0aWYgKGlzTWF0Y2hXb3Jrc3BhY2VzKHJlbGF0aXZlUGF0aCwgW1xuXHRcdFx0XHRiLFxuXHRcdFx0XHQuLi5pZ25vcmVzLFxuXHRcdFx0XSkpXG5cdFx0XHR7XG5cdFx0XHRcdGEucHVzaChiKVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gYTtcblx0XHR9LCBbXSBhcyBzdHJpbmdbXSlcblx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBmaW5kUm9vdFxuIl19