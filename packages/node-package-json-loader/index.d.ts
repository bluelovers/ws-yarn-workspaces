/// <reference types="node" />
import { IPackageJson } from '@ts-type/package-dts';
import * as TsTypePackageDts from '@ts-type/package-dts';
export { IPackageJson };
declare type IFileOrJson = Buffer | string | object | IPackageJson;
declare type IPackageJsonLike<T> = Partial<T> | Record<string, any>;
declare type IItemOrItemArray<T> = T | T[];
export declare class PackageJsonLoader<T extends IPackageJsonLike<IPackageJson> = IPackageJson> {
    readonly file: string;
    protected json: T;
    loaded: boolean;
    protected _use: ((json: IPackageJsonLike<T>) => void)[];
    static create<T = IPackageJson>(file: IFileOrJson, ...argv: any[]): PackageJsonLoader<T>;
    static createByJson<T = IPackageJson>(json: T, ...argv: any[]): PackageJsonLoader<T>;
    static findPackageJsonPath(name: string): string;
    static loadByModuleName<T = IPackageJson>(name: string): PackageJsonLoader<T>;
    constructor(fileOrJson: IFileOrJson, ...argv: any[]);
    use(ls: IItemOrItemArray<(json: IPackageJsonLike<T>) => void>): void;
    setFilename(file: string): this;
    setJson(json: object | T): this;
    read(reload?: boolean): this;
    readonly dir: string;
    /**
     * skip typescript type check
     */
    /**
    * skip typescript type check
    */
    unsafeTypeData: IPackageJsonLike<T>;
    data: T;
    overwrite(json: object | T): this;
    autofix(): void;
    run(options?: {
        autofix?: boolean;
    }): this;
    exists(): boolean;
    stringify(): string;
    sort(): this;
    write(): this;
    writeOnlyWhenLoaded(): boolean;
}
export declare module PackageJsonLoader {
    type IPackageJson = TsTypePackageDts.IPackageJson;
}
export default PackageJsonLoader;
