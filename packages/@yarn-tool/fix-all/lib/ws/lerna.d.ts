import { ITSRequiredPick } from 'ts-type/lib/type/record';
import { IFillPkgHostedInfoOptions } from '@yarn-tool/pkg-hosted-info';
import { ILernaJson } from '@ts-type/package-dts/lerna-json';
export declare function _fixLernaJsonCore(current: ILernaJson, tpl: ILernaJson): ILernaJson;
export declare function _fixLernaJson(options: ITSRequiredPick<IFillPkgHostedInfoOptions, 'rootData'>): void;
