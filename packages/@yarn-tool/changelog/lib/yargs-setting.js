"use strict";
/**
 * Created by user on 2020/6/15.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupToYargs = void 0;
function setupToYargs(yargs) {
    return yargs
        .option('preset', {
        desc: `Name of the preset you want to use. Must be one of the following:\n@bluelovers/conventional-changelog-bluelovers, angular, atom, codemirror, ember, eslint, express, jquery, jscs or jshint`,
        alias: ['p', 'changelogPreset'],
        string: true,
    })
        .option('lerna-package', {
        desc: `Generate a changelog for a specific lerna package (:pkg-name@1.0.0)`,
        alias: 'l',
        boolean: true,
        default: true,
    })
        .option('type', {
        string: true,
    })
        .option('tag-prefix', {
        desc: `Tag prefix to consider when reading the tags`,
        alias: 't',
        string: true,
    })
        .option('cwd', {
        default: process.cwd(),
        normalize: true,
    });
}
exports.setupToYargs = setupToYargs;
exports.default = setupToYargs;
//# sourceMappingURL=yargs-setting.js.map