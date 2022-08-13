export type IJsonObject<K extends string> = {
    [p in K]: string[];
};
export declare class ScopeJsonObject<K extends string = 'workspaces'> {
    readonly file: string;
    protected options?: {
        field?: K;
    };
    json: IJsonObject<K>;
    changed: boolean;
    field: K;
    constructor(file: string, options?: {
        field?: K;
    });
    protected _init(): void;
    get opened(): boolean;
    add(scope: string): boolean;
    addLazy(scope: string): boolean;
    remove(scope: string): boolean;
    removeLazy(scope: string): boolean;
    get value(): string[];
    set value(value: string[]);
}
