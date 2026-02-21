/**
 * Created by user on 2020/4/9.
 */
/**
 * 生命週期腳本執行結果的類型定義
 * Type definitions for lifecycle script execution results
 *
 * @module @yarn-tool/run-script-lifecycle
 * @description 定義執行 npm/yarn 生命週期腳本所需的類型介面
 *              Defines the type interfaces required for running npm/yarn lifecycle scripts
 */
import { StdioOptions } from "child_process";
import { IPackageJson } from '@ts-type/package-dts';
/**
 * 腳本執行結果的基礎介面
 * Base interface for script execution results
 *
 * @interface IResultBase
 * @property {number} code - 執行結果的退出代碼 (Exit code of the execution result)
 * @property {null | any} signal - 執行結果的訊號 (Signal of the execution result)
 * @property {StdioOptions} stdio - 標準輸入輸出配置 (Standard I/O configuration)
 */
export interface IResultBase {
    /**
     * 執行結果的退出代碼
     * Exit code of the execution result
     * - 0: 成功 (Success)
     * - 1: 失敗 (Failure)
     * - 其他: 其他錯誤代碼 (Other error codes)
     */
    code: 0 | 1 | number;
    /**
     * 執行結果的訊號
     * Signal of the execution result
     * 通常為 null，除非進程被訊號終止
     * Usually null unless the process was terminated by a signal
     */
    signal: null | any;
    /**
     * 標準輸入輸出配置
     * Standard I/O configuration
     */
    stdio: StdioOptions;
}
/**
 * 腳本不存在時的執行結果介面
 * Interface for execution result when script does not exist
 *
 * @interface IResultNotExists
 * @extends {IResultBase}
 * @description 當指定的生命週期腳本在 package.json 中不存在時返回的結果類型
 *              Result type returned when the specified lifecycle script does not exist in package.json
 */
export interface IResultNotExists extends IResultBase {
}
/**
 * 腳本執行結果的核心介面
 * Core interface for script execution results
 *
 * @interface IResultCore
 * @extends {IResultBase}
 * @description 包含執行腳本時的所有詳細資訊
 *              Contains all detailed information when executing a script
 */
export interface IResultCore extends IResultBase {
    /**
     * 執行的命令路徑
     * Path of the executed command
     * @example 'C:\\WINDOWS\\system32\\cmd.exe'
     */
    cmd: string;
    /**
     * 命令列參數
     * Command line arguments
     * @example [ '/d', '/s', '/c', '"echo install"' ]
     */
    args: string[];
    /**
     * 執行結果的退出代碼
     * Exit code of the execution result
     */
    code: 0 | 1 | number;
    /**
     * 執行結果的訊號
     * Signal of the execution result
     */
    signal: null | any;
    /**
     * 標準輸出內容
     * Standard output content
     */
    stdout: string;
    /**
     * 標準錯誤輸出內容
     * Standard error output content
     */
    stderr: string;
    /**
     * 觸發的生命週期事件名稱
     * Name of the triggered lifecycle event
     * @example 'install', 'postinstall', 'preinstall'
     */
    event: string;
    /**
     * 實際執行的腳本命令
     * The actual script command being executed
     * @example 'echo install'
     */
    script: string;
    /**
     * 套件識別符
     * Package identifier
     * @example 'pkg-a@1.0.0'
     */
    pkgid: string;
    /**
     * 執行腳本的目錄路徑
     * Directory path where the script is executed
     */
    path: string;
}
/**
 * 腳本執行結果介面
 * Interface for script execution results
 *
 * @interface IResult
 * @extends {IResultCore}
 * @description 完整的腳本執行結果，包含所有執行詳細資訊
 *              Complete script execution result with all execution details
 */
export interface IResult extends IResultCore {
}
/**
 * 腳本執行錯誤類型
 * Script execution error type
 *
 * @typedef {IError}
 * @description 結合 Error 和 IResult 的錯誤類型，用於處理腳本執行失敗的情況
 *              Error type combining Error and IResult for handling script execution failures
 */
export type IError = Error & IResult;
/**
 * 執行生命週期腳本的選項介面
 * Interface for options to run lifecycle scripts
 *
 * @interface IRunLifecycleScriptOptions
 * @description 定義執行生命週期腳本時可配置的選項
 *              Defines configurable options when running lifecycle scripts
 */
export interface IRunLifecycleScriptOptions {
    /**
     * 要執行的生命週期事件名稱
     * Name of the lifecycle event to run
     * @example 'install', 'build', 'test'
     */
    event: string;
    /**
     * 傳遞給腳本的參數
     * Arguments to pass to the script
     */
    args?: any[];
    /**
     * 套件所在的目錄路徑
     * Directory path where the package is located
     */
    path: string;
    /**
     * 執行時的環境變數
     * Environment variables during execution
     */
    env?: Record<string, any>;
    /**
     * 標準輸入輸出配置
     * Standard I/O configuration
     */
    stdio?: StdioOptions;
    /**
     * 是否將 stdio 視為字串
     * Whether to treat stdio as strings
     */
    stdioString?: boolean;
    /**
     * 套件的 package.json 物件
     * Package's package.json object
     */
    pkg?: any | IPackageJson;
    /**
     * 標準輸入串流
     * Standard input stream
     */
    stdin?: any;
}
/**
 * 擴展的 package.json 介面
 * Extended package.json interface
 *
 * @interface IPackageJson2
 * @extends {IPackageJson}
 * @description 擴展標準 IPackageJson 介面，增加內部使用的 _id 屬性
 *              Extends standard IPackageJson interface with internal _id property
 */
export interface IPackageJson2 extends IPackageJson {
    /**
     * 套件的內部識別 ID
     * Internal identifier ID of the package
     */
    _id: string;
}
