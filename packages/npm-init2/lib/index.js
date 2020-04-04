"use strict";
/**
 * Created by user on 2018/11/28/028.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyStaticFiles = exports.defaultCopyStaticFiles = exports.validateNpmPackageName = exports.getTargetDir = exports.npmVersion = void 0;
const crossSpawn = require("cross-spawn-extra");
const JSON5 = require("json5");
const _validateNpmPackageName = require("validate-npm-package-name");
const fs = require("fs-extra");
const path = require("path");
const static_file_1 = require("@yarn-tool/static-file");
Object.defineProperty(exports, "defaultCopyStaticFiles", { enumerable: true, get: function () { return static_file_1.defaultCopyStaticFiles; } });
function npmVersion(npmClient, cwd) {
    let args = [
        'version',
    ];
    npmClient = npmClient || 'npm';
    if (npmClient === 'yarn') {
        args = [
            'versions',
        ];
    }
    let cp = crossSpawn.sync(npmClient, args, {
        cwd,
        stripAnsi: true,
    });
    if (cp.error) {
        throw cp.error;
    }
    let output = cp.stdout.toString()
        .replace(/^yarn versions [^\n]+$/gm, '')
        .replace(/^Done in [^\n]+$/gm, '')
        .replace(/^\s+|\s+$/g, '');
    let json = JSON5.parse(output);
    return json;
}
exports.npmVersion = npmVersion;
function getTargetDir(options) {
    let targetDir;
    let targetName = options.targetName || null;
    let { inputName, cwd, hasWorkspace, workspacePrefix } = options;
    if (hasWorkspace && !workspacePrefix) {
        throw new RangeError(`can't found workspace prefix`);
    }
    if (targetName) {
        validateNpmPackageName(targetName, true);
    }
    if (inputName) {
        targetName = targetName || inputName;
        let ret = validateNpmPackageName(inputName, true);
        let name = inputName;
        let basePath;
        if (hasWorkspace) {
            basePath = path.join(hasWorkspace, workspacePrefix);
        }
        else {
            basePath = cwd;
        }
        if (ret.scopedPackagePattern) {
            name = name
                .replace(/[\/\\]+/g, '_')
                .replace(/^@/g, '');
            if (!fs.pathExistsSync(path.join(basePath, ret.subname))) {
                name = ret.subname;
            }
        }
        targetDir = path.resolve(basePath, name);
    }
    else {
        targetDir = cwd;
    }
    return {
        targetDir,
        targetName,
        cwd,
    };
}
exports.getTargetDir = getTargetDir;
const scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$');
function validateNpmPackageName(name, throwErr) {
    let ret = _validateNpmPackageName(name);
    ret.name = name;
    if (!ret.errors || !ret.errors.length) {
        const nameMatch = name.match(scopedPackagePattern);
        if (nameMatch) {
            ret.scopedPackagePattern = true;
            ret.user = nameMatch[1];
            ret.subname = nameMatch[2];
        }
        else {
            ret.scopedPackagePattern = false;
        }
    }
    else if (throwErr) {
        throw new RangeError(ret.errors.concat(ret.warnings || []).join(' ; '));
    }
    return ret;
}
exports.validateNpmPackageName = validateNpmPackageName;
function copyStaticFiles(file_map, options) {
    return static_file_1.default({
        ...options,
        file_map,
    });
}
exports.copyStaticFiles = copyStaticFiles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILGdEQUFpRDtBQUNqRCwrQkFBZ0M7QUFFaEMscUVBQXNFO0FBQ3RFLCtCQUFnQztBQUNoQyw2QkFBOEI7QUFFOUIsd0RBQWtGO0FBc0p6RSx1R0F0SmtCLG9DQUFzQixPQXNKbEI7QUFwSi9CLFNBQWdCLFVBQVUsQ0FBQyxTQUFrQixFQUFFLEdBQVk7SUFFMUQsSUFBSSxJQUFJLEdBQUc7UUFDVixTQUFTO0tBQ1QsQ0FBQztJQUVGLFNBQVMsR0FBRyxTQUFTLElBQUksS0FBSyxDQUFDO0lBRS9CLElBQUksU0FBUyxLQUFLLE1BQU0sRUFDeEI7UUFDQyxJQUFJLEdBQUc7WUFDTixVQUFVO1NBQ1YsQ0FBQTtLQUNEO0lBRUQsSUFBSSxFQUFFLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFO1FBQ3pDLEdBQUc7UUFDSCxTQUFTLEVBQUUsSUFBSTtLQUNmLENBQUMsQ0FBQztJQUVILElBQUksRUFBRSxDQUFDLEtBQUssRUFDWjtRQUNDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQTtLQUNkO0lBRUQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7U0FDL0IsT0FBTyxDQUFDLDBCQUEwQixFQUFFLEVBQUUsQ0FBQztTQUN2QyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxDQUFDO1NBQ2pDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQzFCO0lBRUQsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUUvQixPQUFPLElBQUksQ0FBQTtBQUNaLENBQUM7QUFsQ0QsZ0NBa0NDO0FBRUQsU0FBZ0IsWUFBWSxDQUFDLE9BTzVCO0lBRUEsSUFBSSxTQUFpQixDQUFDO0lBQ3RCLElBQUksVUFB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UTtLQUNSLENBQUMsQ0FBQztBQUNKLENBQUM7QUFWRCwwQ0FVQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMTgvMTEvMjgvMDI4LlxuICovXG5cbmltcG9ydCBjcm9zc1NwYXduID0gcmVxdWlyZSgnY3Jvc3Mtc3Bhd24tZXh0cmEnKTtcbmltcG9ydCBKU09ONSA9IHJlcXVpcmUoJ2pzb241Jyk7XG5cbmltcG9ydCBfdmFsaWRhdGVOcG1QYWNrYWdlTmFtZSA9IHJlcXVpcmUoJ3ZhbGlkYXRlLW5wbS1wYWNrYWdlLW5hbWUnKTtcbmltcG9ydCBmcyA9IHJlcXVpcmUoJ2ZzLWV4dHJhJyk7XG5pbXBvcnQgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuaW1wb3J0IF9jb3B5U3RhdGljRmlsZXMsIHsgZGVmYXVsdENvcHlTdGF0aWNGaWxlcyB9IGZyb20gJ0B5YXJuLXRvb2wvc3RhdGljLWZpbGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gbnBtVmVyc2lvbihucG1DbGllbnQ/OiBzdHJpbmcsIGN3ZD86IHN0cmluZylcbntcblx0bGV0IGFyZ3MgPSBbXG5cdFx0J3ZlcnNpb24nLFxuXHRdO1xuXG5cdG5wbUNsaWVudCA9IG5wbUNsaWVudCB8fCAnbnBtJztcblxuXHRpZiAobnBtQ2xpZW50ID09PSAneWFybicpXG5cdHtcblx0XHRhcmdzID0gW1xuXHRcdFx0J3ZlcnNpb25zJyxcblx0XHRdXG5cdH1cblxuXHRsZXQgY3AgPSBjcm9zc1NwYXduLnN5bmMobnBtQ2xpZW50LCBhcmdzLCB7XG5cdFx0Y3dkLFxuXHRcdHN0cmlwQW5zaTogdHJ1ZSxcblx0fSk7XG5cblx0aWYgKGNwLmVycm9yKVxuXHR7XG5cdFx0dGhyb3cgY3AuZXJyb3Jcblx0fVxuXG5cdGxldCBvdXRwdXQgPSBjcC5zdGRvdXQudG9TdHJpbmcoKVxuXHRcdC5yZXBsYWNlKC9eeWFybiB2ZXJzaW9ucyBbXlxcbl0rJC9nbSwgJycpXG5cdFx0LnJlcGxhY2UoL15Eb25lIGluIFteXFxuXSskL2dtLCAnJylcblx0XHQucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG5cdDtcblxuXHRsZXQganNvbiA9IEpTT041LnBhcnNlKG91dHB1dCk7XG5cblx0cmV0dXJuIGpzb25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhcmdldERpcihvcHRpb25zOiB7XG5cdGlucHV0TmFtZTogc3RyaW5nLFxuXHRjd2Q6IHN0cmluZyxcblxuXHR0YXJnZXROYW1lPzogc3RyaW5nLFxuXHRoYXNXb3Jrc3BhY2U/OiBzdHJpbmcsXG5cdHdvcmtzcGFjZVByZWZpeD86IHN0cmluZyxcbn0pXG57XG5cdGxldCB0YXJnZXREaXI6IHN0cmluZztcblx0bGV0IHRhcmdldE5hbWU6IHN0cmluZyA9IG9wdGlvbnMudGFyZ2V0TmFtZSB8fCBudWxsO1xuXHRsZXQgeyBpbnB1dE5hbWUsIGN3ZCwgaGFzV29ya3NwYWNlLCB3b3Jrc3BhY2VQcmVmaXggfSA9IG9wdGlvbnM7XG5cblx0aWYgKGhhc1dvcmtzcGFjZSAmJiAhd29ya3NwYWNlUHJlZml4KVxuXHR7XG5cdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IoYGNhbid0IGZvdW5kIHdvcmtzcGFjZSBwcmVmaXhgKTtcblx0fVxuXG5cdGlmICh0YXJnZXROYW1lKVxuXHR7XG5cdFx0dmFsaWRhdGVOcG1QYWNrYWdlTmFtZSh0YXJnZXROYW1lLCB0cnVlKTtcblx0fVxuXG5cdGlmIChpbnB1dE5hbWUpXG5cdHtcblx0XHR0YXJnZXROYW1lID0gdGFyZ2V0TmFtZSB8fCBpbnB1dE5hbWU7XG5cblx0XHRsZXQgcmV0ID0gdmFsaWRhdGVOcG1QYWNrYWdlTmFtZShpbnB1dE5hbWUsIHRydWUpO1xuXHRcdGxldCBuYW1lID0gaW5wdXROYW1lO1xuXG5cdFx0bGV0IGJhc2VQYXRoOiBzdHJpbmc7XG5cblx0XHRpZiAoaGFzV29ya3NwYWNlKVxuXHRcdHtcblx0XHRcdGJhc2VQYXRoID0gcGF0aC5qb2luKGhhc1dvcmtzcGFjZSwgd29ya3NwYWNlUHJlZml4KTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdGJhc2VQYXRoID0gY3dkO1xuXHRcdH1cblxuXHRcdGlmIChyZXQuc2NvcGVkUGFja2FnZVBhdHRlcm4pXG5cdFx0e1xuXHRcdFx0bmFtZSA9IG5hbWVcblx0XHRcdFx0LnJlcGxhY2UoL1tcXC9cXFxcXSsvZywgJ18nKVxuXHRcdFx0XHQucmVwbGFjZSgvXkAvZywgJycpXG5cdFx0XHQ7XG5cblx0XHRcdGlmICghZnMucGF0aEV4aXN0c1N5bmMocGF0aC5qb2luKGJhc2VQYXRoLCByZXQuc3VibmFtZSkpKVxuXHRcdFx0e1xuXHRcdFx0XHRuYW1lID0gcmV0LnN1Ym5hbWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dGFyZ2V0RGlyID0gcGF0aC5yZXNvbHZlKGJhc2VQYXRoLCBuYW1lKTtcblxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdHRhcmdldERpciA9IGN3ZDtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0dGFyZ2V0RGlyLFxuXHRcdHRhcmdldE5hbWUsXG5cdFx0Y3dkLFxuXHR9XG59XG5cbmNvbnN0IHNjb3BlZFBhY2thZ2VQYXR0ZXJuID0gbmV3IFJlZ0V4cCgnXig/OkAoW14vXSs/KVsvXSk/KFteL10rPykkJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZU5wbVBhY2thZ2VOYW1lKG5hbWU6IHN0cmluZywgdGhyb3dFcnI/OiBib29sZWFuKVxue1xuXHRsZXQgcmV0OiB7XG5cdFx0dmFsaWRGb3JOZXdQYWNrYWdlczogYm9vbGVhbixcblx0XHR2YWxpZEZvck9sZFBhY2thZ2VzOiBib29sZWFuLFxuXHRcdHNjb3BlZFBhY2thZ2VQYXR0ZXJuOiBib29sZWFuLFxuXHRcdHdhcm5pbmdzPzogc3RyaW5nW10sXG5cdFx0ZXJyb3JzPzogc3RyaW5nW10sXG5cblx0XHRuYW1lOiBzdHJpbmcsXG5cdFx0dXNlcj86IHN0cmluZyxcblx0XHRzdWJuYW1lPzogc3RyaW5nLFxuXG5cdH0gPSBfdmFsaWRhdGVOcG1QYWNrYWdlTmFtZShuYW1lKTtcblxuXHRyZXQubmFtZSA9IG5hbWU7XG5cblx0aWYgKCFyZXQuZXJyb3JzIHx8ICFyZXQuZXJyb3JzLmxlbmd0aClcblx0e1xuXHRcdGNvbnN0IG5hbWVNYXRjaCA9IG5hbWUubWF0Y2goc2NvcGVkUGFja2FnZVBhdHRlcm4pO1xuXG5cdFx0aWYgKG5hbWVNYXRjaClcblx0XHR7XG5cdFx0XHRyZXQuc2NvcGVkUGFja2FnZVBhdHRlcm4gPSB0cnVlO1xuXG5cdFx0XHRyZXQudXNlciA9IG5hbWVNYXRjaFsxXTtcblx0XHRcdHJldC5zdWJuYW1lID0gbmFtZU1hdGNoWzJdO1xuXHRcdH1cblx0XHRlbHNlXG5cdFx0e1xuXHRcdFx0cmV0LnNjb3BlZFBhY2thZ2VQYXR0ZXJuID0gZmFsc2U7XG5cdFx0fVxuXHR9XG5cdGVsc2UgaWYgKHRocm93RXJyKVxuXHR7XG5cdFx0dGhyb3cgbmV3IFJhbmdlRXJyb3IocmV0LmVycm9ycy5jb25jYXQocmV0Lndhcm5pbmdzIHx8IFtdKS5qb2luKCcgOyAnKSk7XG5cdH1cblxuXHRyZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgeyBkZWZhdWx0Q29weVN0YXRpY0ZpbGVzIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlTdGF0aWNGaWxlcyhmaWxlX21hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IFtzdHJpbmcsIHN0cmluZywgc3RyaW5nP11bXSwgb3B0aW9uczoge1xuXHRjd2Q6IHN0cmluZyxcblx0c3RhdGljUm9vdD86IHN0cmluZyxcblx0b3ZlcndyaXRlPzogYm9vbGVhbixcbn0pXG57XG5cdHJldHVybiBfY29weVN0YXRpY0ZpbGVzKHtcblx0XHQuLi5vcHRpb25zLFxuXHRcdGZpbGVfbWFwLFxuXHR9KTtcbn1cbiJdfQ==