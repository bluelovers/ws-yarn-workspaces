import { IYarnLockParsed, IYarnLockParsedV1, IYarnLockParsedV2, IYarnLockSource, IYarnLockRawSourceV1, IYarnLockRawSourceV2 } from '@yarn-tool/yarnlock-types';
export declare function yarnLockParsedV1ToRawJSON(parsedObject: IYarnLockParsedV1): IYarnLockRawSourceV1;
export declare function yarnLockParsedV2ToRawJSON(parsedObject: IYarnLockParsedV2): IYarnLockRawSourceV2;
export interface IOptionsYarnLockParsedToRawJSON {
    throwError?: boolean;
}
export declare function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsedV1, options?: IOptionsYarnLockParsedToRawJSON): IYarnLockRawSourceV1;
export declare function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsedV2, options?: IOptionsYarnLockParsedToRawJSON): IYarnLockRawSourceV2;
export declare function yarnLockParsedToRawJSON(parsedObject: IYarnLockParsed, options?: IOptionsYarnLockParsedToRawJSON): IYarnLockSource;
export default yarnLockParsedToRawJSON;
