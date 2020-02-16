"use strict";
/**
 * Created by user on 2019/6/4.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hosted_git_info_1 = __importDefault(require("hosted-git-info"));
const info_1 = require("@git-lazy/info");
function getHostedGitInfo(o) {
    return hosted_git_info_1.default.fromUrl(info_1.filterRemoteUrl(o));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7Ozs7O0FBRUgsc0VBQTRDO0FBQzVDLHlDQUFtRjtBQUVuRixTQUFnQixnQkFBZ0IsQ0FBQyxDQUFpQztJQUVqRSxPQUFPLHlCQUFhLENBQUMsT0FBTyxDQUFDLHNCQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNqRCxDQUFDO0FBSEQsNENBR0M7QUFFRCxTQUFnQixnQkFBZ0IsQ0FBQyxHQUFZO0lBRTVDLElBQUksSUFBSSxHQUFHLDBCQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBRW5DLElBQUksSUFBSSxJQUFJLElBQUksRUFDaEI7UUFDQyxJQUFJLENBQUMsR0FBRyxrQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBRXpCLElBQUksSUFBSSxHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRTlCLE9BQU8sb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDakM7QUFDRixDQUFDO0FBWkQsNENBWUM7QUFFRCxTQUFnQixvQkFBb0IsQ0FBQyxJQUFtQjtJQUV2RCxPQUFPO1FBQ04sUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7WUFDbkIsWUFBWSxFQUFFLElBQUk7U0FDbEIsQ0FBQztRQUNGLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ2YsWUFBWSxFQUFFLElBQUk7U0FDbEIsQ0FBQztRQUNGLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3RCLFlBQVksRUFBRSxJQUFJO1NBQ2xCLENBQUM7UUFFRixDQUFDLEVBQUUsSUFBSTtLQUNQLENBQUE7QUFDRixDQUFDO0FBZkQsb0RBZUM7QUFFRCxrQkFBZSxnQkFBZ0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTkvNi80LlxuICovXG5cbmltcG9ydCBIb3N0ZWRHaXRJbmZvIGZyb20gJ2hvc3RlZC1naXQtaW5mbyc7XG5pbXBvcnQgeyBwYXJzZUNvbmZpZywgZmlsdGVyUmVtb3RlVXJsLCBmaW5kQ29uZmlnUGF0aExvY2FsIH0gZnJvbSAnQGdpdC1sYXp5L2luZm8nO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdGVkR2l0SW5mbyhvOiBSZXR1cm5UeXBlPHR5cGVvZiBwYXJzZUNvbmZpZz4pXG57XG5cdHJldHVybiBIb3N0ZWRHaXRJbmZvLmZyb21VcmwoZmlsdGVyUmVtb3RlVXJsKG8pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbnBtSG9zdGVkR2l0SW5mbyhjd2Q/OiBzdHJpbmcpXG57XG5cdGxldCBmaWxlID0gZmluZENvbmZpZ1BhdGhMb2NhbChjd2QpXG5cblx0aWYgKGZpbGUgIT0gbnVsbClcblx0e1xuXHRcdGxldCBvID0gcGFyc2VDb25maWcoZmlsZSlcblxuXHRcdGxldCBpbmZvID0gZ2V0SG9zdGVkR2l0SW5mbyhvKVxuXG5cdFx0cmV0dXJuIG5wbUhvc3RlZEdpdEluZm9Db3JlKGluZm8pXG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5wbUhvc3RlZEdpdEluZm9Db3JlKGluZm86IEhvc3RlZEdpdEluZm8pXG57XG5cdHJldHVybiB7XG5cdFx0aG9tZXBhZ2U6IGluZm8uZG9jcyh7XG5cdFx0XHRub0NvbW1pdHRpc2g6IHRydWUsXG5cdFx0fSksXG5cdFx0YnVnczogaW5mby5idWdzKHtcblx0XHRcdG5vQ29tbWl0dGlzaDogdHJ1ZSxcblx0XHR9KSxcblx0XHRyZXBvc2l0b3J5OiBpbmZvLmh0dHBzKHtcblx0XHRcdG5vQ29tbWl0dGlzaDogdHJ1ZSxcblx0XHR9KSxcblxuXHRcdF86IGluZm8sXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbnBtSG9zdGVkR2l0SW5mb1xuIl19