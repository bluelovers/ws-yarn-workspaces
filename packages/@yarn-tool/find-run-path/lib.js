"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const find_root_1 = __importDefault(require("@yarn-tool/find-root"));
const core_1 = __importDefault(require("./core"));
const path_key_1 = __importDefault(require("path-key"));
function findBinPath(options = {}) {
    let { cwd = process.cwd(), stopPath, } = options;
    if (!options.cwd || typeof stopPath === 'boolean' || !stopPath) {
        let rootData = find_root_1.default({
            cwd,
        });
        if (stopPath === true || stopPath == null) {
            stopPath = [rootData.root];
        }
        else if (!stopPath) {
            stopPath = [];
        }
        if (!options.cwd) {
            cwd = rootData.pkg;
        }
    }
    let { history, result } = core_1.default({
        ...options,
        cwd,
        stopPath,
    });
    return {
        result,
        history,
    };
}
exports.findBinPath = findBinPath;
function getExePath(options) {
    let { cwd = process.cwd(), execPath = process.execPath, } = options;
    return path_1.resolve(cwd, execPath, '..');
}
exports.getExePath = getExePath;
function processRunPathCore(options = {}) {
    const pathKey = path_key_1.default();
    let processEnv = (options.processEnv || process.env);
    let { cwd = process.cwd(), execPath = process.execPath, envPath = processEnv[pathKey], } = options;
    let { result } = findBinPath(options);
    const execPathDir = getExePath({
        cwd,
        execPath,
    });
    return {
        pathKey,
        envPath,
        binPaths: result,
        execPath: execPathDir,
        delimiter: path_1.delimiter,
        processEnv,
    };
}
exports.processRunPathCore = processRunPathCore;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGliLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGliLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0JBQTBDO0FBQzFDLHFFQUE0QztBQUM1QyxrREFBcUM7QUFFckMsd0RBQStCO0FBRS9CLFNBQWdCLFdBQVcsQ0FBQyxVQUErQixFQUFFO0lBRTVELElBQUksRUFDSCxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUNuQixRQUFRLEdBQ1IsR0FBRyxPQUFPLENBQUM7SUFFWixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxPQUFPLFFBQVEsS0FBSyxTQUFTLElBQUksQ0FBQyxRQUFRLEVBQzlEO1FBQ0MsSUFBSSxRQUFRLEdBQUcsbUJBQVEsQ0FBQztZQUN2QixHQUFHO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLEtBQUssSUFBSSxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQ3pDO1lBQ0MsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQzFCO2FBQ0ksSUFBSSxDQUFDLFFBQVEsRUFDbEI7WUFDQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1NBQ2Q7UUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFDaEI7WUFDQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQztTQUNuQjtLQUNEO0lBRUQsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxjQUFlLENBQUM7UUFDekMsR0FBRyxPQUFPO1FBQ1YsR0FBRztRQUNILFFBQVE7S0FDUixDQUFDLENBQUM7SUFFSCxPQUFPO1FBQ04sTUFBTTtRQUNOLE9BQU87S0FDUCxDQUFBO0FBQ0YsQ0FBQztBQXRDRCxrQ0FzQ0M7QUFFRCxTQUFnQixVQUFVLENBQUMsT0FBK0I7SUFFekQsSUFBSSxFQUNILEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQ25CLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxHQUMzQixHQUFHLE9BQU8sQ0FBQztJQUVaLE9BQU8sY0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFDcEMsQ0FBQztBQVJELGdDQVFDO0FBRUQsU0FBZ0Isa0JBQWtCLENBQWlCLFVBQXFDLEVBQUU7SUFFekYsTUFBTSxPQUFPLEdBQUcsa0JBQU8sRUFBRSxDQUFDO0lBRTFCLElBQUksVUFBVSxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFhLENBQUM7SUFFakUsSUFBSSxFQUNILEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQ25CLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUMzQixPQUFPLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUM3QixHQUFHLE9BQU8sQ0FBQztJQUVaLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFdEMsTUFBTSxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLEdBQUc7UUFDSCxRQUFRO0tBQ1IsQ0FBQyxDQUFDO0lBRUgsT0FBTztRQUNOLE9BQU87UUFDUCxPQUFPO1FBQ1AsUUFBUSxFQUFFLE1BQU07UUFDaEIsUUFBUSxFQUFFLFdBQVc7UUFDckIsU0FBUyxFQUFULGdCQUFTO1FBQ1QsVUFBVTtLQUNWLENBQUM7QUFDSCxDQUFDO0FBM0JELGdEQTJCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlc29sdmUsIGRlbGltaXRlciB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgZmluZFJvb3QgZnJvbSAnQHlhcm4tdG9vbC9maW5kLXJvb3QnO1xuaW1wb3J0IGZpbmRCaW5QYXRoQ29yZSBmcm9tICcuL2NvcmUnO1xuaW1wb3J0IHsgSU9wdGlvbnNHZXRSdW5QYXRoQ29yZSwgSU9wdGlvbnNGaW5kQmluUGF0aCwgUHJvY2Vzc0VudiB9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IFBhdGhLZXkgZnJvbSAncGF0aC1rZXknO1xuXG5leHBvcnQgZnVuY3Rpb24gZmluZEJpblBhdGgob3B0aW9uczogSU9wdGlvbnNGaW5kQmluUGF0aCA9IHt9KVxue1xuXHRsZXQge1xuXHRcdGN3ZCA9IHByb2Nlc3MuY3dkKCksXG5cdFx0c3RvcFBhdGgsXG5cdH0gPSBvcHRpb25zO1xuXG5cdGlmICghb3B0aW9ucy5jd2QgfHwgdHlwZW9mIHN0b3BQYXRoID09PSAnYm9vbGVhbicgfHwgIXN0b3BQYXRoKVxuXHR7XG5cdFx0bGV0IHJvb3REYXRhID0gZmluZFJvb3Qoe1xuXHRcdFx0Y3dkLFxuXHRcdH0pO1xuXG5cdFx0aWYgKHN0b3BQYXRoID09PSB0cnVlIHx8IHN0b3BQYXRoID09IG51bGwpXG5cdFx0e1xuXHRcdFx0c3RvcFBhdGggPSBbcm9vdERhdGEucm9vdF1cblx0XHR9XG5cdFx0ZWxzZSBpZiAoIXN0b3BQYXRoKVxuXHRcdHtcblx0XHRcdHN0b3BQYXRoID0gW107XG5cdFx0fVxuXG5cdFx0aWYgKCFvcHRpb25zLmN3ZClcblx0XHR7XG5cdFx0XHRjd2QgPSByb290RGF0YS5wa2c7XG5cdFx0fVxuXHR9XG5cblx0bGV0IHsgaGlzdG9yeSwgcmVzdWx0IH0gPSBmaW5kQmluUGF0aENvcmUoe1xuXHRcdC4uLm9wdGlvbnMsXG5cdFx0Y3dkLFxuXHRcdHN0b3BQYXRoLFxuXHR9KTtcblxuXHRyZXR1cm4ge1xuXHRcdHJlc3VsdCxcblx0XHRoaXN0b3J5LFxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFeGVQYXRoKG9wdGlvbnM6IElPcHRpb25zR2V0UnVuUGF0aENvcmUpXG57XG5cdGxldCB7XG5cdFx0Y3dkID0gcHJvY2Vzcy5jd2QoKSxcblx0XHRleGVjUGF0aCA9IHByb2Nlc3MuZXhlY1BhdGgsXG5cdH0gPSBvcHRpb25zO1xuXG5cdHJldHVybiByZXNvbHZlKGN3ZCwgZXhlY1BhdGgsICcuLicpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9jZXNzUnVuUGF0aENvcmU8UCA9IFByb2Nlc3NFbnY+KG9wdGlvbnM6IElPcHRpb25zR2V0UnVuUGF0aENvcmU8UD4gPSB7fSlcbntcblx0Y29uc3QgcGF0aEtleSA9IFBhdGhLZXkoKTtcblxuXHRsZXQgcHJvY2Vzc0VudiA9IChvcHRpb25zLnByb2Nlc3NFbnYgfHwgcHJvY2Vzcy5lbnYpIGFzIGFueSBhcyBQO1xuXG5cdGxldCB7XG5cdFx0Y3dkID0gcHJvY2Vzcy5jd2QoKSxcblx0XHRleGVjUGF0aCA9IHByb2Nlc3MuZXhlY1BhdGgsXG5cdFx0ZW52UGF0aCA9IHByb2Nlc3NFbnZbcGF0aEtleV0sXG5cdH0gPSBvcHRpb25zO1xuXG5cdGxldCB7IHJlc3VsdCB9ID0gZmluZEJpblBhdGgob3B0aW9ucyk7XG5cblx0Y29uc3QgZXhlY1BhdGhEaXIgPSBnZXRFeGVQYXRoKHtcblx0XHRjd2QsXG5cdFx0ZXhlY1BhdGgsXG5cdH0pO1xuXG5cdHJldHVybiB7XG5cdFx0cGF0aEtleSxcblx0XHRlbnZQYXRoLFxuXHRcdGJpblBhdGhzOiByZXN1bHQsXG5cdFx0ZXhlY1BhdGg6IGV4ZWNQYXRoRGlyLFxuXHRcdGRlbGltaXRlcixcblx0XHRwcm9jZXNzRW52LFxuXHR9O1xufVxuIl19