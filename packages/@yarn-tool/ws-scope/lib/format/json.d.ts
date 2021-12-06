import { ScopeJsonObject } from './json-object';
export declare class ScopeJson<K extends string = 'workspaces'> extends ScopeJsonObject<K> {
    existsFile(): boolean;
    loadFile(reload?: boolean): import("./json-object").IJsonObject<K>;
    saveFile(): void;
}
