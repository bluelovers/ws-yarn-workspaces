# README.md

    get bin script from package.json

## install

```bash
yarn add @yarn-tool/get-pkg-bin
yarn-tool add @yarn-tool/get-pkg-bin
```

## api

```typescript
import type { IPackageJson } from '@ts-type/package-dts';
export declare type IOptions = {
    pkgRoot?: string;
    usePathResolve?: boolean;
} & ({
    name?: string;
    pkg: IPackageJson | Record<string, any>;
} | {
    name: string;
    pkg?: IPackageJson | Record<string, any>;
});
export declare function normalizePackageBins(options: IOptions): Record<string, string>;
export declare function defaultPackageBin(options: IOptions, defaultKey?: string): string;
export default normalizePackageBins;
```

## demo

```typescript
import { normalizePackageBins} from '../index';
import { resolvePackage } from '@yarn-tool/resolve-package';

let bins = normalizePackageBins({
	...resolvePackage('ts-node'),
});

console.dir(bins)

bins = normalizePackageBins({
	...resolvePackage('ts-node'),

	usePathResolve: true,
});

console.dir(bins)

bins = normalizePackageBins({
	//pkgRoot: dirname(require.resolve('ts-node/package.json')),
	pkg: resolvePackage('ts-node').pkg,
	usePathResolve: true,
});

console.dir(bins)

bins = normalizePackageBins({
	name: 'ts-node',
});

console.dir(bins)

```

=>

```js
{
  'ts-node': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/bin.js',
  'ts-script': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/script.js'
}
{
  'ts-node': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/bin.js',
  'ts-script': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/script.js'
}
{ 'ts-node': './dist/bin.js', 'ts-script': './dist/script.js' }
{
  'ts-node': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/bin.js',
  'ts-script': 'C:/Users/User/AppData/Roaming/npm/node_modules/ts-node/dist/script.js'
}
```
