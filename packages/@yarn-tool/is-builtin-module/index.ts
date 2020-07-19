import builtinsFn from 'builtins';

export function createNewIsBuiltinModule(options?: {
	targetNodeJSVersion?: string,
})
{
	const builtins: string[] = builtinsFn(options?.targetNodeJSVersion);

	return {
		builtins,
		isBuiltinModule(moduleName: string)
		{
			if (typeof moduleName !== 'string' || !moduleName?.length) {
				throw new TypeError('Expected a string');
			}

			return builtins.includes(moduleName)
		}
	}
}

const {
	builtins,
	isBuiltinModule,
} = createNewIsBuiltinModule();

export {
	builtins,
	isBuiltinModule,
}

export default isBuiltinModule
