"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateNotifier(__dirname, force) {
    if (force || /node_modules/i.test(__dirname) || !require('@yarn-tool/is-npx').isNpx({
        __dirname,
    })) {
        const _updateNotifier = require('update-notifier');
        const pkg = require(require('path').join(__dirname, 'package.json'));
        return _updateNotifier({ pkg }).notify({
            // @ts-ignore
            shouldNotifyInNpmScript: true,
        });
    }
}
exports.updateNotifier = updateNotifier;
exports.default = updateNotifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLFNBQWdCLGNBQWMsQ0FBQyxTQUFpQixFQUFFLEtBQWU7SUFFaEUsSUFBSSxLQUFLLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNuRixTQUFTO0tBQ1QsQ0FBQyxFQUNGO1FBQ0MsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFxQyxDQUFDO1FBQ3ZGLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLE9BQU8sZUFBZSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDdEMsYUFBYTtZQUNiLHVCQUF1QixFQUFFLElBQUk7U0FDN0IsQ0FBQyxDQUFDO0tBQ0g7QUFDRixDQUFDO0FBYkQsd0NBYUM7QUFFRCxrQkFBZSxjQUFjLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVOb3RpZmllcihfX2Rpcm5hbWU6IHN0cmluZywgZm9yY2U/OiBib29sZWFuKTogdm9pZFxue1xuXHRpZiAoZm9yY2UgfHwgL25vZGVfbW9kdWxlcy9pLnRlc3QoX19kaXJuYW1lKSB8fCAhcmVxdWlyZSgnQHlhcm4tdG9vbC9pcy1ucHgnKS5pc05weCh7XG5cdFx0X19kaXJuYW1lLFxuXHR9KSlcblx0e1xuXHRcdGNvbnN0IF91cGRhdGVOb3RpZmllciA9IHJlcXVpcmUoJ3VwZGF0ZS1ub3RpZmllcicpIGFzIHR5cGVvZiBpbXBvcnQoJ3VwZGF0ZS1ub3RpZmllcicpO1xuXHRcdGNvbnN0IHBrZyA9IHJlcXVpcmUocmVxdWlyZSgncGF0aCcpLmpvaW4oX19kaXJuYW1lLCAncGFja2FnZS5qc29uJykpO1xuXHRcdHJldHVybiBfdXBkYXRlTm90aWZpZXIoeyBwa2cgfSkubm90aWZ5KHtcblx0XHRcdC8vIEB0cy1pZ25vcmVcblx0XHRcdHNob3VsZE5vdGlmeUluTnBtU2NyaXB0OiB0cnVlLFxuXHRcdH0pO1xuXHR9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZU5vdGlmaWVyXG4iXX0=