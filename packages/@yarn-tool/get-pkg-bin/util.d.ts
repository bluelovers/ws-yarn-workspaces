/**
 * Created by user on 2020/2/16.
 */
import type { IPackageJson } from '@ts-type/package-dts';
export * from './lib/types';
import { IPackageJsonLike, IOptions } from './lib/types';
export declare function getPackageBins(pkg: IPackageJsonLike): Record<string, string>;
export declare function handlePackageBins<K extends string>(bins: Record<K, string>, resolveFn?: (bin: string, ...argv: any[]) => string): Record<K, string>;
export declare function firstPackageBin(bins: Record<string, string>): string;
export declare function getPackageInfo(options: IOptions): {
    name: string;
    pkgRoot: string;
    pkg: IPackageJson<unknown>;
};
