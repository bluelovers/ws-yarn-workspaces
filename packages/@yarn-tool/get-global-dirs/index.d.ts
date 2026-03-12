export interface IGlobalDirectoryEntry {
    /**
    The directory with globally installed packages.

    Equivalent to `npm root --global`.
    */
    packages: string;
    /**
    The directory with globally installed binaries.

    Equivalent to `npm bin --global`.
    */
    binaries: string;
    /**
    The directory with directories for packages and binaries. You probably want either of the above.

    Equivalent to `npm prefix --global`.
    */
    prefix: string;
}
export interface IGlobalDirectory {
    /**
    Get the directory of globally installed packages and binaries.

    @example
    ```
    import globalDirectory from 'global-directory';

    console.log(globalDirectory.npm.prefix);
    //=> '/usr/local'

    console.log(globalDirectory.npm.packages);
    //=> '/usr/local/lib/node_modules'
    ```
    */
    npm: IGlobalDirectoryEntry;
    /**
    Get the directory of globally installed packages and binaries.

    @example
    ```
    import globalDirectory from 'global-directory';

    console.log(globalDirectory.npm.binaries);
    //=> '/usr/local/bin'

    console.log(globalDirectory.yarn.packages);
    //=> '/Users/sindresorhus/.config/yarn/global/node_modules'
    ```
    */
    yarn: IGlobalDirectoryEntry;
    /**
    Get the directory of globally installed packages and binaries.

    @example
    ```
    import globalDirectory from 'global-directory';

    console.log(globalDirectory.pnpm.prefix);
    //=> '/Users/sindresorhus/Library/pnpm'

    console.log(globalDirectory.pnpm.packages);
    //=> '/Users/sindresorhus/Library/pnpm/global/5/node_modules'
    ```
    */
    pnpm: IGlobalDirectoryEntry;
}
/**
 * Get the directory of globally installed packages and binaries
 * Uses the same resolution logic as npm, yarn, and pnpm.
 *
 * @see https://github.com/sindresorhus/global-directory/blob/main/index.js
 */
declare const globalDirectory: IGlobalDirectory;
export { globalDirectory };
export declare const npm: IGlobalDirectoryEntry;
export declare const yarn: IGlobalDirectoryEntry;
export declare const pnpm: IGlobalDirectoryEntry;
export default globalDirectory;
