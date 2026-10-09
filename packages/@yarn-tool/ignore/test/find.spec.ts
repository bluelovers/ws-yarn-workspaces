//@noUnusedParameters:false

import { test, type TestContext } from 'node:test'
import path from 'upath2'
import { DEFAULT_IGNORE_FILE_NAMES } from '../lib/names'
import {
	findIgnoreFileDirs,
	findIgnoreFilesGenerator,
	handleFindIgnoreFilesOptions,
	ICwdOrFindIgnoreFilesOptions,
	IFindIgnoreFilesOptions,
} from '../lib/find'
import { __ROOT, __TEST_FIXTURES } from './__root'

/**
 * 固定的搜尋起點：`test/fixtures/ignore-files/nested`
 * Fixed search start: `test/fixtures/ignore-files/nested`
 */
const __NESTED = path.join(__TEST_FIXTURES, 'ignore-files', 'nested')
const __FIXTURE_DIR = path.join(__TEST_FIXTURES, 'ignore-files')

/**
 * 攤平 generator 的 yield，取得由近至遠的 ignore 檔案路徑
 * Flatten the generator's yields into nearest-first ignore file paths
 */
function collectPaths(cwd?: ICwdOrFindIgnoreFilesOptions, opts?: IFindIgnoreFilesOptions): string[]
{
	const paths: string[] = []

	for (const { list } of findIgnoreFilesGenerator(cwd, opts))
	{
		for (const { path: filePath } of list)
		{
			paths.push(filePath)
		}
	}

	return paths
}

test(`handleFindIgnoreFilesOptions 預設停止於目前套件`, (t: TestContext) =>
{
	const cwd = path.join(__FIXTURE_DIR, 'nested')

	t.assert.strictEqual(handleFindIgnoreFilesOptions(cwd).stopAtCurrentPackage, true)
	t.assert.strictEqual(handleFindIgnoreFilesOptions(cwd).cwd, cwd)

	/**
	 * 傳入 false 時必須保留 false，否則無法開放向上搜尋至工作區
	 * Passing false must be kept, otherwise the search cannot open up to the workspace
	 */
	t.assert.strictEqual(handleFindIgnoreFilesOptions(cwd, { stopAtCurrentPackage: false }).stopAtCurrentPackage, false)
	t.assert.strictEqual(handleFindIgnoreFilesOptions({ cwd, stopAtCurrentPackage: false }).stopAtCurrentPackage, false)
})

test(`findIgnoreFileDirs 預設止於套件根目錄`, (t: TestContext) =>
{
	const dirs = findIgnoreFileDirs(__NESTED)

	t.assert.strictEqual(dirs[0], __NESTED)
	t.assert.ok(dirs.includes(__ROOT), `應包含目前套件根目錄 / should include the current package root`)
	t.assert.ok(dirs.every(v => v === __ROOT || v.startsWith(__ROOT + '/')), `不得超出目前套件 / must not go above the current package`)
})

test(`findIgnoreFileDirs stopAtCurrentPackage:false 延伸至工作區`, (t: TestContext) =>
{
	const stopped = findIgnoreFileDirs(__NESTED)
	const opened = findIgnoreFileDirs(__NESTED, { stopAtCurrentPackage: false })

	t.assert.ok(opened.length > stopped.length, `應比預設多出上層目錄 / should contain more directories than the default`)
	t.assert.ok(stopped.every((v,
		i,
	) => opened[i] === v), `預設結果應為延伸結果的前綴 / the default result should be a prefix of the extended one`)
	t.assert.notStrictEqual(opened.at(-1), __ROOT, `最上層應超出目前套件 / the topmost directory should go above the current package`)
})

test(`findIgnoreFilesGenerator 由近至遠找到 ignore 檔案`, (t: TestContext) =>
{
	const results = [...findIgnoreFilesGenerator(__NESTED)]

	/**
	 * 第一筆 yield 即為起點目錄本身，
	 * `name` 為相對於該目錄的路徑、`path` 為絕對路徑
	 * The first yield is the start directory itself; `name` is relative to that
	 * directory and `path` is absolute
	 */
	t.assert.strictEqual(results[0].dir, __NESTED)
	t.assert.strictEqual(results[0].list[0].name, '.dockerignore')
	t.assert.strictEqual(results[0].list[0].path, path.join(__NESTED, '.dockerignore'))

	const files = collectPaths(__NESTED)

	t.assert.strictEqual(files[0], path.join(__NESTED, '.dockerignore'), `最近的檔案排最前 / the nearest file comes first`)
	t.assert.ok(files.includes(path.join(__FIXTURE_DIR, '.gitignore')))
	t.assert.ok(files.includes(path.join(__FIXTURE_DIR, '.npmignore')))
	t.assert.ok(files.every(v => v === __ROOT || v.startsWith(__ROOT + '/')), `不得超出目前套件 / must not go above the current package`)
	t.assert.strictEqual(new Set(files).size, files.length, `不得重複 / must not contain duplicates`)
})

test(`findIgnoreFilesGenerator fileNames 自訂搜尋名稱`, (t: TestContext) =>
{
	const files = collectPaths(__NESTED, { fileNames: '.dockerignore' })

	t.assert.deepStrictEqual(files, [path.join(__NESTED, '.dockerignore')])
	t.assert.ok(DEFAULT_IGNORE_FILE_NAMES.includes('.gitignore'))
	t.assert.ok(DEFAULT_IGNORE_FILE_NAMES.includes('.npmignore'))
})

test(`findIgnoreFilesGenerator deep:0 不向子目錄遍歷`, (t: TestContext) =>
{
	/**
	 * `nested/.dockerignore` 位於子目錄，由父目錄搜尋時不得被找到
	 * `nested/.dockerignore` lives in a subdirectory and must not be found from the parent directory
	 */
	const files = collectPaths(__FIXTURE_DIR, { fileNames: '.dockerignore' })

	t.assert.deepStrictEqual(files, [], `不向下遍歷 / must not descend into subdirectories`)
})
