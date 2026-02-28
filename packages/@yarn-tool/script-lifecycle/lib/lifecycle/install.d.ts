/**
 * Install lifecycle configuration.
 * Install 生命週期配置。
 *
 * Defines the script execution order for npm/yarn install command.
 * 定義 npm/yarn install 命令的腳本執行順序。
 *
 * Execution order / 執行順序：
 * 1. preinstall - Runs before install / 在 install 之前執行
 * 2. install - The main install script / 主 install 腳本
 * 3. postinstall - Runs after install / 在 install 之後執行
 * 4. prepublish - Runs before publish (also triggered by install) / 在 publish 之前執行（也會被 install 觸發）
 * 5. prepare - Runs after install and before publish / 在 install 之後和 publish 之前執行
 * 6. preshrinkwrap - Runs before shrinkwrap / 在 shrinkwrap 之前執行
 * 7. shrinkwrap - The shrinkwrap script / shrinkwrap 腳本
 * 8. postshrinkwrap - Runs after shrinkwrap / 在 shrinkwrap 之後執行
 *
 * @see https://docs.npmjs.com/cli/v10/using-npm/scripts#life-cycle-scripts
 *
 * @module @yarn-tool/script-lifecycle/lib/lifecycle/install
 */
declare const _default: {
    /** Script name / 腳本名稱 */
    readonly name: "install";
    /**
     * Whether to exclude the main script from the list.
     * 是否在列表中排除主腳本。
     *
     * false = include 'install' in the execution list
     * false = 在執行列表中包含 'install'
     */
    readonly ignoreSelf: false;
    /**
     * Scripts to run before install.
     * 在 install 之前執行的腳本。
     */
    readonly before: ["preinstall"];
    /**
     * Scripts to run after install.
     * 在 install 之後執行的腳本。
     *
     * Note: prepublish, prepare, and shrinkwrap scripts are also triggered
     * during the install lifecycle.
     * 注意：prepublish、prepare 和 shrinkwrap 腳本也會在 install 生命週期中被觸發。
     */
    readonly after: ["postinstall", "prepublish", "prepare", "preshrinkwrap", "shrinkwrap", "postshrinkwrap"];
};
export default _default;
