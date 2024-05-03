import { IParsePackageName } from '@yarn-tool/npm-package-arg-util/lib/types';
import { AbbreviatedVersion } from 'package-json';
export declare function getPackageInfo(packageName: string | IParsePackageName, excludeVersion?: boolean): import("bluebird")<AbbreviatedVersion>;
