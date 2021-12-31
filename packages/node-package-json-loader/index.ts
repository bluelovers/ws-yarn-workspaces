import { pathExistsSync, writeFileSync } from 'fs-extra';
import { sortPackageJson } from 'sort-package-json3';
import bind from 'bind-decorator';
import path from 'path';
import { IPackageJson } from '@ts-type/package-dts';
import { resolvePackageJsonLocation } from '@yarn-tool/resolve-package';
import { _pkgExportsAddPJsonEntryCore } from '@yarn-tool/pkg-entry-util/lib/field/exports';
import { readJSONSync, writeJSONSync } from '@bluelovers/fs-json';
import { fixPublishConfig } from '@yarn-tool/pkg-entry-util/lib/field/publishConfig';
import { fixBinPath, fixPkgBinField } from '@yarn-tool/pkg-entry-util/lib/field/bin';

type IFileOrJson = Buffer | string | object | IPackageJson

type IPackageJsonLike<T> = Partial<T> | Record<string, any>;

type IItemOrItemArray<T> = T | T[];

export class PackageJsonLoader<T extends IPackageJsonLike<IPackageJson> = IPackageJson>
{
	readonly file: string;
	protected json: T;
	loaded: boolean;

	protected _use: ((json: IPackageJsonLike<T>) => void)[] = [];

	@bind
	static create<T = IPackageJson>(file: IFileOrJson, ...argv)
	{
		return new this<T>(file, ...argv)
	}

	static createByJson<T = IPackageJson>(json: T, ...argv)
	{
		return new this<T>(json as any, ...argv)
	}

	static findPackageJsonPath(name: string): string
	{
		return resolvePackageJsonLocation(name);
	}

	@bind
	static loadByModuleName<T = IPackageJson>(name: string)
	{
		let file = this.findPackageJsonPath(name);

		let pkg = this.create<T>(file);

		if ((pkg.data as any).name !== name)
		{
			throw new TypeError(`package name not match, '${(pkg.data as any).name}' != '${name}'`);
		}

		return pkg;
	}

	constructor(fileOrJson: IFileOrJson, ...argv)
	{
		if (typeof fileOrJson === 'string')
		{
			this.setFilename(fileOrJson)
		}
		else if (Buffer.isBuffer(fileOrJson))
		{
			this.setJson(JSON.parse(fileOrJson.toString()))
		}
		else if (typeof fileOrJson === 'object')
		{
			this.setJson(JSON.parse(fileOrJson.toString()))
		}
		else if (fileOrJson != null)
		{
			throw new TypeError(`fileOrJson is not valid`)
		}
	}

	use(ls: IItemOrItemArray<(json: IPackageJsonLike<T>) => void>)
	{
		if (Array.isArray(ls))
		{
			this._use.push(...ls);
		}
		else
		{
			this._use.push(ls);
		}
	}

	setFilename(file: string)
	{
		// @ts-ignore
		this.file = file;

		return this;
	}

	setJson(json: object | T)
	{
		this.loaded = true;
		this.json = json as T;

		return this;
	}

	read(reload?: boolean)
	{
		if (!this.loaded || reload)
		{
			this.json = readJSONSync(this.file);
		}

		this.loaded = true;

		return this;
	}

	get dir()
	{
		return path.dirname(this.file)
	}

	/**
	 * skip typescript type check
	 */
	get unsafeTypeData(): IPackageJsonLike<T>
	{
		return this.data as any;
	}

	/**
	 * skip typescript type check
	 */
	set unsafeTypeData(json)
	{
		this.data = json as any;
	}

	set data(json: T)
	{
		this.overwrite(json);
	}

	get data(): T
	{
		if (!this.loaded && this.file)
		{
			this.read();
		}

		return this.json;
	}

	overwrite(json: object | T)
	{
		this.loaded = true;
		this.json = json as T;

		return this;
	}

	autofix()
	{
		let self = this;
		let dir: string;

		if (self.file && pathExistsSync(dir = self.dir))
		{
			if (self.data)
			{
				fixPkgBinField(self.data, dir);
				fixPublishConfig(self.data);
			}
		}

		_pkgExportsAddPJsonEntryCore(self.data?.exports);
	}

	run(options: {
		autofix?: boolean
	} = {})
	{
		if (options.autofix == null || options.autofix)
		{
			this.autofix();
		}

		this._use.forEach(fn => fn.call(this, this.data));

		return this;
	}

	exists()
	{
		return pathExistsSync(this.file)
	}

	stringify()
	{
		return JSON.stringify(this.json, null, 2)
	}

	sort()
	{
		if (typeof this.data === 'undefined' || this.data === null)
		{
			throw new Error(`data is undefined`)
		}

		this.data = sortPackageJson(this.data);

		return this;
	}

	write()
	{
		if (!this.file)
		{
			throw new Error(`file is undefined`)
		}

		writeFileSync(this.file, this.stringify() + '\n');

		return this;
	}

	writeOnlyWhenLoaded()
	{
		if (this.loaded)
		{
			this.write();
		}

		return this.loaded;
	}
}

export default PackageJsonLoader
