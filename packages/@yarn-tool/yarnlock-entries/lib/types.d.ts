import type { IUnpackYarnLockDataRow, IYarnLockParsedV1, IYarnLockParsedV2 } from '@yarn-tool/yarnlock-parse';
import type { IParseNameAndVersion } from '@yarn-tool/yarnlock-util';
export interface IYarnLockIteratorWrap<D extends IUnpackYarnLockDataRow<IYarnLockParsedV1 | IYarnLockParsedV2>> {
    key: string;
    raw: D;
    value: IYarnLockIteratorWrapValue<D>;
}
export interface IYarnLockIteratorWrapValue<D extends IUnpackYarnLockDataRow<IYarnLockParsedV1 | IYarnLockParsedV2>> extends IParseNameAndVersion {
}
