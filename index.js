"use strict";
/**
 * Created by user on 2020/1/8.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_pkg_list_1 = require("ws-pkg-list");
const find_root_1 = __importDefault(require("@yarn-tool/find-root"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function syncLockfile(cwd, options = {}) {
    const { print, noThrowError } = options;
    const ws = find_root_1.default({
        cwd
    });
    if (!ws.hasWorkspace) {
        noThrowError || throwError(`target dir not a yarn workspaces, ${ws.root}`);
        return null;
    }
    const lockfile = `yarn.lock`;
    const lockfile_root = path_1.default.join(ws.root, lockfile);
    if (!fs_extra_1.default.pathExistsSync(lockfile_root)) {
        noThrowError || throwError(`yarn.lock not exists`);
        return null;
    }
    print && console.log(`workspaces:`, ws.root, '\n');
    const label = `copy done`;
    print && console.time(label);
    ws_pkg_list_1.workspacesPackagesList(ws.root, true)
        .forEach(pkg_dir => {
        print && console.log(`copy to... ${path_1.default.relative(ws.root, pkg_dir)}`);
        fs_extra_1.default.copySync(lockfile_root, path_1.default.join(pkg_dir, lockfile), {
            overwrite: true,
            preserveTimestamps: true,
            dereference: true,
        });
    });
    print && console.timeEnd(label);
    return true;
}
exports.syncLockfile = syncLockfile;
function throwError(message) {
    throw new Error(message);
}
exports.default = syncLockfile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7Ozs7O0FBRUgsNkNBQXFEO0FBQ3JELHFFQUE0QztBQUM1Qyx3REFBMEI7QUFDMUIsZ0RBQXdCO0FBRXhCLFNBQWdCLFlBQVksQ0FBQyxHQUFXLEVBQUUsVUFHdEMsRUFBRTtJQUVMLE1BQU0sRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBRXhDLE1BQU0sRUFBRSxHQUFHLG1CQUFRLENBQUM7UUFDbkIsR0FBRztLQUNILENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUNwQjtRQUNDLFlBQVksSUFBSSxVQUFVLENBQUMscUNBQXFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzNFLE9BQU8sSUFBSSxDQUFDO0tBQ1o7SUFFRCxNQUFNLFFBQVEsR0FBRyxXQUFXLENBQUM7SUFDN0IsTUFBTSxhQUFhLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRW5ELElBQUksQ0FBQyxrQkFBRSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsRUFDckM7UUFDQyxZQUFZLElBQUksVUFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUM7S0FDWjtJQUVELEtBQUssSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBRW5ELE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQztJQUUxQixLQUFLLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUU3QixvQ0FBc0IsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQztTQUNuQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFFbEIsS0FBSyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxjQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXRFLGtCQUFFLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxjQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRTtZQUN4RCxTQUFTLEVBQUUsSUFBSTtZQUNmLGtCQUFrQixFQUFFLElBQUk7WUFDeEIsV0FBVyxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFBO0lBRUgsQ0FBQyxDQUFDLENBQ0Y7SUFFRCxLQUFLLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUVoQyxPQUFPLElBQUksQ0FBQztBQUNiLENBQUM7QUFqREQsb0NBaURDO0FBRUQsU0FBUyxVQUFVLENBQUMsT0FBZTtJQUVsQyxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3pCLENBQUM7QUFFRCxrQkFBZSxZQUFZLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvOC5cbiAqL1xuXG5pbXBvcnQgeyB3b3Jrc3BhY2VzUGFja2FnZXNMaXN0IH0gZnJvbSAnd3MtcGtnLWxpc3QnO1xuaW1wb3J0IGZpbmRSb290IGZyb20gJ0B5YXJuLXRvb2wvZmluZC1yb290JztcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGZ1bmN0aW9uIHN5bmNMb2NrZmlsZShjd2Q6IHN0cmluZywgb3B0aW9uczoge1xuXHRwcmludD86IGJvb2xlYW4sXG5cdG5vVGhyb3dFcnJvcj86IGJvb2xlYW4sXG59ID0ge30pXG57XG5cdGNvbnN0IHsgcHJpbnQsIG5vVGhyb3dFcnJvciB9ID0gb3B0aW9ucztcblxuXHRjb25zdCB3cyA9IGZpbmRSb290KHtcblx0XHRjd2Rcblx0fSk7XG5cblx0aWYgKCF3cy5oYXNXb3Jrc3BhY2UpXG5cdHtcblx0XHRub1Rocm93RXJyb3IgfHwgdGhyb3dFcnJvcihgdGFyZ2V0IGRpciBub3QgYSB5YXJuIHdvcmtzcGFjZXMsICR7d3Mucm9vdH1gKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGNvbnN0IGxvY2tmaWxlID0gYHlhcm4ubG9ja2A7XG5cdGNvbnN0IGxvY2tmaWxlX3Jvb3QgPSBwYXRoLmpvaW4od3Mucm9vdCwgbG9ja2ZpbGUpO1xuXG5cdGlmICghZnMucGF0aEV4aXN0c1N5bmMobG9ja2ZpbGVfcm9vdCkpXG5cdHtcblx0XHRub1Rocm93RXJyb3IgfHwgdGhyb3dFcnJvcihgeWFybi5sb2NrIG5vdCBleGlzdHNgKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdHByaW50ICYmIGNvbnNvbGUubG9nKGB3b3Jrc3BhY2VzOmAsIHdzLnJvb3QsICdcXG4nKTtcblxuXHRjb25zdCBsYWJlbCA9IGBjb3B5IGRvbmVgO1xuXG5cdHByaW50ICYmIGNvbnNvbGUudGltZShsYWJlbCk7XG5cblx0d29ya3NwYWNlc1BhY2thZ2VzTGlzdCh3cy5yb290LCB0cnVlKVxuXHRcdC5mb3JFYWNoKHBrZ19kaXIgPT4ge1xuXG5cdFx0XHRwcmludCAmJiBjb25zb2xlLmxvZyhgY29weSB0by4uLiAke3BhdGgucmVsYXRpdmUod3Mucm9vdCwgcGtnX2Rpcil9YCk7XG5cblx0XHRcdGZzLmNvcHlTeW5jKGxvY2tmaWxlX3Jvb3QsIHBhdGguam9pbihwa2dfZGlyLCBsb2NrZmlsZSksIHtcblx0XHRcdFx0b3ZlcndyaXRlOiB0cnVlLFxuXHRcdFx0XHRwcmVzZXJ2ZVRpbWVzdGFtcHM6IHRydWUsXG5cdFx0XHRcdGRlcmVmZXJlbmNlOiB0cnVlLFxuXHRcdFx0fSlcblxuXHRcdH0pXG5cdDtcblxuXHRwcmludCAmJiBjb25zb2xlLnRpbWVFbmQobGFiZWwpO1xuXG5cdHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB0aHJvd0Vycm9yKG1lc3NhZ2U6IHN0cmluZylcbntcblx0dGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHN5bmNMb2NrZmlsZVxuIl19