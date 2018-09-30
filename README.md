# up-require

    Require package module from highest or list of module.

## base on

for more desc see here

- `requireFromParentUp(id: string, startModule?: NodeModule)`{:.language-ts} => [parent-require](https://github.com/jaredhanson/node-parent-require)
- `requireFromTopParent(id: string, startModule?: NodeModule)`{.ts} => [top-require](https://github.com/sielay/node-top-require)
- `getModuleByExports(exports)` => [which-module](https://www.npmjs.com/package/which-module)

### diff

- support NodeJS.ErrnoException, Error object will has `code='MODULE_NOT_FOUND'` .  
  so we can know when error happen is can't found module or it has other error
- split function, so u can custom it
- other [api see here](index.d.ts)

## Install

```bash
npm install up-require
```

## demo

### structure

* `root`
  * index
  * node_modules/
    * `chai@3`
  * packages/
    * `sub1_pkg/`
      * node_modules/
        * `chai@1`
      * index
    * `sub2_pkg/`
      * node_modules/
        * `chai@2`
      * index
      * `sub3_of_sub2_pkg/`
          * node_modules/
            * `chai@1`
          * index

---

- [API](index.d.ts)

### base use

- `requireFromTopParent<T = any>(id: string, startModule?: NodeModule)` => [top-require](https://github.com/sielay/node-top-require)
- `requireFromParentUp<T = any>(id: string, startModule?: NodeModule)` => [parent-require](https://github.com/jaredhanson/node-parent-require)
- `getModuleByExports` => [which-module](https://www.npmjs.com/package/which-module)

alias name

`upRequire` = `requireUp` = `requireFromTopParent`

```ts
import requireFromTopParent, { getModuleByID, requireFromParentUp } from 'up-require';
import { requireFromTopParent, getModuleByID, requireFromParentUp } from 'up-require';
const requireFromTopParent = require('up-require').requireFromTopParent;
```

#### when use in `sub1_pkg/index`

```ts
require('chai') => chai@1
requireFromParentUp('chai', module) => chai@3
requireFromTopParent('chai', module) => chai@3
requireFromTopParent('chai') => chai@3
```

#### when use in `sub3_of_sub2_pkg/index`

```ts
require('chai') => chai@1
requireFromParentUp('chai', module) => chai@2
requireFromTopParent('chai', module) => chai@3
requireFromTopParent('chai') => chai@3
```

### `getModuleByID(id: string, requireIfNotExists?: boolean, req = require)`

```ts
console.log(`only return when chai is required`, getModuleByID('chai'));
console.log(`when chai is not required , will require it`, getModuleByID('chai', true));
```


## Credits

  - Creator of original Parent Require [Jared Hanson](http://github.com/jaredhanson)
  - [Lukasz Sielski](http://github.com/sielay)

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2014 Lukasz Sielski <[http://lukaszsielski.pl/](http://lukaszsielski.pl/)>
Copyright (c) 2013 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
