export declare function findBinPathCore(options?: {
    cwd?: string;
    stopPath?: string | string[];
}): {
    result: string[];
    history: string[];
};
export default findBinPathCore;
