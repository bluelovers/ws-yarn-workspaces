import { ILernaJson } from '@ts-type/package-dts/lerna-json';
export declare function sortLernaJsonCommandEntry<T extends Record<string, any>>(value: T): T;
export declare function sortLernaJsonCommand<T extends ILernaJson["command"]>(value: T): T;
export declare function sortLernaJson<T extends ILernaJson>(json: T): T;
export declare function sortLernaJsonFile<T extends ILernaJson>(file: string): void;
export default sortLernaJson;
