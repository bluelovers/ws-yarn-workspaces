import { IWriteOptions } from '@bluelovers/fs-json';
export declare function _handleOptions<T extends IWriteOptions>(options: T): T;
export declare function writePackageJSONSync(file: string, data: unknown, options?: IWriteOptions): void;
export declare function outputPackageJSONSync(file: string, data: unknown, options?: IWriteOptions): void;
export declare function writePackageJSON(file: string, data: unknown, options?: IWriteOptions): Promise<void>;
export declare function outputPackageJSON(file: string, data: unknown, options?: IWriteOptions): Promise<void>;
export default writePackageJSONSync;
