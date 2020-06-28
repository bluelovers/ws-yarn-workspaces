# README.md

    get package changed list from lerna and git

## install

```bash
yarn add @yarn-tool/ws-changed
yarn-tool add @yarn-tool/ws-changed
yt add @yarn-tool/ws-changed
```

## demo

### demo 1

```typescript
import { wsPkgDepsListableRecord } from 'ws-pkg-list';
import wsChanged from '@yarn-tool/ws-changed';
import { findUpDepsAllDeep } from '@yarn-tool/find-deps';
import Bluebird from 'bluebird';
import crossSpawnExtra from 'cross-spawn-extra';

export default (async () => {

	let record = wsPkgDepsListableRecord()

	const listChanged = wsChanged()

	const cwd = listChanged.cwd;

	let list = listChanged.changed.concat(listChanged.staged).map(row => row.name)

	let list2 = findUpDepsAllDeep(list, record);

	let list3 = list2.reduce((a, b) => {

		a.push(b[0])

		return a
	}, [] as string[])

	console.log(list2)

	if (list3.includes('cjk-conv'))
	{
		let cp = await crossSpawnExtra.async('lerna', [
			`run`,
			`--scope`,
			`cjk-conv`,
			`--concurrency`,
			1,
			`prepublishOnly`,
		], {
			cwd,
			stdio: 'inherit',
		})

		if (cp.exitCode)
		{
			process.exit(cp.exitCode)
		}
	}

	if (list3.length)
	{
		let cp = await crossSpawnExtra.async('lerna', [
			`run`,
			...list3.map(v => `--scope=${v}`),
			`--concurrency`,
			1,
			`prepublishOnly:lerna`,
		], {
			cwd,
			stdio: 'inherit',
		})

		if (cp.exitCode)
		{
			process.exit(cp.exitCode)
		}
	}

})();
```

### demo 2

```typescript
console.dir(wsChanged(process.cwd())
```

```typescript
{
  cwd: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2',
  changed: [
    {
      name: 'npm-init2',
      version: '1.0.82',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/npm-init2',
      prefix: 'packages/npm-init2'
    },
    {
      name: 'ws-pkg-list',
      version: '1.0.15',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/ws-pkg-list',
      prefix: 'packages/ws-pkg-list'
    },
    {
      name: '@yarn-tool/find-root',
      version: '1.0.12',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/@yarn-tool/find-root',
      prefix: 'packages/@yarn-tool/find-root'
    },
    {
      name: 'env-run-path',
      version: '1.0.13',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/@yarn-tool/find-run-path',
      prefix: 'packages/@yarn-tool/find-run-path'
    },
    {
      name: '@yarn-tool/find-tsconfig',
      version: '1.0.11',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/@yarn-tool/find-tsconfig',
      prefix: 'packages/@yarn-tool/find-tsconfig'
    },
    {
      name: '@yarn-tool/fix-ws-links',
      version: '1.0.10',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/@yarn-tool/fix-ws-links',
      prefix: 'packages/@yarn-tool/fix-ws-links'
    },
    {
      name: '@yarn-tool/node-modules',
      version: '1.0.5',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/@yarn-tool/node-modules',
      prefix: 'packages/@yarn-tool/node-modules'
    },
    {
      name: '@yarn-tool/pkg-git-info',
      version: '1.0.4',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/@yarn-tool/pkg-git-info',
      prefix: 'packages/@yarn-tool/pkg-git-info'
    },
    {
      name: '@yarn-tool/ws-changed',
      version: '1.0.0',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/@yarn-tool/ws-changed',
      prefix: 'packages/@yarn-tool/ws-changed'
    }
  ],
  staged: [
    {
      name: '@yarn-tool/find-root',
      version: '1.0.12',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/@yarn-tool/find-root',
      prefix: 'packages/@yarn-tool/find-root'
    },
    {
      name: '@yarn-tool/pkg-git-info',
      version: '1.0.4',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/@yarn-tool/pkg-git-info',
      prefix: 'packages/@yarn-tool/pkg-git-info'
    },
    {
      name: '@yarn-tool/ws-changed',
      version: '1.0.0',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/@yarn-tool/ws-changed',
      prefix: 'packages/@yarn-tool/ws-changed'
    },
    {
      name: 'ws-pkg-list',
      version: '1.0.15',
      private: false,
      location: 'G:/Users/The Project/nodejs-yarn/ws-yarn-workspaces2/packages/ws-pkg-list',
      prefix: 'packages/ws-pkg-list'
    }
  ]
}
```
