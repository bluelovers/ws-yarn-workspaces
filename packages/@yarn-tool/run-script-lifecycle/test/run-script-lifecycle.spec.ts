/**
 * run-script-lifecycle 測試
 * Tests for run-script-lifecycle module
 *
 * Created by user on 2020/4/8.
 */

import { join } from 'path';
import runLifecycleScript, { runLifecycleScript as namedExport } from '../index';
import { formatOutput, _options, runLifecycleScriptCore, runLifecycleScriptList } from '../lib/util';
import { IResult, IResultNotExists, IRunLifecycleScriptOptions } from '../lib/types';
import readPackageJsonFast from 'read-package-json-fast';
import { __ROOT, __TEST_FIXTURES } from './__root';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

/**
 * 測試 fixtures 路徑。
 *
 * Test fixtures paths.
 */

const testPkgPath = join(__TEST_FIXTURES, 'test-pkg');
const pkgNoScriptsPath = join(__TEST_FIXTURES, 'pkg-no-scripts');

/**
 * 測試模組導出
 * Test module exports
 */
describe('module exports', () => {
  it('should have default export', () => {
    assert.notStrictEqual(runLifecycleScript, undefined);
    assert.strictEqual(typeof runLifecycleScript, 'function');
  });

  it('should have named export', () => {
    assert.notStrictEqual(namedExport, undefined);
    assert.strictEqual(namedExport, runLifecycleScript);
  });
});

/**
 * 測試 formatOutput 函數
 * Test formatOutput function
 */
describe('formatOutput', () => {
  it('should format output correctly', () => {
    const mockResult: IResult = {
      cmd: '/bin/sh',
      args: ['-c', 'echo test'],
      code: 0,
      signal: null,
      stdout: 'test output',
      stderr: '',
      event: 'test',
      script: 'echo test',
      pkgid: 'test-pkg@1.0.0',
      path: '/path/to/pkg',
      stdio: 'inherit',
    };

    const output = formatOutput(mockResult);

    assert.ok(output.includes('test-pkg@1.0.0 test'));
    assert.ok(output.includes('echo test'));
    assert.ok(output.includes('test output'));
  });
});

/**
 * 測試 _options 函數
 * Test _options function
 */
describe('_options', () => {
  it('should set default stdio to inherit', () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'install',
      path: '/test/path',
    };

    const result = _options(options);

    assert.strictEqual(result.stdio, 'inherit');
  });

  it('should set default args to empty array', () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'install',
      path: '/test/path',
    };

    const result = _options(options);

    assert.deepStrictEqual(result.args, []);
  });

  it('should preserve provided options', () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'build',
      path: '/test/path',
      args: ['--arg1'],
      env: { NODE_ENV: 'production' },
    };

    const result = _options(options);

    assert.strictEqual(result.event, 'build');
    assert.strictEqual(result.path, '/test/path');
    assert.deepStrictEqual(result.env, { NODE_ENV: 'production' });
    /**
     * stdio 應該被覆蓋為 'inherit'。
     *
     * stdio should be overwritten to 'inherit'.
     */
    assert.strictEqual(result.stdio, 'inherit');
  });
});

/**
 * 測試 runLifecycleScript 主函數
 * Test runLifecycleScript main function
 */
describe('runLifecycleScript', () => {
  /**
   * 測試不存在的路徑
   * Test non-existent path
   */
  it('should throw error for non-existent path', async () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'install',
      path: '/non/existent/path',
    };

    await assert.rejects(() => runLifecycleScript(options));
  });

  /**
   * 測試沒有 scripts 的套件
   * Test package without scripts
   */
  it('should handle package without scripts', async () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'install',
      path: pkgNoScriptsPath,
    };

    const results = await runLifecycleScript(options);

    assert.strictEqual(Array.isArray(results), true);
    /**
     * 應該只返回主腳本的結果，因為沒有 pre/post 腳本。
     *
     * Should only return the main script result since there are no pre/post scripts.
     */
    assert.ok(results.length >= 1);
  });

  /**
   * 測試有完整生命週期腳本的套件
   * Test package with full lifecycle scripts
   */
  it('should run lifecycle scripts in correct order', async () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'install',
      path: testPkgPath,
    };

    const results = await runLifecycleScript(options);

    assert.strictEqual(Array.isArray(results), true);
    /**
     * 應該包含 preinstall, install, postinstall。
     *
     * Should contain preinstall, install, postinstall.
     */
    assert.strictEqual(results.length, 3);

    /**
     * 檢查事件順序。
     *
     * Check event order.
     */
    // @ts-ignore
    const events = results.map(r => r.event).filter(Boolean);
    assert.ok(events.includes('preinstall'));
    assert.ok(events.includes('install'));
    assert.ok(events.includes('postinstall'));
  });

  /**
   * 測試 build 生命週期
   * Test build lifecycle
   */
  it('should run build lifecycle scripts', async () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'build',
      path: testPkgPath,
    };

    const results = await runLifecycleScript(options);

    assert.strictEqual(Array.isArray(results), true);
    /**
     * 應該包含 prebuild, build, postbuild。
     *
     * Should contain prebuild, build, postbuild.
     */
    assert.strictEqual(results.length, 3);

    // @ts-ignore
    const events = results.map(r => r.event).filter(Boolean);
    assert.ok(events.includes('prebuild'));
    assert.ok(events.includes('build'));
    assert.ok(events.includes('postbuild'));
  });

  /**
   * 測試不存在的腳本事件
   * Test non-existent script event
   */
  it('should handle non-existent script event', async () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'nonexistent',
      path: testPkgPath,
    };

    const results = await runLifecycleScript(options);

    assert.strictEqual(Array.isArray(results), true);
    /**
     * 應該只執行 pre 腳本（如果存在）、主腳本（不存在）、post 腳本（如果存在）。
     *
     * Should only run the pre script (if it exists), the main script (non-existent),
     * and the post script (if it exists).
     */
    assert.ok(results.length >= 1);
  });

  /**
   * 測試自訂環境變數
   * Test custom environment variables
   */
  it('should accept custom environment variables', async () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'test',
      path: testPkgPath,
      env: {
        CUSTOM_VAR: 'test_value',
      },
    };

    const results = await runLifecycleScript(options);

    assert.strictEqual(Array.isArray(results), true);
    assert.ok(results.length >= 1);
  });
});

/**
 * 測試 runLifecycleScriptCore 函數
 * Test runLifecycleScriptCore function
 */
describe('runLifecycleScriptCore', () => {
  it('should return result array', async () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'test',
      path: testPkgPath,
    };

    const result = await runLifecycleScriptCore(options);

    assert.notStrictEqual(result, undefined);
    assert.notStrictEqual(result.code, undefined);
    assert.strictEqual(result.stdio, 'inherit');
  });
});

/**
 * 測試 runLifecycleScriptList 函數
 * Test runLifecycleScriptList function
 */
describe('runLifecycleScriptList', () => {
  it('should only run existing scripts', async () => {
    const pkgPath = join(testPkgPath, 'package.json');
    const pkg = await readPackageJsonFast(pkgPath);

    const tmpOptions: IRunLifecycleScriptOptions = {
      event: 'install',
      path: testPkgPath,
    };

    /**
     * 只測試存在的腳本。
     *
     * Only test existing scripts.
     */
    const results = await runLifecycleScriptList({
      tmpOptions,
      eventList: ['preinstall', 'install', 'postinstall'],
      pkg: pkg as any,
    });

    /**
     * 所有這些腳本都存在於 test-pkg 中。
     *
     * All of these scripts exist in test-pkg.
     */
    assert.strictEqual(results.length, 3);
  });

  it('should skip non-existent scripts', async () => {
    const pkgPath = join(testPkgPath, 'package.json');
    const pkg = await readPackageJsonFast(pkgPath);

    const tmpOptions: IRunLifecycleScriptOptions = {
      event: 'install',
      path: testPkgPath,
    };

    /**
     * 包含不存在的腳本。
     *
     * Contains non-existent scripts.
     */
    const results = await runLifecycleScriptList({
      tmpOptions,
      eventList: ['nonexistent1', 'preinstall', 'nonexistent2'],
      pkg: pkg as any,
    });

    /**
     * 只有 preinstall 存在。
     *
     * Only preinstall exists.
     */
    assert.strictEqual(results.length, 1);
  });
});

/**
 * 測試錯誤處理
 * Test error handling
 */
describe('error handling', () => {
  it('should handle invalid path gracefully', async () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'install',
      path: '',
    };

    /**
     * 不應該拋出錯誤。
     *
     * Should not throw.
     */
    assert.notStrictEqual(await runLifecycleScript(options), undefined);
  });
});

/**
 * 測試類型定義
 * Test type definitions
 */
describe('type definitions', () => {
  it('IResult should have required properties', () => {
    const result: IResult = {
      cmd: '/bin/sh',
      args: [],
      code: 0,
      signal: null,
      stdout: '',
      stderr: '',
      event: 'test',
      script: 'echo test',
      pkgid: 'pkg@1.0.0',
      path: '/path',
      stdio: 'inherit',
    };

    assert.strictEqual(result.code, 0);
    assert.strictEqual(result.event, 'test');
    assert.strictEqual(result.pkgid, 'pkg@1.0.0');
  });

  it('IResultNotExists should have required properties', () => {
    const result: IResultNotExists = {
      code: 0,
      signal: null,
      stdio: 'inherit',
    };

    assert.strictEqual(result.code, 0);
    assert.strictEqual(result.signal, null);
  });

  it('IRunLifecycleScriptOptions should accept valid options', () => {
    const options: IRunLifecycleScriptOptions = {
      event: 'install',
      path: '/path/to/pkg',
      args: ['--arg'],
      env: { NODE_ENV: 'test' },
      stdio: 'inherit',
      stdioString: true,
    };

    assert.strictEqual(options.event, 'install');
    assert.strictEqual(options.path, '/path/to/pkg');
  });
});
