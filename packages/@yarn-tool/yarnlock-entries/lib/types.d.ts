import type { IParseNameAndVersionWithNpaResult } from '@yarn-tool/yarnlock-util';
import { IUnpackYarnLockDataRow, IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-types';
export interface IYarnLockIteratorWrap<D extends IUnpackYarnLockDataRow<IYarnLockParsedV1 | IYarnLockParsedV2>> {
    key: string;
    raw: D;
    value: IYarnLockIteratorWrapValue<D>;
}
export interface IYarnLockIteratorWrapValue<D extends IUnpackYarnLockDataRow<IYarnLockParsedV1 | IYarnLockParsedV2>> extends IParseNameAndVersionWithNpaResult {
}
