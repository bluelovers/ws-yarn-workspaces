/**
 * 套件進入點 (Entrypoint)：提供將根目錄 yarn.lock 同步到各 workspace 套件的函式。
 *
 * Package entry point: provides the function that syncs the root yarn.lock
 * into every workspace package.
 *
 * Created by user on 2020/1/8.
 */
import { workspacesPackagesList } from 'ws-pkg-list';
import findRoot from '@yarn-tool/find-root';
import fs from 'fs-extra';
import path from 'path';

/**
 * 以 `cwd` 為起點尋找 workspace 根目錄，並將根目錄的 `yarn.lock` 複製到
 * 每一個 workspace 套件。
 *
 * Locates the workspace root from `cwd` and copies the root `yarn.lock` into
 * every workspace package.
 *
 * @param cwd 起始目錄，向上尋找 workspace 根目錄 / start directory used to
 * search upward for the workspace root
 * @param options 列印與錯誤處理選項 / printing and error handling options
 * @returns 成功同步回傳 `true`；失敗時依 `noThrowError` 回傳 `null` 或丟出
 * `Error` /
 * `true` on success; on failure either `null` or a thrown `Error`,
 * depending on `noThrowError`
 */
export function syncLockfile(cwd: string, options: {
	/** 是否印出處理過程與計時 / whether to print progress and timing */
	print?: boolean,
	/** 失敗時回傳 null 而非丟錯 / return null instead of throwing on failure */
	noThrowError?: boolean,
} = {})
{
	const { print, noThrowError } = options;

	/**
	 * 從 cwd 向上尋找 workspace 根目錄，讓 CLI 與 API 都能以任意子目錄呼叫。
	 *
	 * Searches upward from cwd so both the CLI and the API can be invoked
	 * from any subdirectory.
	 */
	const ws = findRoot({
		cwd
	});

	/**
	 * 目標不是 workspace 時無法決定要複製到哪裡，
	 * 依 `noThrowError` 決定丟錯或以 null 表示「未執行」。
	 *
	 * Without a workspace there is nowhere to copy to, so `noThrowError`
	 * decides between throwing and returning null ("not executed").
	 */
	if (!ws.hasWorkspace)
	{
		noThrowError || throwError(`target dir not a yarn workspaces, ${ws.root}`);
		return null;
	}

	const lockfile = `yarn.lock`;
	const lockfile_root = path.join(ws.root, lockfile);

	/**
	 * 根目錄沒有 yarn.lock 時無從複製，同樣交由 `noThrowError` 決定處理方式，
	 * 以維持與上一個失敗分支一致的回傳契約 (contract)。
	 *
	 * With no root yarn.lock there is nothing to copy; this branch follows the
	 * same `noThrowError` handling to keep one consistent failure contract.
	 */
	if (!fs.pathExistsSync(lockfile_root))
	{
		noThrowError || throwError(`yarn.lock not exists`);
		return null;
	}

	print && console.log(`workspaces:`, ws.root, '\n');

	const label = `copy done`;

	/**
	 * 以 console.time 包住整批複製，讓 print 模式可同時看到每個目標與總耗時。
	 *
	 * Wraps the whole copy loop in console.time so print mode reports both
	 * each target and the total elapsed time.
	 */
	print && console.time(label);

	/**
	 * 逐一複製到所有 workspace 套件；每個套件都覆寫成根目錄的同一份內容，
	 * 這正是本工具的目的——讓子套件的 lockfile 與根目錄保持一致。
	 *
	 * Copies into every workspace package, overwriting each one with the same
	 * root content; that is precisely the point of this tool — keeping
	 * sub-package lockfiles identical to the root.
	 */
	workspacesPackagesList(ws.root, true)
		.forEach(pkg_dir => {

			print && console.log(`copy to... ${path.relative(ws.root, pkg_dir)}`);

			/**
			 * 覆寫舊檔並保留時間戳記 (timestamps)、解引用 (dereference)
			 * 符號連結，確保子套件拿到的是實體檔案而非連結本體。
			 *
			 * Overwrites the old file while preserving timestamps and
			 * dereferencing symlinks, so sub-packages receive a real file
			 * rather than the link itself.
			 */
			fs.copySync(lockfile_root, path.join(pkg_dir, lockfile), {
				overwrite: true,
				preserveTimestamps: true,
				dereference: true,
			})

		})
	;

	print && console.timeEnd(label);

	return true;
}

/**
 * 統一錯誤出口 (error exit)：讓失敗訊息集中在一處，方便日後調整錯誤格式。
 *
 * Single error exit point: keeps failure messages in one place so the error
 * format can be adjusted centrally later.
 *
 * @param message 丟出的錯誤訊息 / the error message to throw
 */
function throwError(message: string)
{
	throw new Error(message)
}

/**
 * 預設匯出 (Default export) 指向 syncLockfile，
 * 讓 `import syncLockfile from 'sync-lockfile'` 成為最短的使用方式。
 *
 * The default export points to syncLockfile so the shortest import form
 * remains the primary usage.
 */
export default syncLockfile
