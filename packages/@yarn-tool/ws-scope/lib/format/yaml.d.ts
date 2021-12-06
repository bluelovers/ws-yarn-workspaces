import { IJsonObject, ScopeJsonObject } from './json-object';
import YAWN from 'yawn-yaml/cjs';
export declare const SymRaw: unique symbol;
export declare class ScopeYaml<K extends string = 'packages'> extends ScopeJsonObject<K> {
    [SymRaw]: YAWN;
    protected _init(): void;
    get json(): IJsonObject<K>;
    set json(json: IJsonObject<K>);
    existsFile(): boolean;
    get opened(): boolean;
    loadFile(reload?: boolean): IJsonObject<K>;
    saveFile(): void;
}
