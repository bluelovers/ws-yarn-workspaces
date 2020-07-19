export declare function createNewIsBuiltinModule(options?: {
    targetNodeJSVersion?: string;
}): {
    builtins: string[];
    isBuiltinModule(moduleName: string): boolean;
};
declare const builtins: string[], isBuiltinModule: (moduleName: string) => boolean;
export { builtins, isBuiltinModule, };
export default isBuiltinModule;
