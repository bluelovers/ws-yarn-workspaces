"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function notNpxMaybe(__dirname) {
    return __dirname && /node_modules/i.test(__dirname) || __dirname && /ypx_/i.test(__dirname) || !require('@yarn-tool/is-npx').isNpx({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLCtCQUE0QjtBQUU1QixTQUFnQixXQUFXLENBQUMsU0FBaUI7SUFFNUMsT0FBTyxTQUFTLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxTQUFTLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNsSSxTQUFTO0tBQ1QsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQUxELGtDQUtDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLFNBQTRCLEVBQUUsS0FBZSxFQUFFLGtCQUE2QztJQUUxSCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQzVCO1FBQ0MsU0FBUyxHQUFHLFdBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0tBQy9CO0lBRUQsSUFBSSxLQUFLLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUN0RDtRQUNDLElBQUksYUFBYSxHQUE2QjtZQUM3Qyx1QkFBdUIsRUFBRSxJQUFJO1lBQzdCLEdBQUcsa0JBQWtCO1NBQ3JCLENBQUM7UUFFRixNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQW9CLENBQUM7UUFDdEUsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDckUsTUFBTSxHQUFHLEdBQUcsZUFBZSxDQUFDO1lBQzNCLEdBQUcsYUFBYTtZQUNoQixHQUFHO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUxQixPQUFPLEdBQUcsQ0FBQztLQUNYO0lBRUQsT0FBTyxJQUFJLENBQUE7QUFDWixDQUFDO0FBM0JELHdDQTJCQztBQUVELGtCQUFlLGNBQWMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IHR5cGUgSVVwZGF0ZU5vdGlmaWVyID0gdHlwZW9mIGltcG9ydCgndXBkYXRlLW5vdGlmaWVyJyk7XG5leHBvcnQgdHlwZSBJVXBkYXRlTm90aWZpZXJPYmplY3QgPSBSZXR1cm5UeXBlPElVcGRhdGVOb3RpZmllcj47XG5pbXBvcnQgeyBOb3RpZnlPcHRpb25zLCBTZXR0aW5ncyB9IGZyb20gJ3VwZGF0ZS1ub3RpZmllcic7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSAncGF0aCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3ROcHhNYXliZShfX2Rpcm5hbWU6IHN0cmluZyk6IGJvb2xlYW5cbntcblx0cmV0dXJuIF9fZGlybmFtZSAmJiAvbm9kZV9tb2R1bGVzL2kudGVzdChfX2Rpcm5hbWUpIHx8IF9fZGlybmFtZSAmJiAveXB4Xy9pLnRlc3QoX19kaXJuYW1lKSB8fCAhcmVxdWlyZSgnQHlhcm4tdG9vbC9pcy1ucHgnKS5pc05weCh7XG5cdFx0X19kaXJuYW1lLFxuXHR9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTm90aWZpZXIoX19kaXJuYW1lOiBzdHJpbmcgfCBzdHJpbmdbXSwgZm9yY2U/OiBib29sZWFuLCBpbnB1dE5vdGljZU9wdGlvbnM/OiBTZXR0aW5ncyAmIE5vdGlmeU9wdGlvbnMpOiBJVXBkYXRlTm90aWZpZXJPYmplY3Rcbntcblx0aWYgKEFycmF5LmlzQXJyYXkoX19kaXJuYW1lKSlcblx0e1xuXHRcdF9fZGlybmFtZSA9IGpvaW4oLi4uX19kaXJuYW1lKTtcblx0fVxuXG5cdGlmIChmb3JjZSB8fCAoZm9yY2UgPT0gbnVsbCkgJiYgbm90TnB4TWF5YmUoX19kaXJuYW1lKSlcblx0e1xuXHRcdGxldCBub3RpY2VPcHRpb25zOiBTZXR0aW5ncyAmIE5vdGlmeU9wdGlvbnMgPSB7XG5cdFx0XHRzaG91bGROb3RpZnlJbk5wbVNjcmlwdDogdHJ1ZSxcblx0XHRcdC4uLmlucHV0Tm90aWNlT3B0aW9ucyxcblx0XHR9O1xuXG5cdFx0Y29uc3QgX3VwZGF0ZU5vdGlmaWVyID0gcmVxdWlyZSgndXBkYXRlLW5vdGlmaWVyJykgYXMgSVVwZGF0ZU5vdGlmaWVyO1xuXHRcdGNvbnN0IHBrZyA9IHJlcXVpcmUocmVxdWlyZSgncGF0aCcpLmpvaW4oX19kaXJuYW1lLCAncGFja2FnZS5qc29uJykpO1xuXHRcdGNvbnN0IG9iaiA9IF91cGRhdGVOb3RpZmllcih7XG5cdFx0XHQuLi5ub3RpY2VPcHRpb25zLFxuXHRcdFx0cGtnLFxuXHRcdH0pO1xuXG5cdFx0b2JqLm5vdGlmeShub3RpY2VPcHRpb25zKTtcblxuXHRcdHJldHVybiBvYmo7XG5cdH1cblxuXHRyZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGVOb3RpZmllclxuIl19