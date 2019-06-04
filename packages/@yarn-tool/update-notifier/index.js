"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateNotifier(__dirname, force) {
    if (force || /node_modules/i.test(__dirname) || !require('is-npx')()) {
        const _updateNotifier = require('update-notifier');
        const pkg = require(require('path').join(__dirname, '../package.json'));
        return _updateNotifier({ pkg }).notify({
            shouldNotifyInNpmScript: true,
        });
    }
}
exports.updateNotifier = updateNotifier;
exports.default = updateNotifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLFNBQWdCLGNBQWMsQ0FBQyxTQUFpQixFQUFFLEtBQWU7SUFFaEUsSUFBSSxLQUFLLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUNwRTtRQUNDLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFDeEUsT0FBTyxlQUFlLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQztZQUN0Qyx1QkFBdUIsRUFBRSxJQUFJO1NBQzdCLENBQUMsQ0FBQztLQUNIO0FBQ0YsQ0FBQztBQVZELHdDQVVDO0FBRUQsa0JBQWUsY0FBYyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlTm90aWZpZXIoX19kaXJuYW1lOiBzdHJpbmcsIGZvcmNlPzogYm9vbGVhbilcbntcblx0aWYgKGZvcmNlIHx8IC9ub2RlX21vZHVsZXMvaS50ZXN0KF9fZGlybmFtZSkgfHwgIXJlcXVpcmUoJ2lzLW5weCcpKCkpXG5cdHtcblx0XHRjb25zdCBfdXBkYXRlTm90aWZpZXIgPSByZXF1aXJlKCd1cGRhdGUtbm90aWZpZXInKTtcblx0XHRjb25zdCBwa2cgPSByZXF1aXJlKHJlcXVpcmUoJ3BhdGgnKS5qb2luKF9fZGlybmFtZSwgJy4uL3BhY2thZ2UuanNvbicpKTtcblx0XHRyZXR1cm4gX3VwZGF0ZU5vdGlmaWVyKHsgcGtnIH0pLm5vdGlmeSh7XG5cdFx0XHRzaG91bGROb3RpZnlJbk5wbVNjcmlwdDogdHJ1ZSxcblx0XHR9KTtcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGVOb3RpZmllclxuIl19