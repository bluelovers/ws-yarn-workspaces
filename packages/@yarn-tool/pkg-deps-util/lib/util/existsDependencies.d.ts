import { IPackageJson } from '@ts-type/package-dts/package-json';
export declare function existsDependencies(name: string, pkg: IPackageJson | Partial<Record<'dependencies' | 'devDependencies' | 'optionalDependencies', Record<string, string>>>): string;
