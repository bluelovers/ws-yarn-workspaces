import { EnumInstallTypesErrorCode } from './const';
import { IOptionsCheckInstallTarget } from './types';
export declare function checkInstallTargetTypes(packageName: string, options?: IOptionsCheckInstallTarget): Promise<{
    name: string;
    target: string;
    error: EnumInstallTypesErrorCode;
    msg: string;
}>;
