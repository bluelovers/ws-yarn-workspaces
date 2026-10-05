/**
 * package.json 依賴欄位的新增與檢查 (Add and check package.json dependency fields)
 *
 * 所有函式皆直接操作傳入的 `package.json` 物件而不負責寫檔，
 * 讓呼叫端可以先批次修改、排序，再一次落盤。
 *
 * Every helper mutates the given package.json object and never writes to disk,
 * so callers can batch edits, sort, and persist once at the end.
 */
import { IFindRootOptions } from '@yarn-tool/find-root';
import { IPackageJson } from '@ts-type/package-dts/package-json';
import {
	IDependency,
	IPackageJsonDependenciesField,
	IVersionValue,
	packageJsonDependenciesFields,
} from '@ts-type/package-dts/lib/package-json/types';
import { ITSArrayListMaybeReadonly } from 'ts-type/lib/type/base';
import { ITSPartialRecord } from 'ts-type/lib/type/record';

/**
 * 寫入依賴的結果列舉 (Result of adding a dependency)
 *
 * 刻意跳過 0，讓 `null`（完全未寫入任何欄位）可與這兩個狀態明確區分。
 *
 * 0 is deliberately skipped so `null` (nothing written at all) stays distinct
 * from these two states.
 */
export const enum EnumResultAddDependencies
{
	/**
	 * 本次有寫入或更新 (Written or updated by this call)
	 */
	changed = 2,

	/**
	 * 套件已存在且未變更 (Already present, unchanged)
	 */
	exists = 1,
}

/**
 * 新增依賴時的選項 (Options when adding a dependency)
 *
 * 繼承 `IFindRootOptions` 的部分欄位，使同一組選項也能交給 `findRoot` 使用。
 * Extends parts of `IFindRootOptions` so the same object can be handed to
 * `findRoot` unchanged.
 */
export interface IOptionsAddDepsToPackageJson extends Partial<IFindRootOptions>
{
	/**
	 * 基準目錄，供尋找專案根目錄時使用 (Base directory used to locate the project root)
	 */
	cwd?: string,

	/**
	 * 要修改的 `package.json` 內容 (The package.json object to mutate)
	 */
	pkg?: IPackageJson,

	/**
	 * 寫入 `devDependencies` (Write into devDependencies)
	 */
	dev?: boolean,

	/**
	 * 寫入 `peerDependencies` (Write into peerDependencies)
	 */
	peer?: boolean,

	/**
	 * 寫入 `optionalDependencies` (Write into optionalDependencies)
	 */
	optional?: boolean,
}

/**
 * 檢查單一依賴記錄是否含指定套件 (Check a single dependency record for a package)
 *
 * Check whether one dependency record contains the given package.
 *
 * @param record 依賴欄位的鍵值對，可為唯讀陣列型別的版本字串
 *               The dependency record, whose values may be readonly string arrays
 * @param name 套件名稱 (Package name)
 *
 * @returns 型別守衛：`true` 時保證該鍵存在且版本字串非空
 *
 * A type guard: when `true`, the key is guaranteed to exist with a non-empty
 * version value.
 */
export function _checkDependenciesExists<N extends string, T extends ITSArrayListMaybeReadonly<string>>(record: IDependency<T>,
	name: N,
): record is IDependency<T> & IDependency<N>
{
	/**
	 * 先確認 `record` 可能存在（欄位本身可能未定義），再檢查長度大於 0
	 *
	 * The record itself may be undefined, so it is null-checked before the
	 * length test, which also rejects empty version strings.
	 */
	return record?.[name as any]?.length > 0
}

/**
 * 檢查指定依賴欄位是否含指定套件 (Check one dependency field for a package)
 *
 * Check whether a specific dependency field lists the given package.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param field 依賴欄位名稱 (Dependency field name)
 * @param name 套件名稱 (Package name)
 *
 * @returns 型別守衛：成功時把 `pkg` 窄化成含該欄位與該套件的型別
 *
 * A type guard that narrows `pkg` to include the field and the package.
 */
export function checkDependenciesExists<N extends string, T extends IPackageJsonDependenciesField, P extends IPackageJson = IPackageJson>(pkg: P,
	field: T,
	name: N,
): pkg is P & Record<T, Record<N, IVersionValue>>
{
	return _checkDependenciesExists(pkg[field], name)
}

/**
 * 依指定欄位清單逐一檢查存在性 (Check existence across a list of fields)
 *
 * Check several dependency fields at once and report every hit.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param fields 要檢查的依賴欄位清單 (Dependency fields to check)
 * @param name 套件名稱 (Package name)
 *
 * @returns 以欄位為鍵的布林值，另含 `_field`（命中的欄位）與 `_exists`（是否有任一命中）
 *
 * Booleans keyed by field, plus `_field` (the matching fields) and `_exists`
 * (whether any field matched).
 */
export function _checkDependenciesExistsAll<N extends string, T extends IPackageJsonDependenciesField, P extends IPackageJson = IPackageJson>(pkg: P,
	fields: ITSArrayListMaybeReadonly<T>, name: N)
{
	return (fields as T[])
		.reduce((map, field) =>
		{
			map[field] = checkDependenciesExists(pkg, field, name);

			/**
			 * 只有命中時才累積 `_field` 與 `_exists`，
			 * 讓回傳值同時提供「哪個欄位」與「是否存在」兩種資訊。
			 *
			 * Hits accumulate into `_field` and `_exists`, so the result answers
			 * both "which field" and "does it exist anywhere".
			 */
			if (map[field])
			{
				map._field.push(field);
				map._exists = map[field];
			}

			return map
		}, {
			_exists: false,
			_field: [],
		} as {
			_exists: boolean,
			_field: IPackageJsonDependenciesField[],
		} & ITSPartialRecord<IPackageJsonDependenciesField, boolean>)
		;
}

/**
 * 檢查四種依賴欄位是否含指定套件 (Check all dependency fields for a package)
 *
 * Check every dependency field for the given package.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param name 套件名稱 (Package name)
 *
 * @returns 同 {@link _checkDependenciesExistsAll}，欄位固定為 `packageJsonDependenciesFields`
 *
 * Same as {@link _checkDependenciesExistsAll} with the fields fixed to
 * `packageJsonDependenciesFields`.
 */
export function checkDependenciesExistsAll<N extends string, P extends IPackageJson = IPackageJson>(pkg: P, name: N,
)
{
	return _checkDependenciesExistsAll(pkg, packageJsonDependenciesFields, name)
}

/**
 * 欄位層的核心寫入 (Low-level write into a dependency field)
 *
 * Core write that only ensures the field object exists before assigning.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param field 依賴欄位名稱 (Dependency field name)
 * @param name 套件名稱 (Package name)
 * @param semver 要寫入的版本字串 (Version string to write)
 *
 * @returns 同一個 `pkg`（就地修改）
 *
 * The same `pkg`, mutated in place.
 */
export function _add_to_deps_field_core<T extends IPackageJson>(pkg: T,
	field: IPackageJsonDependenciesField,
	name: string,
	semver: string,
)
{
	/**
	 * 欄位可能整個不存在（例如全新的 `package.json`），先建立空物件避免拋錯
	 *
	 * The whole field may be absent (fresh package.json), so it is created first
	 * to avoid writing into undefined.
	 */
	pkg[field] ??= {};
	pkg[field][name] = semver;

	return pkg;
}

/**
 * 依覆寫策略把套件寫入指定欄位 (Write a package into a field by overwrite policy)
 *
 * Write a package into one dependency field honouring the overwrite policy.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param field 依賴欄位名稱 (Dependency field name)
 * @param name 套件名稱 (Package name)
 * @param semver 要寫入的版本字串 (Version string to write)
 * @param override 已存在時是否仍覆寫 (Whether to overwrite when it already exists)
 * @param bool 進入本函式前的結果，供多欄位呼叫端累積狀態
 *             Result so far, accumulated by callers that write several fields
 * @param existsOnly `true` 只在已存在時覆寫、`false` 只在不存在時新增
 *                   `true` overwrites only existing entries, `false` only adds new ones
 *
 * @returns 更新後的 `EnumResultAddDependencies`，未發生變更時沿用傳入的 `bool`
 *
 * The updated `EnumResultAddDependencies`, or the incoming `bool` when nothing
 * changed.
 */
export function _add_to_deps_field(pkg: IPackageJson,
	field: IPackageJsonDependenciesField,
	name: string,
	semver: string,
	override: boolean,
	bool: EnumResultAddDependencies,
	existsOnly?: boolean,
)
{
	const record = pkg[field] ?? {};
	const current = record[name];

	/**
	 * 版本完全相同時直接回傳原結果，避免把「無變更」誤報成 `changed`
	 *
	 * An identical version short-circuits, so "no change" is never reported as
	 * `changed`.
	 */
	if (current !== semver)
	{
		const length = current?.length;

		/**
		 * `existsOnly` 採三態設計：三種情況各自的寫入條件不同，
		 * 合併成單一布林值會喪失「只更新既有依賴」這種常見需求。
		 *
		 * `existsOnly` is a three-state switch because each mode has its own write
		 * condition; collapsing it into a boolean would lose the common
		 * "update only what is already listed" behaviour.
		 */
		if (existsOnly === true)
		{
			if (length)
			{
				_add_to_deps_field_core(pkg, field, name, semver);

				bool = EnumResultAddDependencies.changed;
			}
		}
		else if (existsOnly === false)
		{
			if (!length)
			{
				_add_to_deps_field_core(pkg, field, name, semver);

				bool = EnumResultAddDependencies.changed;
			}
		}
		else
		{
			if (!length || override === true)
			{
				_add_to_deps_field_core(pkg, field, name, semver);

				bool = EnumResultAddDependencies.changed;
			}
		}

		/**
		 * 已有值卻未寫入時標記為 `exists`；用 `??=` 是為了不覆蓋剛剛設定的 `changed`。
		 *
		 * An existing value that was not rewritten becomes `exists`; `??=` keeps
		 * a freshly assigned `changed` from being overwritten.
		 */
		if (length)
		{
			bool ??= EnumResultAddDependencies.exists;
		}
	}

	return bool
}

/**
 * 把套件新增到指定的依賴欄位 (Add a package to the chosen dependency fields)
 *
 * Add a package to the dependency fields selected by the options.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param name 套件名稱 (Package name)
 * @param semver 要寫入的版本字串 (Version string to write)
 * @param options 選擇目標欄位的選項 (Options selecting the target fields)
 * @param override 已存在時是否仍覆寫 (Whether to overwrite when it already exists)
 * @param existsOnly `true` 只在已存在時覆寫、`false` 只在不存在時新增
 *                   `true` overwrites only existing entries, `false` only adds new ones
 *
 * @returns `{ pkg, bool }`：`pkg` 為被修改的物件，`bool` 為結果列舉；
 * 未指定任何欄位或完全未寫入時 `bool` 為 `null`。
 *
 * `{ pkg, bool }` where `pkg` is the mutated object and `bool` is the result
 * enum; `bool` is `null` when no field was selected or nothing was written.
 */
export function addDependencies(pkg: IPackageJson,
	name: string,
	semver: string,
	options: IOptionsAddDepsToPackageJson = {},
	override?: boolean,
	existsOnly?: boolean,
)
{
	let bool: EnumResultAddDependencies = null;

	/**
	 * 三種特殊欄位各自判斷：可能同時啟用（例如 `--dev --peer`），
	 * 因此不能用 else-if 只取其中一個。
	 *
	 * Each special field is tested independently because several may be enabled
	 * at once (e.g. `--dev --peer`), so else-if would drop one of them.
	 */
	if (options.dev)
	{
		bool = _add_to_deps_field(pkg,
			'devDependencies',
			name,
			semver,
			override,
			bool,
			existsOnly,
		);
	}

	if (options.peer)
	{
		bool = _add_to_deps_field(pkg,
			'peerDependencies',
			name,
			semver,
			override,
			bool,
			existsOnly,
		);
	}

	if (options.optional)
	{
		bool = _add_to_deps_field(pkg,
			'optionalDependencies',
			name,
			semver,
			override,
			bool,
			existsOnly,
		);
	}

	/**
	 * 只有在沒有任何特殊欄位被啟用（`bool` 仍為 `null`）時才寫入 `dependencies`，
	 * 讓一般情況與 `--dev` 之類的選項互斥，避免同一套件被寫進兩個欄位。
	 *
	 * `dependencies` is only written when no special field was selected
	 * (`bool` is still null), keeping the default path mutually exclusive with
	 * flags like `--dev` so one package is not written into two fields.
	 */
	if (bool === null)
	{
		bool = _add_to_deps_field(pkg,
			'dependencies',
			name,
			semver,
			override,
			bool,
			existsOnly,
		);
	}

	return {
		pkg,
		bool,
	}
}

/**
 * 僅在不存在時新增依賴 (Add the dependency only if missing)
 *
 * Add the dependency only when it is not already listed.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param name 套件名稱 (Package name)
 * @param semver 要寫入的版本字串 (Version string to write)
 * @param options 選擇目標欄位的選項 (Options selecting the target fields)
 *
 * @returns 同 {@link addDependencies}，且 `override` 固定為 `false`
 *
 * Same as {@link addDependencies} with `override` fixed to `false`.
 */
export function addDependenciesIfNotExists(pkg: IPackageJson,
	name: string,
	semver: string,
	options: IOptionsAddDepsToPackageJson = {},
)
{
	return addDependencies(pkg, name, semver, options, false)
}

/**
 * 一律覆寫依賴版本 (Always overwrite the dependency version)
 *
 * Overwrite the dependency version unconditionally.
 *
 * @param pkg package.json 物件 (The package.json object)
 * @param name 套件名稱 (Package name)
 * @param semver 要寫入的版本字串 (Version string to write)
 * @param options 選擇目標欄位的選項 (Options selecting the target fields)
 *
 * @returns 同 {@link addDependencies}，且 `override` 固定為 `true`
 *
 * Same as {@link addDependencies} with `override` fixed to `true`.
 */
export function addDependenciesOverwrite(pkg: IPackageJson,
	name: string,
	semver: string,
	options: IOptionsAddDepsToPackageJson = {},
)
{
	return addDependencies(pkg, name, semver, options, true)
}

/**
 * 預設匯出 `addDependencies` (Default export)
 *
 * The default export is `addDependencies`.
 */
export default addDependencies
