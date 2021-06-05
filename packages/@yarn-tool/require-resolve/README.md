# README.md

    require.resolve with search on extra paths

## install

```bash
yarn add @yarn-tool/require-resolve
yarn-tool add @yarn-tool/require-resolve
yt add @yarn-tool/require-resolve
```

```typescript
const tsdx_path = requireResolveExtra('tsdx').result;

let actual = requireResolveExtra('ts-jest', {
			includeGlobal: true,
			includeCurrentDirectory: true,
			paths: [
				tsdx_path,
			],
		});

console.dir(actual);
```

