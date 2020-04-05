"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs-extra");
const path = require("path");
function fixBinPath(bin, root) {
    if (!fs.existsSync(path.join(root, bin))
        && fs.existsSync(path.join(root, 'bin', bin))) {
        return path.posix.join('.', 'bin', bin);
    }
    return null;
}
exports.fixBinPath = fixBinPath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBZ0M7QUFDaEMsNkJBQThCO0FBRTlCLFNBQWdCLFVBQVUsQ0FBQyxHQUFXLEVBQUUsSUFBWTtJQUVuRCxJQUNDLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztXQUNqQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUU5QztRQUNDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztLQUN4QztJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2IsQ0FBQztBQVhELGdDQVdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzID0gcmVxdWlyZSgnZnMtZXh0cmEnKTtcbmltcG9ydCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5leHBvcnQgZnVuY3Rpb24gZml4QmluUGF0aChiaW46IHN0cmluZywgcm9vdDogc3RyaW5nKVxue1xuXHRpZiAoXG5cdFx0IWZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHJvb3QsIGJpbikpXG5cdFx0JiYgZnMuZXhpc3RzU3luYyhwYXRoLmpvaW4ocm9vdCwgJ2JpbicsIGJpbikpXG5cdClcblx0e1xuXHRcdHJldHVybiBwYXRoLnBvc2l4LmpvaW4oJy4nLCAnYmluJywgYmluKTtcblx0fVxuXG5cdHJldHVybiBudWxsO1xufVxuIl19