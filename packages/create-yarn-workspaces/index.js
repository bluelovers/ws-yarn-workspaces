"use strict";
/**
 * Created by user on 2018/5/13/013.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirByPackages = exports.getDefaultPackageJson = exports.getDefaultTsconfig = exports._createYarnWorkspaces = exports.isSamePath = exports.createYarnWorkspaces = void 0;
const find_yarn_workspace_root2_1 = __importDefault(require("find-yarn-workspace-root2"));
const path_1 = require("path");
const pkg_dir_1 = __importDefault(require("pkg-dir"));
const logger_1 = __importDefault(require("debug-color2/logger"));
const static_file_1 = __importStar(require("@yarn-tool/static-file"));
const fs_extra_1 = require("fs-extra");
const sort_package_json3_1 = __importDefault(require("sort-package-json3"));
function createYarnWorkspaces(cwd, options = {}) {
    if (cwd && typeof cwd != 'string') {
        options = cwd;
        cwd = options.cwd;
    }
    if (!cwd) {
        cwd = process.cwd();
    }
    cwd = path_1.resolve(cwd);
    let root = pkg_dir_1.default.sync(cwd);
    let ws;
    try {
        // @FIXME 一個奇怪的BUG 不使用 try 的話 在 NPX 底下就會出現無訊息的停止
        ws = find_yarn_workspace_root2_1.default(root);
    }
    catch (e) {
        logger_1.default.log(e.toString());
        ws = null;
    }
    let targetPath = path_1.resolve(root || cwd);
    options.debug && logger_1.default.debug({
        targetPath,
        ws,
        options,
    });
    if (!options.ignoreExistsPackage && root) {
        logger_1.default.error(`already have package at "${root}", or use ignoreExistsPackage for overwrite it`);
        return false;
    }
    else if (root) {
        logger_1.default.warn(`ignore exists package "${root}"`);
    }
    if (ws) {
        let bool = true;
        logger_1.default.warn(`detect exists workspace "${ws}"`);
        if (options.ignoreParentWorkspaces) {
            bool = isSamePath(targetPath, ws);
            if (!bool) {
                logger_1.default.warn(`ignoreParentWorkspaces = true`);
            }
            else {
                logger_1.default.error(`target path already is workspace`);
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
    let s = path_1.relative(p1, p2);
    return (s === '.' || s === '');
}
exports.isSamePath = isSamePath;
function _createYarnWorkspaces(targetPath, options = {}) {
    logger_1.default.info(`create in target path "${targetPath}"`);
    let pkg;
    let lerna;
    {
        let file = path_1.join(targetPath, 'lerna.json');
        if (fs_extra_1.existsSync(file)) {
            let json = JSON.parse(fs_extra_1.readFileSync(file).toString());
            if (json.packages && !Object.keys(json.packages).length) {
                json.packages = undefined;
            }
            lerna = json;
        }
    }
    let packages = lerna && lerna.packages || [
        "packages/*",
    ];
    let file = path_1.join(targetPath, 'package.json');
    if (!fs_extra_1.existsSync(file)) {
        let name = path_1.basename(targetPath);
        if (!fs_extra_1.existsSync(targetPath)) {
            fs_extra_1.mkdirSync(targetPath);
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
        let json = JSON.parse(fs_extra_1.readFileSync(file).toString());
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
    let s = JSON.stringify(sort_package_json3_1.default(pkg), null, 2);
    fs_extra_1.writeFileSync(file, s);
    logger_1.default.success(`create workspace package.json`);
    if (lerna && (packages != lerna.packages || lerna.npmClient !== 'yarn' || lerna.useWorkspaces !== true)) {
        let file = path_1.join(targetPath, 'lerna.json');
        lerna.packages = packages;
        lerna.npmClient = 'yarn';
        lerna.useWorkspaces = true;
        let s = JSON.stringify(sort_package_json3_1.default(lerna), null, 2);
        fs_extra_1.writeFileSync(file, s);
        logger_1.default.info(`update lerna.json`);
    }
    else if (0 && !lerna) {
        let file = path_1.join(targetPath, 'lerna.json');
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
        let s = JSON.stringify(sort_package_json3_1.default(lerna), null, 2);
        fs_extra_1.writeFileSync(file, s);
        logger_1.default.success(`create lerna.json`);
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
            let dir = path_1.join(cwd, s);
            if (!fs_extra_1.existsSync(dir)) {
                fs_extra_1.mkdirSync(dir);
            }
            return true;
        }
        return bool;
    });
}
exports.createDirByPackages = createDirByPackages;
exports.default = createYarnWorkspaces;
//# sourceMappingURL=index.js.map