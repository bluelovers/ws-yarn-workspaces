"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACKAGE_REGEX = void 0;
exports.PACKAGE_REGEX = /(?<packageName>.*)@(?:(?<semverPin>[\^\$])?(?<major>\d)(?:\.(?<minor>\d))?(?:\.(?<patch>\d))?(?:-(?<prerelease>[0-9a-zA-Z-]+)(?:.(?<prereleaseVersion>[0-9a-zA-Z]+))?)?(?:\+(?<metadata>[0-9a-zA-Z-]+)(?:.(?<metadataVersion>[0-9a-zA-Z]+))?)?|\*)/;
//# sourceMappingURL=const.js.map