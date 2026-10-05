/**
 * 更新報告 (Update report) 的資料結構：記錄被移除、等待 yarn 重新解析的 lockfile 項目。
 *
 * Shape of the update report: lockfile entries that were removed and left for
 * yarn to re-resolve on the next install.
 */
export interface IYarnLockUpdateReport
{
	/**
	 * 以 lockfile 項目鍵值 (entry key) 為索引，記錄每個被移除項目更新前後的版本號。
	 *
	 * Indexed by the lockfile entry key; stores the before/after version of
	 * each removed entry.
	 */
	removed?: Record<string, {
		/** 移除前鎖定的版本 (Version locked before the update). */
		from: string,
		/** 查詢到的較新版本，將由 yarn 重新解析 (Newer version found, to be re-resolved by yarn). */
		to: string,
	}>
}

/**
 * updateYarnLockTag 的回傳值：同時保留新舊 lockfile 內容與差異報告，
 * 讓呼叫端可在不寫檔的情況下先判斷是否有變動。
 *
 * Return value of updateYarnLockTag; keeps both the old and new lockfile
 * content together with the diff report, so callers can check for changes
 * before touching the disk.
 */
export interface IYarnLockUpdate
{
	/** 經標準序列化後的原始 lockfile 內容 (Normalised original lockfile content). */
	yarnlock_old: string,
	/** 更新後的 lockfile 內容 (Updated lockfile content). */
	yarnlock_new: string,
	/** 新舊內容是否有差異，用來避免多餘的寫檔動作 (Whether content changed, to avoid unnecessary writes). */
	yarnlock_changed: boolean,
	/** 本次更新的差異報告 (Diff report of this update). */
	report: IYarnLockUpdateReport,
}
