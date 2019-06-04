"use strict";
/**
 * Created by user on 2019/6/4.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const HostedGitInfo = require("hosted-git-info");
const info_1 = require("@git-lazy/info");
function getHostedGitInfo(o) {
    return HostedGitInfo.fromUrl(info_1.filterRemoteUrl(o));
}
exports.getHostedGitInfo = getHostedGitInfo;
function npmHostedGitInfo(cwd) {
    let file = info_1.findConfigPathLocal(cwd);
    if (file != null) {
        let o = info_1.parseConfig(file);
        let info = getHostedGitInfo(o);
        return npmHostedGitInfoCore(info);
    }
}
exports.npmHostedGitInfo = npmHostedGitInfo;
function npmHostedGitInfoCore(info) {
    return {
        homepage: info.docs({
            noCommittish: true,
        }),
        bugs: info.bugs({
            noCommittish: true,
        }),
        repository: info.https({
            noCommittish: true,
        }),
        _: info,
    };
}
exports.npmHostedGitInfoCore = npmHostedGitInfoCore;
exports.default = npmHostedGitInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBRUgsaURBQWtEO0FBQ2xELHlDQUFtRjtBQUVuRixTQUFnQixnQkFBZ0IsQ0FBQyxDQUFpQztJQUVqRSxPQUFPLGFBQWEsQ0FBQyxPQUFPLENBQUMsc0JBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2pELENBQUM7QUFIRCw0Q0FHQztBQUVELFNBQWdCLGdCQUFnQixDQUFDLEdBQVk7SUFFNUMsSUFBSSxJQUFJLEdBQUcsMEJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUE7SUFFbkMsSUFBSSxJQUFJLElBQUksSUFBSSxFQUNoQjtRQUNDLElBQUksQ0FBQyxHQUFHLGtCQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFekIsSUFBSSxJQUFJLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFOUIsT0FBTyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNqQztBQUNGLENBQUM7QUFaRCw0Q0FZQztBQUVELFNBQWdCLG9CQUFvQixDQUFDLElBQW1CO0lBRXZELE9BQU87UUFDTixRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNuQixZQUFZLEVBQUUsSUFBSTtTQUNsQixDQUFDO1FBQ0YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDZixZQUFZLEVBQUUsSUFBSTtTQUNsQixDQUFDO1FBQ0YsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDdEIsWUFBWSxFQUFFLElBQUk7U0FDbEIsQ0FBQztRQUVGLENBQUMsRUFBRSxJQUFJO0tBQ1AsQ0FBQTtBQUNGLENBQUM7QUFmRCxvREFlQztBQUVELGtCQUFlLGdCQUFnQixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gMjAxOS82LzQuXG4gKi9cblxuaW1wb3J0IEhvc3RlZEdpdEluZm8gPSByZXF1aXJlKCdob3N0ZWQtZ2l0LWluZm8nKTtcbmltcG9ydCB7IHBhcnNlQ29uZmlnLCBmaWx0ZXJSZW1vdGVVcmwsIGZpbmRDb25maWdQYXRoTG9jYWwgfSBmcm9tICdAZ2l0LWxhenkvaW5mbyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIb3N0ZWRHaXRJbmZvKG86IFJldHVyblR5cGU8dHlwZW9mIHBhcnNlQ29uZmlnPilcbntcblx0cmV0dXJuIEhvc3RlZEdpdEluZm8uZnJvbVVybChmaWx0ZXJSZW1vdGVVcmwobykpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBucG1Ib3N0ZWRHaXRJbmZvKGN3ZD86IHN0cmluZylcbntcblx0bGV0IGZpbGUgPSBmaW5kQ29uZmlnUGF0aExvY2FsKGN3ZClcblxuXHRpZiAoZmlsZSAhPSBudWxsKVxuXHR7XG5cdFx0bGV0IG8gPSBwYXJzZUNvbmZpZyhmaWxlKVxuXG5cdFx0bGV0IGluZm8gPSBnZXRIb3N0ZWRHaXRJbmZvKG8pXG5cblx0XHRyZXR1cm4gbnBtSG9zdGVkR2l0SW5mb0NvcmUoaW5mbylcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbnBtSG9zdGVkR2l0SW5mb0NvcmUoaW5mbzogSG9zdGVkR2l0SW5mbylcbntcblx0cmV0dXJuIHtcblx0XHRob21lcGFnZTogaW5mby5kb2NzKHtcblx0XHRcdG5vQ29tbWl0dGlzaDogdHJ1ZSxcblx0XHR9KSxcblx0XHRidWdzOiBpbmZvLmJ1Z3Moe1xuXHRcdFx0bm9Db21taXR0aXNoOiB0cnVlLFxuXHRcdH0pLFxuXHRcdHJlcG9zaXRvcnk6IGluZm8uaHR0cHMoe1xuXHRcdFx0bm9Db21taXR0aXNoOiB0cnVlLFxuXHRcdH0pLFxuXG5cdFx0XzogaW5mbyxcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBucG1Ib3N0ZWRHaXRJbmZvXG4iXX0=