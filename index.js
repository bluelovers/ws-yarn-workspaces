"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./lib/util");
const fs = require("fs-extra");
const hashSum = require("hash-sum");
const os = require("os");
const path = require("path");
const bluebird = require("bluebird");
/**
 * fn[] of any function return a string
 * stop when get first return
 */
exports.defaultOrder = [
    findPkgModulePath,
    findNpmCachePath,
    os.tmpdir,
];
/**
 * a base dir name at cache root
 */
exports.defaultBase = '.cache';
function getCachePath(options, opt) {
    if (typeof options === 'string') {
        options = {
            ...opt,
            name: options,
        };
    }
    options = options || {};
    let root = getCacheRoot(options);
    let base = options.base || exports.defaultBase;
    let name = options.name;
    let dir;
    if (name) {
        name = normalizeName(name, options.hash);
        dir = path.join(root, base, name);
    }
    else {
        dir = path.join(root, base);
    }
    if (options.create) {
        fs.ensureDirSync(dir);
    }
    if (options.thunk) {
        // @ts-ignore
        let fn = (...args) => path.join(dir, ...args);
        // @ts-ignore
        fn.dir = dir;
        return fn;
    }
    return dir;
}
exports.getCachePath = getCachePath;
function getCachePathAsync(options, opt) {
    return bluebird.resolve()
        .then(async function () {
        if (typeof options === 'string') {
            options = {
                ...opt,
                name: options,
            };
        }
        options = options || {};
        let root = await getCacheRootAsync(options);
        let base = options.base || exports.defaultBase;
        let name = options.name;
        let dir;
        if (name) {
            name = normalizeName(name, options.hash);
            dir = path.join(root, base, name);
        }
        else {
            dir = path.join(root, base);
        }
        if (options.create) {
            await fs.ensureDir(dir);
        }
        if (options.thunk) {
            // @ts-ignore
            let fn = (...args) => path.join(dir, ...args);
            // @ts-ignore
            fn.dir = dir;
            return fn;
        }
        return dir;
    });
}
exports.getCachePathAsync = getCachePathAsync;
/**
 * normalize cache name
 */
function normalizeName(name, hash) {
    if (hash) {
        if (typeof hash === 'function') {
            return hash(name);
        }
        return hashSum(name);
    }
    return name
        .trim()
        .replace(/[^\w\-\.]/g, '_')
        .replace(/\.+/g, '_')
        .replace(/_+/g, '_');
}
exports.normalizeName = normalizeName;
function getCacheRoot(options) {
    if (typeof options === 'string') {
        options = {
            cwd: options,
        };
    }
    options = options || {};
    let cwd = options.cwd || process.cwd();
    let fnOrder = options.fnOrder || exports.defaultOrder;
    if (!options.disableDefaultFailback && options.fnOrder && fnOrder != exports.defaultOrder) {
        fnOrder = fnOrder.concat(exports.defaultOrder);
    }
    let dir;
    fnOrder.some(function (fn) {
        // @ts-ignore
        dir = fn(cwd);
        let bool = !!dir;
        if (bool && typeof dir !== 'string') {
            throw new TypeError(`expect string but got '${typeof dir}', ${dir}`);
        }
        return bool;
    });
    if (!dir) {
        throw new Error(`can't found cache path`);
    }
    else if (typeof dir != 'string') {
        throw new Error(`not a path '${dir}'`);
    }
    else if (!fs.existsSync(dir)) {
        if (options.create) {
            fs.ensureDirSync(dir);
        }
        else {
            throw new Error(`path not exists '${dir}'`);
        }
    }
    return path.resolve(dir);
}
exports.getCacheRoot = getCacheRoot;
function getCacheRootAsync(options) {
    return bluebird.resolve()
        .then(async function () {
        if (typeof options === 'string') {
            options = {
                cwd: options,
            };
        }
        options = options || {};
        let cwd = options.cwd || process.cwd();
        let fnOrder = options.fnOrder || exports.defaultOrder;
        if (!options.disableDefaultFailback && options.fnOrder && fnOrder != exports.defaultOrder) {
            fnOrder = fnOrder.concat(exports.defaultOrder);
        }
        let dir;
        for (let fn of fnOrder) {
            dir = await fn(cwd);
            if (dir) {
                if (typeof dir !== 'string') {
                    throw new TypeError(`expect string but got '${typeof dir}', ${dir}`);
                }
                break;
            }
        }
        if (!dir) {
            throw new Error(`can't found cache path`);
        }
        else if (!fs.existsSync(dir)) {
            throw new Error(`path not exists '${dir}'`);
        }
        return path.resolve(dir);
    });
}
exports.getCacheRootAsync = getCacheRootAsync;
/**
 * get os temp dir
 */
function getOSTempPath(cwd) {
    return os.tmpdir();
}
exports.getOSTempPath = getOSTempPath;
/**
 * try get a pkg/node_modules
 */
function findPkgModulePath(cwd) {
    let dir = util_1.findPkgPath(cwd);
    return path.join(dir, 'node_modules');
}
exports.findPkgModulePath = findPkgModulePath;
/**
 * try get npm global cache path
 */
function findNpmCachePath(cwd) {
    let cache = util_1.spawn_stdout('npm', [
        'config', 'get', 'cache',
    ]);
    if (!cache || !cache.length) {
        cache = util_1.spawn_stdout('yarn', [
            'config', 'get', 'cache',
        ]);
    }
    if (!cache) {
        return null;
    }
    if (!fs.existsSync(cache)) {
        throw new Error(`path not exists '${cache}'`);
    }
    return cache;
}
exports.findNpmCachePath = findNpmCachePath;
exports.default = getCachePath;
// @ts-ignore
exports = util_1.ObjectFreezeAll(exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUF3RTtBQUN4RSwrQkFBZ0M7QUFDaEMsb0NBQXFDO0FBQ3JDLHlCQUEwQjtBQUMxQiw2QkFBOEI7QUFDOUIscUNBQXNDO0FBRXRDOzs7R0FHRztBQUNVLFFBQUEsWUFBWSxHQUFHO0lBQzNCLGlCQUFpQjtJQUNqQixnQkFBZ0I7SUFDaEIsRUFBRSxDQUFDLE1BQU07Q0FDVCxDQUFDO0FBRUY7O0dBRUc7QUFDVSxRQUFBLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFzRHBDLFNBQWdCLFlBQVksQ0FBQyxPQUFrQixFQUFFLEdBQUk7SUFFcEQsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQy9CO1FBQ0MsT0FBTyxHQUFHO1lBQ1QsR0FBRyxHQUFHO1lBQ04sSUFBSSxFQUFFLE9BQU87U0FDYixDQUFBO0tBQ0Q7SUFDRCxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUV4QixJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksSUFBSSxtQkFBVyxDQUFDO0lBQ3ZDLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFFeEIsSUFBSSxHQUFXLENBQUM7SUFFaEIsSUFBSSxJQUFJLEVBQ1I7UUFDQyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUNsQztTQUVEO1FBQ0MsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzVCO0lBRUQsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUNsQjtR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ZSxZQUFZLENBQUE7QUFFM0IsYUFBYTtBQUNiLE9BQU8sR0FBRyxzQkFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZmluZFBrZ1BhdGgsIE9iamVjdEZyZWV6ZUFsbCwgc3Bhd25fc3Rkb3V0IH0gZnJvbSAnLi9saWIvdXRpbCc7XG5pbXBvcnQgZnMgPSByZXF1aXJlKCdmcy1leHRyYScpO1xuaW1wb3J0IGhhc2hTdW0gPSByZXF1aXJlKCdoYXNoLXN1bScpO1xuaW1wb3J0IG9zID0gcmVxdWlyZSgnb3MnKTtcbmltcG9ydCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuaW1wb3J0IGJsdWViaXJkID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcblxuLyoqXG4gKiBmbltdIG9mIGFueSBmdW5jdGlvbiByZXR1cm4gYSBzdHJpbmdcbiAqIHN0b3Agd2hlbiBnZXQgZmlyc3QgcmV0dXJuXG4gKi9cbmV4cG9ydCBjb25zdCBkZWZhdWx0T3JkZXIgPSBbXG5cdGZpbmRQa2dNb2R1bGVQYXRoLFxuXHRmaW5kTnBtQ2FjaGVQYXRoLFxuXHRvcy50bXBkaXIsXG5dO1xuXG4vKipcbiAqIGEgYmFzZSBkaXIgbmFtZSBhdCBjYWNoZSByb290XG4gKi9cbmV4cG9ydCBjb25zdCBkZWZhdWx0QmFzZSA9ICcuY2FjaGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElPcHRpb25zXG57XG5cdC8qKlxuXHQgKiBhIGJhc2UgZGlyIG5hbWUgYXQgY2FjaGUgcm9vdFxuXHQgKi9cblx0YmFzZT86IHN0cmluZyxcblx0LyoqXG5cdCAqIG5hbWUgb2YgY2FjaGVcblx0ICovXG5cdG5hbWU/OiBzdHJpbmcsXG5cblx0Y3dkPzogc3RyaW5nLFxuXG5cdC8qKlxuXHQgKiBmbltdIG9mIGFueSBmdW5jdGlvbiByZXR1cm4gYSBzdHJpbmdcblx0ICogc3RvcCB3aGVuIGdldCBmaXJzdCByZXR1cm5cblx0ICovXG5cdGZuT3JkZXI/OiBBcnJheTwoKGN3ZD86IHN0cmluZykgPT4gc3RyaW5nKSB8ICgoY3dkPzogc3RyaW5nKSA9PiBhbnkpPixcblxuXHQvKipcblx0ICogYXV0byBjcmVhdGUgZGlyIGlmIG5vdCBleGlzdHNcblx0ICovXG5cdGNyZWF0ZT86IGJvb2xlYW4sXG5cdC8qKlxuXHQgKiByZXR1cm4gYSBmdW5jdGlvblxuXHQgKi9cblx0dGh1bms/OiBib29sZWFuLFxuXG5cdC8qKlxuXHQgKiBoYXNoIGRpciBuYW1lLCBtYWtlIHN1cmUgaXQgaXMgdW5pcXVlXG5cdCAqL1xuXHRoYXNoPzogYm9vbGVhbiB8ICgoaW5wdXQ6IHN0cmluZykgPT4gc3RyaW5nKSxcblxuXHQvKipcblx0ICogb25seSB3b3JrIHdpdGggZm5PcmRlciBpcyBzZXRcblx0ICpcblx0ICogaWYgdHJ1ZSB3aWxsIG5vdCB1c2UgZGVmYXVsdE9yZGVyIHdoZW4gZGlkbid0IGdldCB2YWx1ZSBmcm9tIGZuT3JkZXJcblx0ICovXG5cdGRpc2FibGVEZWZhdWx0RmFpbGJhY2s/OiBib29sZWFuLFxufVxuXG5leHBvcnQgdHlwZSBJQ2FjaGVQYXRoVGh1bmsgPSAoKHAxPzogc3RyaW5nLCAuLi5hcmdzOiBzdHJpbmdbXSkgPT4gc3RyaW5nKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENhY2hlUGF0aChvcHRpb25zPzogSU9wdGlvbnMgJiB7XG5cdHRodW5rOiB0cnVlLFxufSk6IElDYWNoZVBhdGhUaHVua1xuLy8gQHRzLWlnbm9yZVxuZXhwb3J0IGZ1bmN0aW9uIGdldENhY2hlUGF0aChuYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBJT3B0aW9ucyAmIHtcblx0dGh1bms6IHRydWUsXG59KTogSUNhY2hlUGF0aFRodW5rXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FjaGVQYXRoKG5hbWU6IHN0cmluZywgb3B0aW9ucz86IElPcHRpb25zKTogc3RyaW5nXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FjaGVQYXRoKG9wdGlvbnM/OiBJT3B0aW9ucyk6IHN0cmluZ1xuZXhwb3J0IGZ1bmN0aW9uIGdldENhY2hlUGF0aChvcHRpb25zPzogSU9wdGlvbnMsIG9wdD8pXG57XG5cdGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpXG5cdHtcblx0XHRvcHRpb25zID0ge1xuXHRcdFx0Li4ub3B0LFxuXHRcdFx0bmFtZTogb3B0aW9ucyxcblx0XHR9XG5cdH1cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cblx0bGV0IHJvb3QgPSBnZXRDYWNoZVJvb3Qob3B0aW9ucyk7XG5cdGxldCBiYXNlID0gb3B0aW9ucy5iYXNlIHx8IGRlZmF1bHRCYXNlO1xuXHRsZXQgbmFtZSA9IG9wdGlvbnMubmFtZTtcblxuXHRsZXQgZGlyOiBzdHJpbmc7XG5cblx0aWYgKG5hbWUpXG5cdHtcblx0XHRuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lLCBvcHRpb25zLmhhc2gpO1xuXG5cdFx0ZGlyID0gcGF0aC5qb2luKHJvb3QsIGJhc2UsIG5hbWUpO1xuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdGRpciA9IHBhdGguam9pbihyb290LCBiYXNlKTtcblx0fVxuXG5cdGlmIChvcHRpb25zLmNyZWF0ZSlcblx0e1xuXHRcdGZzLmVuc3VyZURpclN5bmMoZGlyKTtcblx0fVxuXG5cdGlmIChvcHRpb25zLnRodW5rKVxuXHR7XG5cdFx0Ly8gQHRzLWlnbm9yZVxuXHRcdGxldCBmbjogSUNhY2hlUGF0aFRodW5rID0gKC4uLmFyZ3M6IHN0cmluZ1tdKSA9PiBwYXRoLmpvaW4oZGlyLCAuLi5hcmdzKTtcblxuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRmbi5kaXIgPSBkaXI7XG5cblx0XHRyZXR1cm4gZm47XG5cdH1cblxuXHRyZXR1cm4gZGlyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FjaGVQYXRoQXN5bmMob3B0aW9ucz86IElPcHRpb25zICYge1xuXHR0aHVuazogdHJ1ZSxcbn0pOiBibHVlYmlyZDxJQ2FjaGVQYXRoVGh1bms+XG4vLyBAdHMtaWdub3JlXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FjaGVQYXRoQXN5bmMobmFtZTogc3RyaW5nLCBvcHRpb25zPzogSU9wdGlvbnMgJiB7XG5cdHRodW5rOiB0cnVlLFxufSk6IGJsdWViaXJkPElDYWNoZVBhdGhUaHVuaz5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYWNoZVBhdGhBc3luYyhuYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBJT3B0aW9ucyk6IGJsdWViaXJkPHN0cmluZz5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYWNoZVBhdGhBc3luYyhvcHRpb25zPzogSU9wdGlvbnMpOiBibHVlYmlyZDxzdHJpbmc+XG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FjaGVQYXRoQXN5bmMob3B0aW9ucz86IElPcHRpb25zLCBvcHQ/KVxue1xuXHRyZXR1cm4gYmx1ZWJpcmQucmVzb2x2ZSgpXG5cdFx0LnRoZW4oYXN5bmMgZnVuY3Rpb24gKClcblx0XHR7XG5cdFx0XHRpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdzdHJpbmcnKVxuXHRcdFx0e1xuXHRcdFx0XHRvcHRpb25zID0ge1xuXHRcdFx0XHRcdC4uLm9wdCxcblx0XHRcdFx0XHRuYW1lOiBvcHRpb25zLFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuXHRcdFx0bGV0IHJvb3QgPSBhd2FpdCBnZXRDYWNoZVJvb3RBc3luYyhvcHRpb25zKTtcblx0XHRcdGxldCBiYXNlID0gb3B0aW9ucy5iYXNlIHx8IGRlZmF1bHRCYXNlO1xuXHRcdFx0bGV0IG5hbWUgPSBvcHRpb25zLm5hbWU7XG5cblx0XHRcdGxldCBkaXI6IHN0cmluZztcblxuXHRcdFx0aWYgKG5hbWUpXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUsIG9wdGlvbnMuaGFzaCk7XG5cblx0XHRcdFx0ZGlyID0gcGF0aC5qb2luKHJvb3QsIGJhc2UsIG5hbWUpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRkaXIgPSBwYXRoLmpvaW4ocm9vdCwgYmFzZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvcHRpb25zLmNyZWF0ZSlcblx0XHRcdHtcblx0XHRcdFx0YXdhaXQgZnMuZW5zdXJlRGlyKGRpcik7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvcHRpb25zLnRodW5rKVxuXHRcdFx0e1xuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGxldCBmbjogSUNhY2hlUGF0aFRodW5rID0gKC4uLmFyZ3M6IHN0cmluZ1tdKSA9PiBwYXRoLmpvaW4oZGlyLCAuLi5hcmdzKTtcblxuXHRcdFx0XHQvLyBAdHMtaWdub3JlXG5cdFx0XHRcdGZuLmRpciA9IGRpcjtcblxuXHRcdFx0XHRyZXR1cm4gZm47XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBkaXI7XG5cdFx0fSlcblx0O1xufVxuXG4vKipcbiAqIG5vcm1hbGl6ZSBjYWNoZSBuYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWU6IHN0cmluZywgaGFzaD86IElPcHRpb25zW1wiaGFzaFwiXSk6IHN0cmluZ1xue1xuXHRpZiAoaGFzaClcblx0e1xuXHRcdGlmICh0eXBlb2YgaGFzaCA9PT0gJ2Z1bmN0aW9uJylcblx0XHR7XG5cdFx0XHRyZXR1cm4gaGFzaChuYW1lKVxuXHRcdH1cblxuXHRcdHJldHVybiBoYXNoU3VtKG5hbWUpO1xuXHR9XG5cblx0cmV0dXJuIG5hbWVcblx0XHQudHJpbSgpXG5cdFx0LnJlcGxhY2UoL1teXFx3XFwtXFwuXS9nLCAnXycpXG5cdFx0LnJlcGxhY2UoL1xcLisvZywgJ18nKVxuXHRcdC5yZXBsYWNlKC9fKy9nLCAnXycpXG5cdFx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FjaGVSb290KG5hbWU6IHN0cmluZyk6IHN0cmluZ1xuZXhwb3J0IGZ1bmN0aW9uIGdldENhY2hlUm9vdChvcHRpb25zPzogSU9wdGlvbnMgfCBzdHJpbmcpOiBzdHJpbmdcbmV4cG9ydCBmdW5jdGlvbiBnZXRDYWNoZVJvb3Qob3B0aW9ucz86IElPcHRpb25zIHwgc3RyaW5nKTogc3RyaW5nXG57XG5cdGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpXG5cdHtcblx0XHRvcHRpb25zID0ge1xuXHRcdFx0Y3dkOiBvcHRpb25zLFxuXHRcdH1cblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdGxldCBjd2QgPSBvcHRpb25zLmN3ZCB8fCBwcm9jZXNzLmN3ZCgpO1xuXHRsZXQgZm5PcmRlciA9IG9wdGlvbnMuZm5PcmRlciB8fCBkZWZhdWx0T3JkZXI7XG5cblx0aWYgKCFvcHRpb25zLmRpc2FibGVEZWZhdWx0RmFpbGJhY2sgJiYgb3B0aW9ucy5mbk9yZGVyICYmIGZuT3JkZXIgIT0gZGVmYXVsdE9yZGVyKVxuXHR7XG5cdFx0Zm5PcmRlciA9IGZuT3JkZXIuY29uY2F0KGRlZmF1bHRPcmRlcik7XG5cdH1cblxuXHRsZXQgZGlyOiBzdHJpbmc7XG5cblx0Zm5PcmRlci5zb21lKGZ1bmN0aW9uIChmbilcblx0e1xuXHRcdC8vIEB0cy1pZ25vcmVcblx0XHRkaXIgPSBmbihjd2QpO1xuXG5cdFx0bGV0IGJvb2wgPSAhIWRpcjtcblxuXHRcdGlmIChib29sICYmIHR5cGVvZiBkaXIgIT09ICdzdHJpbmcnKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYGV4cGVjdCBzdHJpbmcgYnV0IGdvdCAnJHt0eXBlb2YgZGlyfScsICR7ZGlyfWApXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGJvb2w7XG5cdH0pO1xuXG5cdGlmICghZGlyKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBjYW4ndCBmb3VuZCBjYWNoZSBwYXRoYClcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgZGlyICE9ICdzdHJpbmcnKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBub3QgYSBwYXRoICcke2Rpcn0nYClcblx0fVxuXHRlbHNlIGlmICghZnMuZXhpc3RzU3luYyhkaXIpKVxuXHR7XG5cdFx0aWYgKG9wdGlvbnMuY3JlYXRlKVxuXHRcdHtcblx0XHRcdGZzLmVuc3VyZURpclN5bmMoZGlyKVxuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBwYXRoIG5vdCBleGlzdHMgJyR7ZGlyfSdgKVxuXHRcdH1cblx0fVxuXG5cdHJldHVybiBwYXRoLnJlc29sdmUoZGlyKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2FjaGVSb290QXN5bmMobmFtZTogc3RyaW5nKTogYmx1ZWJpcmQ8c3RyaW5nPlxuZXhwb3J0IGZ1bmN0aW9uIGdldENhY2hlUm9vdEFzeW5jKG9wdGlvbnM/OiBJT3B0aW9ucyB8IHN0cmluZyk6IGJsdWViaXJkPHN0cmluZz5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDYWNoZVJvb3RBc3luYyhvcHRpb25zPzogSU9wdGlvbnMgfCBzdHJpbmcpOiBibHVlYmlyZDxzdHJpbmc+XG57XG5cdHJldHVybiBibHVlYmlyZC5yZXNvbHZlKClcblx0XHQudGhlbihhc3luYyBmdW5jdGlvbiAoKVxuXHRcdHtcblx0XHRcdGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3N0cmluZycpXG5cdFx0XHR7XG5cdFx0XHRcdG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0Y3dkOiBvcHRpb25zLFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdFx0XHRsZXQgY3dkID0gb3B0aW9ucy5jd2QgfHwgcHJvY2Vzcy5jd2QoKTtcblx0XHRcdGxldCBmbk9yZGVyID0gb3B0aW9ucy5mbk9yZGVyIHx8IGRlZmF1bHRPcmRlcjtcblxuXHRcdFx0aWYgKCFvcHRpb25zLmRpc2FibGVEZWZhdWx0RmFpbGJhY2sgJiYgb3B0aW9ucy5mbk9yZGVyICYmIGZuT3JkZXIgIT0gZGVmYXVsdE9yZGVyKVxuXHRcdFx0e1xuXHRcdFx0XHRmbk9yZGVyID0gZm5PcmRlci5jb25jYXQoZGVmYXVsdE9yZGVyKTtcblx0XHRcdH1cblxuXHRcdFx0bGV0IGRpcjogc3RyaW5nO1xuXG5cdFx0XHRmb3IgKGxldCBmbiBvZiBmbk9yZGVyKVxuXHRcdFx0e1xuXHRcdFx0XHRkaXIgPSBhd2FpdCBmbihjd2QpO1xuXG5cdFx0XHRcdGlmIChkaXIpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRpZiAodHlwZW9mIGRpciAhPT0gJ3N0cmluZycpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcihgZXhwZWN0IHN0cmluZyBidXQgZ290ICcke3R5cGVvZiBkaXJ9JywgJHtkaXJ9YClcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIWRpcilcblx0XHRcdHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKGBjYW4ndCBmb3VuZCBjYWNoZSBwYXRoYClcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCFmcy5leGlzdHNTeW5jKGRpcikpXG5cdFx0XHR7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihgcGF0aCBub3QgZXhpc3RzICcke2Rpcn0nYClcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHBhdGgucmVzb2x2ZShkaXIpXG5cdFx0fSlcblx0O1xufVxuXG4vKipcbiAqIGdldCBvcyB0ZW1wIGRpclxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0T1NUZW1wUGF0aChjd2Q/OiBzdHJpbmcpOiBzdHJpbmdcbntcblx0cmV0dXJuIG9zLnRtcGRpcigpO1xufVxuXG4vKipcbiAqIHRyeSBnZXQgYSBwa2cvbm9kZV9tb2R1bGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kUGtnTW9kdWxlUGF0aChjd2Q/OiBzdHJpbmcpOiBzdHJpbmdcbntcblx0bGV0IGRpciA9IGZpbmRQa2dQYXRoKGN3ZCk7XG5cdHJldHVybiBwYXRoLmpvaW4oZGlyLCAnbm9kZV9tb2R1bGVzJyk7XG59XG5cbi8qKlxuICogdHJ5IGdldCBucG0gZ2xvYmFsIGNhY2hlIHBhdGhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmROcG1DYWNoZVBhdGgoY3dkPzogc3RyaW5nKTogc3RyaW5nXG57XG5cdGxldCBjYWNoZSA9IHNwYXduX3N0ZG91dCgnbnBtJywgW1xuXHRcdCdjb25maWcnLCAnZ2V0JywgJ2NhY2hlJyxcblx0XSk7XG5cblx0aWYgKCFjYWNoZSB8fCAhY2FjaGUubGVuZ3RoKVxuXHR7XG5cdFx0Y2FjaGUgPSBzcGF3bl9zdGRvdXQoJ3lhcm4nLCBbXG5cdFx0XHQnY29uZmlnJywgJ2dldCcsICdjYWNoZScsXG5cdFx0XSk7XG5cdH1cblxuXHRpZiAoIWNhY2hlKVxuXHR7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRpZiAoIWZzLmV4aXN0c1N5bmMoY2FjaGUpKVxuXHR7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBwYXRoIG5vdCBleGlzdHMgJyR7Y2FjaGV9J2ApXG5cdH1cblxuXHRyZXR1cm4gY2FjaGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldENhY2hlUGF0aFxuXG4vLyBAdHMtaWdub3JlXG5leHBvcnRzID0gT2JqZWN0RnJlZXplQWxsKGV4cG9ydHMpO1xuXG4iXX0=