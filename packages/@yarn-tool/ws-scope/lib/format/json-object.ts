import { arrayAdd, arrayRemove } from '../util/arrayAdd';

export type IJsonObject<K extends string> =
	{
		[p in K]: string[]
	}

export class ScopeJsonObject<K extends string = 'workspaces'>
{
	json: IJsonObject<K>;
	changed: boolean = false;
	field: K;

	constructor(readonly file: string, protected options?: {
		field?: K,
	})
	{
		this._init();
	}

	protected _init()
	{
		// @ts-ignore
		this.field = this.options?.field ?? 'workspaces';
	}

	get opened()
	{
		return !!this.json
	}

	add(scope: string)
	{
		let { changed, value } = arrayAdd(scope, this.value);

		this.value = value;
		this.changed ||= changed;

		return this.changed
	}

	addLazy(scope: string)
	{
		return this.opened && this.add(scope)
	}

	remove(scope: string)
	{
		if (this.opened)
		{
			let { changed, value } = arrayRemove(scope, this.value);

			this.value = value;
			this.changed ||= changed;
		}

		return this.changed
	}

	removeLazy(scope: string)
	{
		return this.opened && this.remove(scope)
	}

	get value()
	{
		return this.json?.[this.field]
	}

	set value(value: string[])
	{
		this.json[this.field] = value;
	}

}
