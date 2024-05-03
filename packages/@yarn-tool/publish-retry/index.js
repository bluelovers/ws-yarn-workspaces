"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishRetry = publishRetry;
const tslib_1 = require("tslib");
const ws_pkg_list_1 = require("ws-pkg-list");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const is_published_1 = require("@yarn-tool/is-published");
const cross_spawn_extra_1 = require("cross-spawn-extra");
const logger_1 = require("debug-color2/logger");
async function publishRetry(cwd) {
    return bluebird_1.default.resolve((0, ws_pkg_list_1.wsPkgListable)(cwd))
        .mapSeries(async (row) => {
        const { location: cwd } = row;
        let bool = await (0, is_published_1.isPublishedByPackageJSON)(row);
        if (!bool) {
            logger_1.consoleLogger.bgYellow.red.info(`try to publish ${row.name}@${row.version}`);
            const cp = await (0, cross_spawn_extra_1.async)('npm', [
                'publish',
            ], {
                cwd,
                stdio: 'inherit',
            });
            logger_1.consoleLogger.log(cp.status, cp.error);
            await bluebird_1.default.delay(1000);
        }
    });
}
exports.default = publishRetry;
//# sourceMappingURL=index.js.map