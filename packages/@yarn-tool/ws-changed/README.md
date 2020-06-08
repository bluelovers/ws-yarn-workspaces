# README.md

    get package changed list from lerna and git

## install

```bash
yarn add @yarn-tool/ws-changed
yarn-tool add @yarn-tool/ws-changed
yt add @yarn-tool/ws-changed
```

```
console.dir(wsChanged(process.cwd())
```

```
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
