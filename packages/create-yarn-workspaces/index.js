"use strict";
/**
 * Created by user on 2018/5/13/013.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirByPackages = exports.getDefaultPackageJson = exports.getDefaultTsconfig = exports._createYarnWorkspaces = exports.isSamePath = exports.createYarnWorkspaces = exports.console = void 0;
const findYarnWorkspaceRoot = require("find-yarn-workspace-root2");
const path = require("path");
const pkgDir = require("pkg-dir");
const fs = require("fs-extra");
const debug_color2_1 = require("debug-color2");
const static_file_1 = require("@yarn-tool/static-file");
exports.console = new debug_color2_1.Console2(null, {
    label: true,
    time: true,
});
function createYarnWorkspaces(cwd, options = {}) {
    if (cwd && typeof cwd != 'string') {
        options = cwd;
        cwd = options.cwd;
    }
    if (!cwd) {
        cwd = process.cwd();
    }
    cwd = path.resolve(cwd);
    let root = pkgDir.sync(cwd);
    let ws;
    try {
        // @FIXME 一個奇怪的BUG 不使用 try 的話 在 NPX 底下就會出現無訊息的停止
        ws = findYarnWorkspaceRoot(root);
    }
    catch (e) {
        exports.console.log(e.toString());
        ws = null;
    }
    let targetPath = path.resolve(root || cwd);
    options.debug && exports.console.debug({
        targetPath,
        ws,
        options,
    });
    if (!options.ignoreExistsPackage && root) {
        exports.console.error(`already have package at "${root}", or use ignoreExistsPackage for overwrite it`);
        return false;
    }
    else if (root) {
        exports.console.warn(`ignore exists package "${root}"`);
    }
    if (ws) {
        let bool = true;
        exports.console.warn(`detect exists workspace "${ws}"`);
        if (options.ignoreParentWorkspaces) {
            bool = isSamePath(targetPath, ws);
            if (!bool) {
                exports.console.warn(`ignoreParentWorkspaces = true`);
            }
            else {
                exports.console.error(`target path already is workspace`);
            }
        }
        if (bool) {
            return false;
        }
    }
    return _createYarnWorkspaces(targetPath);
}
exports.createYarnWorkspaces = createYarnWorkspaces;
function isSamePath(p1, p2) {
    if (p1 === p2) {
        return true;
    }
    else if (!p1 || !p2) {
        return false;
    }
    let s = path.relative(p1, p2);
    return (s === '.' || s === '');
}
exports.isSamePath = isSamePath;
function _createYarnWorkspaces(targetPath, options = {}) {
    exports.console.info(`create in target path "${targetPath}"`);
    let pkg;
    let lerna;
    {
        let file = path.join(targetPath, 'lerna.json');
        if (fs.existsSync(file)) {
            let json = JSON.parse(fs.readFileSync(file).toString());
            if (json.packages && !Object.keys(json.packages).length) {
                json.packages = undefined;
            }
            lerna = json;
        }
    }
    let packages = lerna && lerna.packages || [
        "packages/*",
    ];
    let file = path.join(targetPath, 'package.json');
    if (!fs.existsSync(file)) {
        let name = path.basename(targetPath);
        if (!fs.existsSync(targetPath)) {
            fs.mkdirSync(targetPath);
        }
        pkg = Object.assign(getDefaultPackageJson(name), {
            name,
            workspaces: packages,
        });
        if (options.initPackageJson) {
            let ret = options.initPackageJson(pkg);
            if (ret) {
                pkg = ret;
            }
        }
    }
    else {
        let json = JSON.parse(fs.readFileSync(file).toString());
        let workspaces;
        if (json.workspaces && Object.keys(json.workspaces).length) {
            workspaces = json.workspaces;
            // https://yarnpkg.com/blog/2018/02/15/nohoist/
            packages = workspaces.packages || workspaces;
        }
        else {
            workspaces = packages;
        }
        pkg = Object.assign(json, {
            "private": true,
            "workspaces": workspaces,
        });
        pkg.resolutions = pkg.resolutions || {};
    }
    let s = JSON.stringify(pkg, null, 2);
    fs.writeFileSync(file, s);
    exports.console.success(`create workspace package.json`);
    if (lerna && (packages != lerna.packages || lerna.npmClient !== 'yarn' || lerna.useWorkspaces !== true)) {
        let file = path.join(targetPath, 'lerna.json');
        lerna.packages = packages;
        lerna.npmClient = 'yarn';
        lerna.useWorkspaces = true;
        let s = JSON.stringify(lerna, null, 2);
        fs.writeFileSync(file, s);
        exports.console.info(`update lerna.json`);
    }
    else if (0 && !lerna) {
        let file = path.join(targetPath, 'lerna.json');
        lerna = {
            "packages": packages,
            "command": {
                "publish": {
                    "ignoreChanges": ["node_modules"],
                    "message": "chore(release): publish"
                }
            },
            "npmClient": "yarn",
            "useWorkspaces": true,
            "version": "independent",
        };
        let s = JSON.stringify(lerna, null, 2);
        fs.writeFileSync(file, s);
        exports.console.success(`create lerna.json`);
    }
    /*
    if (!fs.existsSync(path.join(targetPath, 'tsconfig.json')))
    {
        fs.writeFileSync(path.join(targetPath, 'tsconfig.json'), JSON.stringify(getDefaultTsconfig(), null, 2));

        console.success(`create tsconfig.json`);
    }
     */
    let file_map = [
        ['tsconfig.json', 'file/tsconfig.json.tpl'],
        ['lerna.json', 'file/lerna.json.tpl'],
        ...static_file_1.defaultCopyStaticFiles,
    ];
    static_file_1.default({
        cwd: targetPath,
        file_map,
    });
    createDirByPackages(targetPath, packages);
    return true;
}
exports._createYarnWorkspaces = _createYarnWorkspaces;
function getDefaultTsconfig() {
    return {
        extends: "@bluelovers/tsconfig/esm/esModuleInterop"
    };
}
exports.getDefaultTsconfig = getDefaultTsconfig;
function getDefaultPackageJson(name) {
    return {
        "name": name,
        "version": "1.0.0",
        "private": true,
        "workspaces": [
            "packages/*"
        ],
        "scripts": {
            "lerna:publish": "npx lerna publish",
            "lerna:publish:yes": "npx lerna publish --yes --cd-version patch",
            "prepublish:lockfile": "npx sync-lockfile .",
            "ncu": "npx yarn-tool ncu -u",
            "sort-package-json": "npx yarn-tool sort",
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "devDependencies": {
            "@types/node": "*",
            "@bluelovers/tsconfig": "*"
        },
        "peerDependencies": {
            "lerna": "^3"
        },
        "resolutions": {}
    };
}
exports.getDefaultPackageJson = getDefaultPackageJson;
function createDirByPackages(cwd, packages) {
    return packages.some(function (value) {
        let bool;
        let s = value.split(/[\/\\]/)[0];
        if (!/[!?\*{}\[\]]/.test(s)) {
            let dir = path.join(cwd, s);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            return true;
        }
        return bool;
    });
}
exports.createDirByPackages = createDirByPackages;
exports.default = createYarnWorkspaces;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILG1FQUFvRTtBQUNwRSw2QkFBOEI7QUFDOUIsa0NBQW1DO0FBQ25DLCtCQUFnQztBQUVoQywrQ0FBd0M7QUFDeEMsd0RBQXVHO0FBRTFGLFFBQUEsT0FBTyxHQUFHLElBQUksdUJBQVEsQ0FBQyxJQUFJLEVBQUU7SUFDekMsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsSUFBSTtDQUNWLENBQUMsQ0FBQztBQWNILFNBQWdCLG9CQUFvQixDQUFDLEdBQVksRUFBRSxVQUFvQixFQUFFO0lBRXhFLElBQUksR0FBRyxJQUFJLE9BQU8sR0FBRyxJQUFJLFFBQVEsRUFDakM7UUFDQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ2QsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7S0FDbEI7SUFFRCxJQUFJLENBQUMsR0FBRyxFQUNSO1FBQ0MsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUNwQjtJQUVELEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXhCLElBQUksSUFBSSxHQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFcEMsSUFBSSxFQUFVLENBQUM7SUFFZixJQUNBO1FBQ0MsZ0RBQWdEO1FBQ2hELEVBQUUsR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNqQztJQUNELE9BQU8sQ0FBQyxFQUNSO1FBQ0MsZUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUUxQixFQUFFLEdBQUcsSUFBSSxDQUFDO0tBQ1Y7SUFFRCxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztJQUUzQyxPQUFPLENBQUMs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QkFBa0IsRUFBRTtZQUNuQixPQUFPLEVBQUUsSUFBSTtTQUNiO1FBQ0QsYUFBYSxFQUFFLEVBQUU7S0FDakIsQ0FBQztBQUNILENBQUM7QUF2Q0Qsc0RBdUNDO0FBRUQsU0FBZ0IsbUJBQW1CLENBQUMsR0FBVyxFQUFFLFFBQWtCO0lBRWxFLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUs7UUFFbkMsSUFBSSxJQUFhLENBQUM7UUFFbEIsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFDM0I7WUFDQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUU1QixJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFDdkI7Z0JBQ0MsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNsQjtZQUVELE9BQU8sSUFBSSxDQUFDO1NBQ1o7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQXRCRCxrREFzQkM7QUFFRCxrQkFBZSxvQkFBb0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTgvNS8xMy8wMTMuXG4gKi9cblxuaW1wb3J0IGZpbmRZYXJuV29ya3NwYWNlUm9vdCA9IHJlcXVpcmUoJ2ZpbmQteWFybi13b3Jrc3BhY2Utcm9vdDInKTtcbmltcG9ydCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuaW1wb3J0IHBrZ0RpciA9IHJlcXVpcmUoJ3BrZy1kaXInKTtcbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG5cbmltcG9ydCB7IENvbnNvbGUyIH0gZnJvbSAnZGVidWctY29sb3IyJztcbmltcG9ydCBjb3B5U3RhdGljRmlsZXMsIHsgZGVmYXVsdENvcHlTdGF0aWNGaWxlcywgSVN0YXRpY0ZpbGVzTWFwQXJyYXkgfSBmcm9tICdAeWFybi10b29sL3N0YXRpYy1maWxlJztcblxuZXhwb3J0IGNvbnN0IGNvbnNvbGUgPSBuZXcgQ29uc29sZTIobnVsbCwge1xuXHRsYWJlbDogdHJ1ZSxcblx0dGltZTogdHJ1ZSxcbn0pO1xuXG5leHBvcnQgaW50ZXJmYWNlIElPcHRpb25zXG57XG5cdGN3ZD86IHN0cmluZyxcblxuXHRpZ25vcmVQYXJlbnRXb3Jrc3BhY2VzPzogYm9vbGVhbixcblx0aWdub3JlRXhpc3RzUGFja2FnZT86IGJvb2xlYW4sXG5cblx0aW5pdFBhY2thZ2VKc29uPzxUID0gYW55PihjdXJyZW50OiBSZXR1cm5UeXBlPHR5cGVvZiBnZXREZWZhdWx0UGFja2FnZUpzb24+KTogUmV0dXJuVHlwZTx0eXBlb2YgZ2V0RGVmYXVsdFBhY2thZ2VKc29uPiB8IFJldHVyblR5cGU8dHlwZW9mIGdldERlZmF1bHRQYWNrYWdlSnNvbj4gJiBULFxuXG5cdGRlYnVnPzogYm9vbGVhbixcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVlhcm5Xb3Jrc3BhY2VzKGN3ZD86IHN0cmluZywgb3B0aW9uczogSU9wdGlvbnMgPSB7fSlcbntcblx0aWYgKGN3ZCAmJiB0eXBlb2YgY3dkICE9ICdzdHJpbmcnKVxuXHR7XG5cdFx0b3B0aW9ucyA9IGN3ZDtcblx0XHRjd2QgPSBvcHRpb25zLmN3ZDtcblx0fVxuXG5cdGlmICghY3dkKVxuXHR7XG5cdFx0Y3dkID0gcHJvY2Vzcy5jd2QoKTtcblx0fVxuXG5cdGN3ZCA9IHBhdGgucmVzb2x2ZShjd2QpO1xuXG5cdGxldCByb290OiBzdHJpbmcgPSBwa2dEaXIuc3luYyhjd2QpO1xuXG5cdGxldCB3czogc3RyaW5nO1xuXG5cdHRyeVxuXHR7XG5cdFx0Ly8gQEZJWE1FIOS4gOWAi+Wlh+aAqueahEJVRyDkuI3kvb/nlKggdHJ5IOeahOipsSDlnKggTlBYIOW6leS4i+Wwseacg+WHuuePvueEoeioiuaBr+eahOWBnOatolxuXHRcdHdzID0gZmluZFlhcm5Xb3Jrc3BhY2VSb290KHJvb3QpO1xuXHR9XG5cdGNhdGNoIChlKVxuXHR7XG5cdFx0Y29uc29sZS5sb2coZS50b1N0cmluZygpKTtcblxuXHRcdHdzID0gbnVsbDtcblx0fVxuXG5cdGxldCB0YXJnZXRQYXRoID0gcGF0aC5yZXNvbHZlKHJvb3QgfHwgY3dkKTtcblxuXHRvcHRpb25zLmRlYnVnICYmIGNvbnNvbGUuZGVidWcoe1xuXHRcdHRhcmdldFBhdGgsXG5cdFx0d3MsXG5cdFx0b3B0aW9ucyxcblx0fSk7XG5cblx0aWYgKCFvcHRpb25zLmlnbm9yZUV4aXN0c1BhY2thZ2UgJiYgcm9vdClcblx0e1xuXHRcdGNvbnNvbGUuZXJyb3IoYGFscmVhZHkgaGF2ZSBwYWNrYWdlIGF0IFwiJHtyb290fVwiLCBvciB1c2UgaWdub3JlRXhpc3RzUGFja2FnZSBmb3Igb3ZlcndyaXRlIGl0YCk7XG5cblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0ZWxzZSBpZiAocm9vdClcblx0e1xuXHRcdGNvbnNvbGUud2FybihgaWdub3JlIGV4aXN0cyBwYWNrYWdlIFwiJHtyb290fVwiYCk7XG5cdH1cblxuXHRpZiAod3MpXG5cdHtcblx0XHRsZXQgYm9vbDogYm9vbGVhbiA9IHRydWU7XG5cblx0XHRjb25zb2xlLndhcm4oYGRldGVjdCBleGlzdHMgd29ya3NwYWNlIFwiJHt3c31cImApO1xuXG5cdFx0aWYgKG9wdGlvbnMuaWdub3JlUGFyZW50V29ya3NwYWNlcylcblx0XHR7XG5cdFx0XHRib29sID0gaXNTYW1lUGF0aCh0YXJnZXRQYXRoLCB3cyk7XG5cblx0XHRcdGlmICghYm9vbClcblx0XHRcdHtcblx0XHRcdFx0Y29uc29sZS53YXJuKGBpZ25vcmVQYXJlbnRXb3Jrc3BhY2VzID0gdHJ1ZWApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGB0YXJnZXQgcGF0aCBhbHJlYWR5IGlzIHdvcmtzcGFjZWApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChib29sKVxuXHRcdHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gX2NyZWF0ZVlhcm5Xb3Jrc3BhY2VzKHRhcmdldFBhdGgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNTYW1lUGF0aChwMTogc3RyaW5nLCBwMjogc3RyaW5nKVxue1xuXHRpZiAocDEgPT09IHAyKVxuXHR7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0ZWxzZSBpZiAoIXAxIHx8ICFwMilcblx0e1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdGxldCBzID0gcGF0aC5yZWxhdGl2ZShwMSwgcDIpO1xuXHRyZXR1cm4gKHMgPT09ICcuJyB8fCBzID09PSAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfY3JlYXRlWWFybldvcmtzcGFjZXModGFyZ2V0UGF0aDogc3RyaW5nLCBvcHRpb25zOiBJT3B0aW9ucyA9IHt9KVxue1xuXHRjb25zb2xlLmluZm8oYGNyZWF0ZSBpbiB0YXJnZXQgcGF0aCBcIiR7dGFyZ2V0UGF0aH1cImApO1xuXG5cdGxldCBwa2c6IFJldHVyblR5cGU8dHlwZW9mIGdldERlZmF1bHRQYWNrYWdlSnNvbj47XG5cblx0bGV0IGxlcm5hO1xuXG5cdHtcblx0XHRsZXQgZmlsZSA9IHBhdGguam9pbih0YXJnZXRQYXRoLCAnbGVybmEuanNvbicpO1xuXG5cdFx0aWYgKGZzLmV4aXN0c1N5bmMoZmlsZSkpXG5cdFx0e1xuXHRcdFx0bGV0IGpzb24gPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhmaWxlKS50b1N0cmluZygpKTtcblxuXHRcdFx0aWYgKGpzb24ucGFja2FnZXMgJiYgIU9iamVjdC5rZXlzKGpzb24ucGFja2FnZXMpLmxlbmd0aClcblx0XHRcdHtcblx0XHRcdFx0anNvbi5wYWNrYWdlcyA9IHVuZGVmaW5lZDtcblx0XHRcdH1cblxuXHRcdFx0bGVybmEgPSBqc29uO1xuXHRcdH1cblx0fVxuXG5cdGxldCBwYWNrYWdlcyA9IGxlcm5hICYmIGxlcm5hLnBhY2thZ2VzIHx8IFtcblx0XHRcInBhY2thZ2VzLypcIixcblx0XTtcblxuXHRsZXQgZmlsZSA9IHBhdGguam9pbih0YXJnZXRQYXRoLCAncGFja2FnZS5qc29uJyk7XG5cblx0aWYgKCFmcy5leGlzdHNTeW5jKGZpbGUpKVxuXHR7XG5cdFx0bGV0IG5hbWUgPSBwYXRoLmJhc2VuYW1lKHRhcmdldFBhdGgpO1xuXG5cdFx0aWYgKCFmcy5leGlzdHNTeW5jKHRhcmdldFBhdGgpKVxuXHRcdHtcblx0XHRcdGZzLm1rZGlyU3luYyh0YXJnZXRQYXRoKTtcblx0XHR9XG5cblx0XHRwa2cgPSBPYmplY3QuYXNzaWduKGdldERlZmF1bHRQYWNrYWdlSnNvbihuYW1lKSwge1xuXHRcdFx0bmFtZSxcblx0XHRcdHdvcmtzcGFjZXM6IHBhY2thZ2VzLFxuXHRcdH0pO1xuXG5cdFx0aWYgKG9wdGlvbnMuaW5pdFBhY2thZ2VKc29uKVxuXHRcdHtcblx0XHRcdGxldCByZXQgPSBvcHRpb25zLmluaXRQYWNrYWdlSnNvbihwa2cpO1xuXG5cdFx0XHRpZiAocmV0KVxuXHRcdFx0e1xuXHRcdFx0XHRwa2cgPSByZXQ7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdGxldCBqc29uID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZmlsZSkudG9TdHJpbmcoKSk7XG5cblx0XHRsZXQgd29ya3NwYWNlcztcblxuXHRcdGlmIChqc29uLndvcmtzcGFjZXMgJiYgT2JqZWN0LmtleXMoanNvbi53b3Jrc3BhY2VzKS5sZW5ndGgpXG5cdFx0e1xuXHRcdFx0d29ya3NwYWNlcyA9IGpzb24ud29ya3NwYWNlcztcblxuXHRcdFx0Ly8gaHR0cHM6Ly95YXJucGtnLmNvbS9ibG9nLzIwMTgvMDIvMTUvbm9ob2lzdC9cblx0XHRcdHBhY2thZ2VzID0gd29ya3NwYWNlcy5wYWNrYWdlcyB8fCB3b3Jrc3BhY2VzO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0d29ya3NwYWNlcyA9IHBhY2thZ2VzO1xuXHRcdH1cblxuXHRcdHBrZyA9IE9iamVjdC5hc3NpZ24oanNvbiwge1xuXHRcdFx0XCJwcml2YXRlXCI6IHRydWUsXG5cdFx0XHRcIndvcmtzcGFjZXNcIjogd29ya3NwYWNlcyxcblx0XHR9KTtcblxuXHRcdHBrZy5yZXNvbHV0aW9ucyA9IHBrZy5yZXNvbHV0aW9ucyB8fCB7fTtcblx0fVxuXG5cdGxldCBzID0gSlNPTi5zdHJpbmdpZnkocGtnLCBudWxsLCAyKTtcblx0ZnMud3JpdGVGaWxlU3luYyhmaWxlLCBzKTtcblxuXHRjb25zb2xlLnN1Y2Nlc3MoYGNyZWF0ZSB3b3Jrc3BhY2UgcGFja2FnZS5qc29uYCk7XG5cblx0aWYgKGxlcm5hICYmIChwYWNrYWdlcyAhPSBsZXJuYS5wYWNrYWdlcyB8fCBsZXJuYS5ucG1DbGllbnQgIT09ICd5YXJuJyB8fCBsZXJuYS51c2VXb3Jrc3BhY2VzICE9PSB0cnVlKSlcblx0e1xuXHRcdGxldCBmaWxlID0gcGF0aC5qb2luKHRhcmdldFBhdGgsICdsZXJuYS5qc29uJyk7XG5cblx0XHRsZXJuYS5wYWNrYWdlcyA9IHBhY2thZ2VzO1xuXHRcdGxlcm5hLm5wbUNsaWVudCA9ICd5YXJuJztcblx0XHRsZXJuYS51c2VXb3Jrc3BhY2VzID0gdHJ1ZTtcblxuXHRcdGxldCBzID0gSlNPTi5zdHJpbmdpZnkobGVybmEsIG51bGwsIDIpO1xuXHRcdGZzLndyaXRlRmlsZVN5bmMoZmlsZSwgcyk7XG5cblx0XHRjb25zb2xlLmluZm8oYHVwZGF0ZSBsZXJuYS5qc29uYCk7XG5cdH1cblx0ZWxzZSBpZiAoMCAmJiAhbGVybmEpXG5cdHtcblx0XHRsZXQgZmlsZSA9IHBhdGguam9pbih0YXJnZXRQYXRoLCAnbGVybmEuanNvbicpO1xuXG5cdFx0bGVybmEgPSB7XG5cdFx0XHRcInBhY2thZ2VzXCI6IHBhY2thZ2VzLFxuXHRcdFx0XCJjb21tYW5kXCI6IHtcblx0XHRcdFx0XCJwdWJsaXNoXCI6IHtcblx0XHRcdFx0XHRcImlnbm9yZUNoYW5nZXNcIjogW1wibm9kZV9tb2R1bGVzXCJdLFxuXHRcdFx0XHRcdFwibWVzc2FnZVwiOiBcImNob3JlKHJlbGVhc2UpOiBwdWJsaXNoXCJcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdFwibnBtQ2xpZW50XCI6IFwieWFyblwiLFxuXHRcdFx0XCJ1c2VXb3Jrc3BhY2VzXCI6IHRydWUsXG5cdFx0XHRcInZlcnNpb25cIjogXCJpbmRlcGVuZGVudFwiLFxuXHRcdH07XG5cblx0XHRsZXQgcyA9IEpTT04uc3RyaW5naWZ5KGxlcm5hLCBudWxsLCAyKTtcblx0XHRmcy53cml0ZUZpbGVTeW5jKGZpbGUsIHMpO1xuXG5cdFx0Y29uc29sZS5zdWNjZXNzKGBjcmVhdGUgbGVybmEuanNvbmApO1xuXHR9XG5cblx0Lypcblx0aWYgKCFmcy5leGlzdHNTeW5jKHBhdGguam9pbih0YXJnZXRQYXRoLCAndHNjb25maWcuanNvbicpKSlcblx0e1xuXHRcdGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRhcmdldFBhdGgsICd0c2NvbmZpZy5qc29uJyksIEpTT04uc3RyaW5naWZ5KGdldERlZmF1bHRUc2NvbmZpZygpLCBudWxsLCAyKSk7XG5cblx0XHRjb25zb2xlLnN1Y2Nlc3MoYGNyZWF0ZSB0c2NvbmZpZy5qc29uYCk7XG5cdH1cblx0ICovXG5cblx0bGV0IGZpbGVfbWFwOiBJU3RhdGljRmlsZXNNYXBBcnJheTxzdHJpbmc+ID0gW1xuXHRcdFsndHNjb25maWcuanNvbicsICdmaWxlL3RzY29uZmlnLmpzb24udHBsJ10sXG5cdFx0WydsZXJuYS5qc29uJywgJ2ZpbGUvbGVybmEuanNvbi50cGwnXSxcblx0XHQuLi5kZWZhdWx0Q29weVN0YXRpY0ZpbGVzLFxuXHRdXG5cblx0Y29weVN0YXRpY0ZpbGVzKHtcblx0XHRjd2Q6IHRhcmdldFBhdGgsXG5cdFx0ZmlsZV9tYXAsXG5cdH0pO1xuXG5cdGNyZWF0ZURpckJ5UGFja2FnZXModGFyZ2V0UGF0aCwgcGFja2FnZXMpO1xuXG5cdHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdFRzY29uZmlnKClcbntcblx0cmV0dXJuIHtcblx0XHRleHRlbmRzOiBcIkBibHVlbG92ZXJzL3RzY29uZmlnL2VzbS9lc01vZHVsZUludGVyb3BcIlxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0UGFja2FnZUpzb24obmFtZT86IHN0cmluZyk6IHtcblx0bmFtZTogc3RyaW5nO1xuXHR2ZXJzaW9uOiBzdHJpbmc7XG5cdHByaXZhdGU6IGJvb2xlYW47XG5cdHdvcmtzcGFjZXM6IHN0cmluZ1tdO1xuXHRzY3JpcHRzOiB7XG5cdFx0W2s6IHN0cmluZ106IHN0cmluZztcblx0XHR0ZXN0Pzogc3RyaW5nO1xuXHR9O1xuXHRyZXNvbHV0aW9uczoge1xuXHRcdFtrOiBzdHJpbmddOiBzdHJpbmc7XG5cdH07XG5cdFtrOiBzdHJpbmddOiBhbnk7XG59XG57XG5cdHJldHVybiB7XG5cdFx0XCJuYW1lXCI6IG5hbWUsXG5cdFx0XCJ2ZXJzaW9uXCI6IFwiMS4wLjBcIixcblx0XHRcInByaXZhdGVcIjogdHJ1ZSxcblx0XHRcIndvcmtzcGFjZXNcIjogW1xuXHRcdFx0XCJwYWNrYWdlcy8qXCJcblx0XHRdLFxuXHRcdFwic2NyaXB0c1wiOiB7XG5cdFx0XHRcImxlcm5hOnB1Ymxpc2hcIjogXCJucHggbGVybmEgcHVibGlzaFwiLFxuXHRcdFx0XCJsZXJuYTpwdWJsaXNoOnllc1wiOiBcIm5weCBsZXJuYSBwdWJsaXNoIC0teWVzIC0tY2QtdmVyc2lvbiBwYXRjaFwiLFxuXHRcdFx0XCJwcmVwdWJsaXNoOmxvY2tmaWxlXCI6IFwibnB4IHN5bmMtbG9ja2ZpbGUgLlwiLFxuXHRcdFx0XCJuY3VcIjogXCJucHggeWFybi10b29sIG5jdSAtdVwiLFxuXHRcdFx0XCJzb3J0LXBhY2thZ2UtanNvblwiOiBcIm5weCB5YXJuLXRvb2wgc29ydFwiLFxuXHRcdFx0XCJ0ZXN0XCI6IFwiZWNobyBcXFwiRXJyb3I6IG5vIHRlc3Qgc3BlY2lmaWVkXFxcIiAmJiBleGl0IDFcIlxuXHRcdH0sXG5cdFx0XCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuXHRcdFx0XCJAdHlwZXMvbm9kZVwiOiBcIipcIixcblx0XHRcdFwiQGJsdWVsb3ZlcnMvdHNjb25maWdcIjogXCIqXCJcblx0XHR9LFxuXHRcdFwicGVlckRlcGVuZGVuY2llc1wiOiB7XG5cdFx0XHRcImxlcm5hXCI6IFwiXjNcIlxuXHRcdH0sXG5cdFx0XCJyZXNvbHV0aW9uc1wiOiB7fVxuXHR9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRGlyQnlQYWNrYWdlcyhjd2Q6IHN0cmluZywgcGFja2FnZXM6IHN0cmluZ1tdKVxue1xuXHRyZXR1cm4gcGFja2FnZXMuc29tZShmdW5jdGlvbiAodmFsdWUpXG5cdHtcblx0XHRsZXQgYm9vbDogYm9vbGVhbjtcblxuXHRcdGxldCBzID0gdmFsdWUuc3BsaXQoL1tcXC9cXFxcXS8pWzBdO1xuXG5cdFx0aWYgKCEvWyE/XFwqe31cXFtcXF1dLy50ZXN0KHMpKVxuXHRcdHtcblx0XHRcdGxldCBkaXIgPSBwYXRoLmpvaW4oY3dkLCBzKTtcblxuXHRcdFx0aWYgKCFmcy5leGlzdHNTeW5jKGRpcikpXG5cdFx0XHR7XG5cdFx0XHRcdGZzLm1rZGlyU3luYyhkaXIpO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYm9vbDtcblx0fSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlWWFybldvcmtzcGFjZXM7XG4iXX0=