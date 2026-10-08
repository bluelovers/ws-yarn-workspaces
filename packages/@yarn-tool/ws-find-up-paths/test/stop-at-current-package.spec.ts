//@noUnusedParameters:false

import { test, before, TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'path';
import { handleOptions } from '../index';
import { __root } from './__root';

/**
 * 以套件目錄下的 test 目錄作為起點，
 * 讓 cwd、rootData.pkg、rootData.root 三者可被清楚分辨
 */
const cwd = join(__root, 'test');

test(`stopAtCurrentPackage:true 停止於 rootData.pkg`, (t: TestContext) =>
{
	const baseline = handleOptions(cwd);
	const actual = handleOptions(cwd, {
		stopAtCurrentPackage: true,
	});

	console.dir(actual);

	t.assert.ok(typeof actual.cwd === 'string');
	t.assert.ok(Array.isArray(actual.stopPath));
	t.assert.ok(typeof actual.rootData.pkg === 'string');
	t.assert.ok(typeof actual.rootData.root === 'string');

	// 選項需保留並傳入 runtime.opts
	t.assert.strictEqual(actual.opts.stopAtCurrentPackage, true);

	// 起點維持為傳入的 cwd，不受此選項影響
	t.assert.strictEqual(actual.cwd, baseline.cwd);

	// 工作區根目錄的停止點仍然存在
	t.assert.strictEqual(actual.stopPath.includes(actual.rootData.root), true);

	// 必須停止於當前套件根目錄
	t.assert.strictEqual(actual.stopPath.includes(actual.rootData.pkg), true);

	// rootData.pkg 只會被加入一次（即使與工作區根目錄相同也不重複）
	t.assert.strictEqual(actual.stopPath.filter(v => v === actual.rootData.pkg).length, 1);

	// 相較未開啟選項，最多只會多出 rootData.pkg 一筆
	t.assert.ok(actual.stopPath.length <= baseline.stopPath.length + 1);
});

test(`stopAtCurrentPackage:false 與未設定行為一致`, () =>
{
	const baseline = handleOptions(cwd);
	const actual = handleOptions(cwd, {
		stopAtCurrentPackage: false,
	});

	console.dir(actual);

	assert.strictEqual(actual.opts.stopAtCurrentPackage, false);

	// 工作區根目錄的停止點仍然存在
	assert.strictEqual(actual.stopPath.includes(actual.rootData.root), true);

	// 關閉選項時，停止路徑與完全未設定時相同
	assert.deepStrictEqual(actual.stopPath, baseline.stopPath);
	assert.deepStrictEqual(actual.stopPath, handleOptions(cwd, { stopAtCurrentPackage: undefined }).stopPath);
});
