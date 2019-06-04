"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function updateNotifier(__dirname, force) {
    if (force || /node_modules/i.test(__dirname) || !require('is-npx')()) {
        const _updateNotifier = require('update-notifier');
        const pkg = require(require('path').join(__dirname, 'package.json'));
        return _updateNotifier({ pkg }).notify({
            shouldNotifyInNpmScript: true,
        });
    }
}
exports.updateNotifier = updateNotifier;
exports.default = updateNotifier;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLFNBQWdCLGNBQWMsQ0FBQyxTQUFpQixFQUFFLEtBQWU7SUFFaEUsSUFBSSxLQUFLLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUNwRTtRQUNDLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLE9BQU8sZUFBZSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDdEMsdUJBQXVCLEVBQUUsSUFBSTtTQUM3QixDQUFDLENBQUM7S0FDSDtBQUNGLENBQUM7QUFWRCx3Q0FVQztBQUVELGtCQUFlLGNBQWMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZU5vdGlmaWVyKF9fZGlybmFtZTogc3RyaW5nLCBmb3JjZT86IGJvb2xlYW4pXG57XG5cdGlmIChmb3JjZSB8fCAvbm9kZV9tb2R1bGVzL2kudGVzdChfX2Rpcm5hbWUpIHx8ICFyZXF1aXJlKCdpcy1ucHgnKSgpKVxuXHR7XG5cdFx0Y29uc3QgX3VwZGF0ZU5vdGlmaWVyID0gcmVxdWlyZSgndXBkYXRlLW5vdGlmaWVyJyk7XG5cdFx0Y29uc3QgcGtnID0gcmVxdWlyZShyZXF1aXJlKCdwYXRoJykuam9pbihfX2Rpcm5hbWUsICdwYWNrYWdlLmpzb24nKSk7XG5cdFx0cmV0dXJuIF91cGRhdGVOb3RpZmllcih7IHBrZyB9KS5ub3RpZnkoe1xuXHRcdFx0c2hvdWxkTm90aWZ5SW5OcG1TY3JpcHQ6IHRydWUsXG5cdFx0fSk7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlTm90aWZpZXJcbiJdfQ==