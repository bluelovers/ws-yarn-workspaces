import * as fs from 'fs-extra';
//import PACKAGE_JSON = require('./package.json');
import { sortPackageJson } from 'sort-package-json';
import pkgUp from 'pkg-up';
import bind from 'bind-decorator';
import { fixBinPath } from './util';
import path from 'path';
import { IPackageJson } from '@ts-type/package-dts';
import * as TsTypePackageDts from '@ts-type/package-dts';
import { Once } from 'lodash-decorators/once';

export { IPackageJson }

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
		return new this<T>(json, ...argv)
	}

	static findPackageJsonPath(name: string): string
	{
		return pkgUp.sync({
			cwd: require.resolve(name),
		});
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
			this.json = fs.readJSONSync(this.file);
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

		if (self.file && fs.existsSync(dir = self.dir))
		{
			if (self.data)
			{
				if (self.data.bin)
				{
					if (typeof self.data.bin === 'string')
					{
						let bin_new = fixBinPath(self.data.bin, dir);

						if (bin_new)
						{
							self.data.bin = bin_new;
						}
					}
					else if (typeof self.data.bin === 'object' && !Array.isArray(self.data.bin))
					{
						Object.keys(self.data.bin)
							.forEach(function (key)
							{
								if (typeof self.data.bin[key] === 'string')
								{
									let bin_new = fixBinPath(self.data.bin[key], dir);

									if (bin_new)
									{
										self.data.bin[key] = bin_new;
									}
								}
							})
						;
					}
				}

				if (!self.data.publishConfig
					&& self.data.name
					&& /\//.test(self.data.name)
					&& !self.data.private
				)
				{
					self.data.publishConfig = {
						access: "public",
					};
				}
			}
		}
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
		return fs.existsSync(this.file)
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

		fs.writeFileSync(this.file, this.stringify());

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

export declare module PackageJsonLoader
{
	export type IPackageJson = TsTypePackageDts.IPackageJson;
}

export default PackageJsonLoader
