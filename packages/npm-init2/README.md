# npm-init2

    a lazy npm init for create new package, support yarn workspace.
    make we without use `mkdir xxx && cd xxx && [npm|yarn] init` with `npx npm-init2 xxx`

## usage

make we simple need use `mkdir xxx && cd xxx && [npm|yarn] init`
with `npx npm-init2 xxx`

`npx npm-init2` => `npm init`

`npx npm-init2 --npmClient yarn` => `yarn init`

* `--npmClient yarn` - `yarn` , `npm` , or other can init `package.json`
* `--cwd path`
* `--skipCheckWorkspace` - will skip try check current path is workspace
* `--sort` - sort package.json

* [npm-init2](https://www.npmjs.com/package/npm-init2)
* [create-yarn-workspaces](https://www.npmjs.com/package/create-yarn-workspaces)
* [find-pkg-ws](https://www.npmjs.com/package/find-pkg-ws)
* [workspaces-config](https://www.npmjs.com/package/workspaces-config)
* [keywords:workspaces](https://www.npmjs.com/search?q=keywords:workspaces)
