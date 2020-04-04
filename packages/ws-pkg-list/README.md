# ws-pkg-list

> get Yarn Workspaces Packages List and can help create `paths` for `tsconfig.json`

## demo

```ts
console.log(workspacesPackagesList(process.cwd(), true));
/*
[ '[abs path]/packages/create-yarn-workspaces',
  '[abs path]/packages/find-pkg-ws',
  '[abs path]/packages/npm-init2',
  '[abs path]/packages/workspaces-config',
  '[abs path]/packages/ws-pkg-list' ]
 */
```

```ts
console.log(readPackages(workspacesPackagesList(process.cwd(), false)));
/*
{ 'create-yarn-workspaces':
   { name: 'create-yarn-workspaces',
     path: '..\\create-yarn-workspaces',
     fullpath:
      '[abs path]\\packages\\create-yarn-workspaces',
     config:
      { name: 'create-yarn-workspaces',
        version: '1.0.7',
        description: 'yarn create yarn-workspaces     npx create-yarn-workspaces',
        keywords: [Array],
        homepage:
         'https://github.com/bluelovers/create-yarn-workspaces#readme',
        bugs: [Object],
        repository: [Object],
        license: 'ISC',
        author: '',
        main: 'index.js',
        bin: [Object],
        directories: [Object],
        scripts: [Object],
        dependencies: [Object],
        devDependencies: {} } },

  ...

  'ws-pkg-list':
   { name: 'ws-pkg-list',
     path: '.',
     fullpath:
      '[abs path]\\packages\\ws-pkg-list',
     config:
      { name: 'ws-pkg-list',
        version: '1.0.0',
        description: 'get Workspaces Packages List',
        main: 'index.js',
        scripts: [Object],
        author: '',
        license: 'ISC',
        dependencies: [Object] } } }
 */
```

```ts
console.log(tsConfigPaths(workspacesPackagesList(true)));
/*
{ 'create-yarn-workspaces/*':
   [ '[abs path]\\packages\\create-yarn-workspaces\\*' ],
  'find-pkg-ws/*':
   [ '[abs path]\\packages\\find-pkg-ws\\*' ],
  'npm-init2/*':
   [ '[abs path]\\packages\\npm-init2\\*' ],
  'workspaces-config/*':
   [ '[abs path]\\packages\\workspaces-config\\*' ],
  'ws-pkg-list/*':
   [ '[abs path]\\packages\\ws-pkg-list\\*' ] }
 */
```

```ts
console.log(tsConfigPaths(workspacesPackagesList(false)));
console.log(tsConfigPaths(process.cwd()));
/*
{ 'create-yarn-workspaces/*':
   [ '..\\create-yarn-workspaces\\*',
     '[abs path]\\packages\\create-yarn-workspaces\\*' ],
  'find-pkg-ws/*':
   [ '..\\find-pkg-ws\\*',
     '[abs path]\\packages\\find-pkg-ws\\*' ],
  'npm-init2/*':
   [ '..\\npm-init2\\*',
     '[abs path]\\packages\\npm-init2\\*' ],
  'workspaces-config/*':
   [ '..\\workspaces-config\\*',
     '[abs path]\\packages\\workspaces-config\\*' ] }
 */
```
