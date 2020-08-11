"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reSemverRange = exports.reSemver = void 0;
exports.reSemver = /^v?((\d+)\.(\d+)\.(\d+))(?:-([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?(?:\+([\dA-Za-z\-]+(?:\.[\dA-Za-z\-]+)*))?$/;
/**
 * , reSemverRange = /\s*((\|\||\-)|(([<>~]?=?)\s*(v)?([0-9]+)(\.(x|[0-9]+))?(\.(x|[0-9]+))?(([\-+])([a-zA-Z0-9\.]+))?))\s* /g
 */
exports.reSemverRange = /\s*((\|\||\-)|(((?:(?:~?[<>]?)|\^?)=?)\s*(v)?([0-9]+)(\.(x|\*|[0-9]+))?(\.(x|\*|[0-9]+))?(([\-+])([a-zA-Z0-9\.-]+))?))\s*/g;
//# sourceMappingURL=const.js.map