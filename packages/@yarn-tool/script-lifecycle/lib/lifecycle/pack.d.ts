/**
 * Pack lifecycle configuration.
 * Pack 生命週期配置。
 *
 * Defines the script execution order for npm/yarn pack command.
 * 定義 npm/yarn pack 命令的腳本執行順序。
 *
 * Execution order / 執行順序：
 * 1. prepublish - Runs before publish (triggered by pack) / 在 publish 之前執行（由 pack 觸發）
 * 2. prepare - Runs after install and before publish / 在 install 之後和 publish 之前執行
 * 3. prepack - Runs before pack / 在 pack 之前執行
 * 4. pack - NOT included (ignoreSelf: true) / 不包含（ignoreSelf: true）
 * 5. postpack - Runs after pack / 在 pack 之後執行
 *
 * Note: The main 'pack' script is excluded from the execution list
 * because npm pack doesn't run a script named 'pack'.
 *
 * 注意：主 'pack' 腳本被排除在執行列表之外，
 * 因為 npm pack 不會執行名為 'pack' 的腳本。
 *
 * @see https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts
 *
 * @module @yarn-tool/script-lifecycle/lib/lifecycle/pack
 */
declare const _default: {
    /** Script name / 腳本名稱 */
    readonly name: "pack";
    /**
     * Whether to exclude the main script from the list.
     * 是否在列表中排除主腳本。
     *
     * true = exclude 'pack' from the execution list
     * true = 在執行列表中排除 'pack'
     *
     * npm pack doesn't run a script named 'pack', so we exclude it.
     * npm pack 不會執行名為 'pack' 的腳本，因此我們將其排除。
     */
    readonly ignoreSelf: true;
    /**
     * Scripts to run before pack.
     * 在 pack 之前執行的腳本。
     *
     * prepublish and prepare are triggered during the pack lifecycle.
     * prepublish 和 prepare 會在 pack 生命週期中被觸發。
     */
    readonly before: ["prepublish", "prepare", "prepack"];
    /**
     * Scripts to run after pack.
     * 在 pack 之後執行的腳本。
     */
    readonly after: ["postpack"];
};
export default _default;
