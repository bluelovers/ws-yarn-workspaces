declare const SymbolCurrentDirectory: unique symbol;
/**
 * SymbolGlobalYarn + SymbolGlobalNpm
 */
declare const SymbolGlobal: unique symbol;
declare const SymbolGlobalNpm: unique symbol;
declare const SymbolGlobalYarn: unique symbol;
declare const SymbolModuleMain: unique symbol;
export { SymbolCurrentDirectory, SymbolGlobal, SymbolGlobalNpm, SymbolGlobalYarn, SymbolModuleMain, };
export type IPathItem = typeof SymbolCurrentDirectory | typeof SymbolGlobal | typeof SymbolGlobalNpm | typeof SymbolGlobalYarn | typeof SymbolModuleMain;
export declare function getPathsByType(valueType: string | IPathItem, cwd?: string): string[];
export default getPathsByType;
