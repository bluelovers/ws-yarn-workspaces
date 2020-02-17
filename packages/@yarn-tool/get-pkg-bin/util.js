"use strict";
/**
 * Created by user on 2020/2/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const upath2_1 = require("upath2");
const resolve_package_1 = require("@yarn-tool/resolve-package");
function getPackageBins(pkg) {
    if (pkg.bin != null) {
        if (typeof pkg.bin === 'string') {
            return {
                [pkg.name]: pkg.bin,
            };
        }
        else {
            return {
                ...pkg.bin,
            };
        }
    }
}
exports.getPackageBins = getPackageBins;
function handlePackageBins(bins, resolveFn) {
    const _cwd = '.' + upath2_1.sep;
    return Object.entries(bins)
        .reduce((a, [k, bin]) => {
        if (resolveFn) {
            bin = resolveFn(_cwd + bin);
        }
        if (!upath2_1.isAbsolute(upath2_1.normalize(bin))) {
            bin = _cwd + upath2_1.normalize(bin);
        }
        else {
            bin = upath2_1.normalize(bin);
        }
        a[k] = bin;
        return a;
    }, {});
}
exports.handlePackageBins = handlePackageBins;
function firstPackageBin(bins) {
    bins = bins || {};
    let keys = Object.keys(bins);
    if (keys.length) {
        return bins[keys[0]];
    }
}
exports.firstPackageBin = firstPackageBin;
function getPackageInfo(options) {
    let { pkgRoot, pkg, name } = options;
    if (pkg) {
        name = name || options.pkg.name;
    }
    else if (name) {
        let data = resolve_package_1.resolvePackage(options.name, {
            paths: options.paths,
        });
        pkg = data.pkg;
        pkgRoot = pkgRoot || data.pkgRoot;
    }
    else {
        throw new TypeError(`name or pkg is not valid`);
    }
    return {
        name,
        pkgRoot,
        pkg: pkg,
    };
}
exports.getPackageInfo = getPackageInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOztHQUVHOztBQUdILG1DQUFvRDtBQUVwRCxnRUFBNEQ7QUFJNUQsU0FBZ0IsY0FBYyxDQUFDLEdBQXFCO0lBRW5ELElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQ25CO1FBQ0MsSUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEtBQUssUUFBUSxFQUMvQjtZQUNDLE9BQU87Z0JBQ04sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUc7YUFDbkIsQ0FBQTtTQUNEO2FBRUQ7WUFDQyxPQUFPO2dCQUNOLEdBQUcsR0FBRyxDQUFDLEdBQUc7YUFDVixDQUFBO1NBQ0Q7S0FDRDtBQUNGLENBQUM7QUFqQkQsd0NBaUJDO0FBRUQsU0FBZ0IsaUJBQWlCLENBQW1CLElBQXVCLEVBQzFFLFNBQTRDO0lBRzVDLE1BQU0sSUFBSSxHQUFHLEdBQUcsR0FBRyxZQUFHLENBQUM7SUFFdkIsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztTQUN6QixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRTtRQUV2QixJQUFJLFNBQVMsRUFDYjtZQUNDLEdBQUcsR0FBRyxTQUFTLENBQUMsSUFBSSxHQUFHLEdBQWEsQ0FBQyxDQUFDO1NBQ3RDO1FBRUQsSUFBSSxDQUFDLG1CQUFVLENBQUMsa0JBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUMvQjtZQUNDLEdBQUcsR0FBRyxJQUFJLEdBQUcsa0JBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM1QjthQUVEO1lBQ0MsR0FBRyxHQUFHLGtCQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckI7UUFFRCxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ1gsT0FBTyxDQUFDLENBQUE7SUFDVCxDQUFDLEVBQUUsRUFBdUIsQ0FBQyxDQUFBO0FBQzdCLENBQUM7QUExQkQsOENBMEJDO0FBRUQsU0FBZ0IsZUFBZSxDQUFDLElBQTRCO0lBRTNELElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ2xCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFN0IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUNmO1FBQ0MsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7S0FDcEI7QUFDRixDQUFDO0FBVEQsMENBU0M7QUFFRCxTQUFnQixjQUFjLENBQUMsT0FBaUI7SUFFL0MsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDO0lBRXJDLElBQUksR0FBRyxFQUNQO1FBQ0MsSUFBSSxHQUFHLElBQUksSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztLQUNoQztTQUNJLElBQUksSUFBSSxFQUNiO1FBQ0MsSUFBSSxJQUFJLEdBQUcsZ0NBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ3ZDLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztTQUNwQixDQUFDLENBQUM7UUFDSCxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNmLE9BQU8sR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNsQztTQUVEO1FBQ0MsTUFBTSxJQUFJLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0tBQy9DO0lBRUQsT0FBTztRQUNOLElBQUk7UUFDSixPQUFPO1FBQ1AsR0FBRyxFQUFFLEdBQW1CO0tBQ3hCLENBQUE7QUFDRixDQUFDO0FBMUJELHdDQTBCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMi8xNi5cbiAqL1xuXG5pbXBvcnQgdHlwZSB7IElQYWNrYWdlSnNvbiB9IGZyb20gJ0B0cy10eXBlL3BhY2thZ2UtZHRzJztcbmltcG9ydCB7IHNlcCwgaXNBYnNvbHV0ZSwgbm9ybWFsaXplIH0gZnJvbSAndXBhdGgyJztcbmltcG9ydCB0eXBlIHsgSU9wdGlvbnMgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7IHJlc29sdmVQYWNrYWdlIH0gZnJvbSAnQHlhcm4tdG9vbC9yZXNvbHZlLXBhY2thZ2UnO1xuXG5leHBvcnQgdHlwZSBJUGFja2FnZUpzb25MaWtlID0gSVBhY2thZ2VKc29uIHwgUmVjb3JkPHN0cmluZywgYW55PjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhY2thZ2VCaW5zKHBrZzogSVBhY2thZ2VKc29uTGlrZSk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz5cbntcblx0aWYgKHBrZy5iaW4gIT0gbnVsbClcblx0e1xuXHRcdGlmICh0eXBlb2YgcGtnLmJpbiA9PT0gJ3N0cmluZycpXG5cdFx0e1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0W3BrZy5uYW1lXTogcGtnLmJpbixcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdC4uLnBrZy5iaW4sXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVQYWNrYWdlQmluczxLIGV4dGVuZHMgc3RyaW5nPihiaW5zOiBSZWNvcmQ8Sywgc3RyaW5nPixcblx0cmVzb2x2ZUZuPzogKGJpbjogc3RyaW5nLCAuLi5hcmd2KSA9PiBzdHJpbmcsXG4pXG57XG5cdGNvbnN0IF9jd2QgPSAnLicgKyBzZXA7XG5cblx0cmV0dXJuIE9iamVjdC5lbnRyaWVzKGJpbnMpXG5cdFx0LnJlZHVjZSgoYSwgW2ssIGJpbl0pID0+XG5cdFx0e1xuXHRcdFx0aWYgKHJlc29sdmVGbilcblx0XHRcdHtcblx0XHRcdFx0YmluID0gcmVzb2x2ZUZuKF9jd2QgKyBiaW4gYXMgc3RyaW5nKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKCFpc0Fic29sdXRlKG5vcm1hbGl6ZShiaW4pKSlcblx0XHRcdHtcblx0XHRcdFx0YmluID0gX2N3ZCArIG5vcm1hbGl6ZShiaW4pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZVxuXHRcdFx0e1xuXHRcdFx0XHRiaW4gPSBub3JtYWxpemUoYmluKTtcblx0XHRcdH1cblxuXHRcdFx0YVtrXSA9IGJpbjtcblx0XHRcdHJldHVybiBhXG5cdFx0fSwge30gYXMgUmVjb3JkPEssIHN0cmluZz4pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaXJzdFBhY2thZ2VCaW4oYmluczogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IHN0cmluZ1xue1xuXHRiaW5zID0gYmlucyB8fCB7fTtcblx0bGV0IGtleXMgPSBPYmplY3Qua2V5cyhiaW5zKTtcblxuXHRpZiAoa2V5cy5sZW5ndGgpXG5cdHtcblx0XHRyZXR1cm4gYmluc1trZXlzWzBdXVxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYWNrYWdlSW5mbyhvcHRpb25zOiBJT3B0aW9ucylcbntcblx0bGV0IHsgcGtnUm9vdCwgcGtnLCBuYW1lIH0gPSBvcHRpb25zO1xuXG5cdGlmIChwa2cpXG5cdHtcblx0XHRuYW1lID0gbmFtZSB8fCBvcHRpb25zLnBrZy5uYW1lO1xuXHR9XG5cdGVsc2UgaWYgKG5hbWUpXG5cdHtcblx0XHRsZXQgZGF0YSA9IHJlc29sdmVQYWNrYWdlKG9wdGlvbnMubmFtZSwge1xuXHRcdFx0cGF0aHM6IG9wdGlvbnMucGF0aHMsXG5cdFx0fSk7XG5cdFx0cGtnID0gZGF0YS5wa2c7XG5cdFx0cGtnUm9vdCA9IHBrZ1Jvb3QgfHwgZGF0YS5wa2dSb290O1xuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYG5hbWUgb3IgcGtnIGlzIG5vdCB2YWxpZGApXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdG5hbWUsXG5cdFx0cGtnUm9vdCxcblx0XHRwa2c6IHBrZyBhcyBJUGFja2FnZUpzb24sXG5cdH1cbn1cbiJdfQ==