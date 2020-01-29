"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function notNpxMaybe(__dirname) {
    if (__dirname && /ypx_|_npx/i.test(__dirname)) {
        return false;
    }
    return !require('@yarn-tool/is-npx').isNpx({
        __dirname,
    });
}
exports.notNpxMaybe = notNpxMaybe;
function updateNotifier(__dirname, force, inputNoticeOptions) {
    if (Array.isArray(__dirname)) {
        __dirname = path_1.join(...__dirname);
    }
    if (force || (force == null) && notNpxMaybe(__dirname)) {
        let noticeOptions = {
            shouldNotifyInNpmScript: true,
            ...inputNoticeOptions,
        };
        const _updateNotifier = require('update-notifier');
        const pkg = require(require('path').join(__dirname, 'package.json'));
        const obj = _updateNotifier({
            ...noticeOptions,
            pkg,
        });
        obj.notify(noticeOptions);
        return obj;
    }
    return null;
}
exports.updateNotifier = updateNotifier;
exports.default = updateNotifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLCtCQUE0QjtBQUU1QixTQUFnQixXQUFXLENBQUMsU0FBaUI7SUFFNUMsSUFBSSxTQUFTLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFDN0M7UUFDQyxPQUFPLEtBQUssQ0FBQTtLQUNaO0lBRUQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUMxQyxTQUFTO0tBQ1QsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQVZELGtDQVVDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLFNBQTRCLEVBQUUsS0FBZSxFQUFFLGtCQUE2QztJQUUxSCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQzVCO1FBQ0MsU0FBUyxHQUFHLFdBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0tBQy9CO0lBRUQsSUFBSSxLQUFLLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUN0RDtRQUNDLElBQUksYUFBYSxHQUE2QjtZQUM3Qyx1QkFBdUIsRUFBRSxJQUFJO1lBQzdCLEdBQUcsa0JBQWtCO1NBQ3JCLENBQUM7UUFFRixNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQW9CLENBQUM7UUFDdEUsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDckUsTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDO1lBQzNCLEdBQUcsYUFBYTtZQUNoQixHQUFHO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUxQixPQUFPLEdBQUcsQ0FBQztLQUNYO0lBRUQsT0FBTyxJQUFJLENBQUE7QUFDWixDQUFDO0FBM0JELHdDQTJCQztBQUVELGtCQUFlLGNBQWMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IHR5cGUgSVVwZGF0ZU5vdGlmaWVyID0gdHlwZW9mIGltcG9ydCgndXBkYXRlLW5vdGlmaWVyJyk7XG5leHBvcnQgdHlwZSBJVXBkYXRlTm90aWZpZXJPYmplY3QgPSBSZXR1cm5UeXBlPElVcGRhdGVOb3RpZmllcj47XG5pbXBvcnQgeyBOb3RpZnlPcHRpb25zLCBTZXR0aW5ncyB9IGZyb20gJ3VwZGF0ZS1ub3RpZmllcic7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3ROcHhNYXliZShfX2Rpcm5hbWU6IHN0cmluZyk6IGJvb2xlYW5cbntcblx0aWYgKF9fZGlybmFtZSAmJiAveXB4X3xfbnB4L2kudGVzdChfX2Rpcm5hbWUpKVxuXHR7XG5cdFx0cmV0dXJuIGZhbHNlXG5cdH1cblxuXHRyZXR1cm4gIXJlcXVpcmUoJ0B5YXJuLXRvb2wvaXMtbnB4JykuaXNOcHgoe1xuXHRcdF9fZGlybmFtZSxcblx0fSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZU5vdGlmaWVyKF9fZGlybmFtZTogc3RyaW5nIHwgc3RyaW5nW10sIGZvcmNlPzogYm9vbGVhbiwgaW5wdXROb3RpY2VPcHRpb25zPzogU2V0dGluZ3MgJiBOb3RpZnlPcHRpb25zKTogSVVwZGF0ZU5vdGlmaWVyT2JqZWN0XG57XG5cdGlmIChBcnJheS5pc0FycmF5KF9fZGlybmFtZSkpXG5cdHtcblx0XHRfX2Rpcm5hbWUgPSBqb2luKC4uLl9fZGlybmFtZSk7XG5cdH1cblxuXHRpZiAoZm9yY2UgfHwgKGZvcmNlID09IG51bGwpICYmIG5vdE5weE1heWJlKF9fZGlybmFtZSkpXG5cdHtcblx0XHRsZXQgbm90aWNlT3B0aW9uczogU2V0dGluZ3MgJiBOb3RpZnlPcHRpb25zID0ge1xuXHRcdFx0c2hvdWxkTm90aWZ5SW5OcG1TY3JpcHQ6IHRydWUsXG5cdFx0XHQuLi5pbnB1dE5vdGljZU9wdGlvbnMsXG5cdFx0fTtcblxuXHRcdGNvbnN0IF91cGRhdGVOb3RpZmllciA9IHJlcXVpcmUoJ3VwZGF0ZS1ub3RpZmllcicpIGFzIElVcGRhdGVOb3RpZmllcjtcblx0XHRjb25zdCBwa2cgPSByZXF1aXJlKHJlcXVpcmUoJ3BhdGgnKS5qb2luKF9fZGlybmFtZSwgJ3BhY2thZ2UuanNvbicpKTtcblx0XHRjb25zdCBvYmogPSBfdXBkYXRlTm90aWZpZXIoe1xuXHRcdFx0Li4ubm90aWNlT3B0aW9ucyxcblx0XHRcdHBrZyxcblx0XHR9KTtcblxuXHRcdG9iai5ub3RpZnkobm90aWNlT3B0aW9ucyk7XG5cblx0XHRyZXR1cm4gb2JqO1xuXHR9XG5cblx0cmV0dXJuIG51bGxcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlTm90aWZpZXJcbiJdfQ==