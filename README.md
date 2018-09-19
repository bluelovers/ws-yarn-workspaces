# README

    return a cache directory, like `find-cache-dir` do


## install

```bash
npm install cache-path
```

## desc

like [`find-cache-dir`](https://github.com/avajs/find-cache-dir)

## what diff

1. return path at any env  
`find-cache-dir` will fail return when not runing at a module/package folder
2. allow change to ur fav order for find cache path

## demo

```ts
import { normalizeName, getCachePath } from 'cache-path';

console.log(normalizeName('@node-novel/sort'));
// => _node_novel_sort
console.log(normalizeName('@node-novel/sort', true));
// => 7bc015f2

// when cwd in a module/package
console.log(getCachePath());
// => D:\Users\Documents\The Project\nodejs-yarn\ws-segment\packages\cache-path\node_modules\.cache
console.log(getCachePath('@node-novel/sort'));
// => D:\Users\Documents\The Project\nodejs-yarn\ws-segment\packages\cache-path\node_modules\.cache\_node_novel_sort

// when other
console.log(getCachePath());
// => T:\cache\npm-cache\.cache
console.log(getCachePath('@node-novel/sort'));
// => T:\cache\npm-cache\.cache\_node_novel_sort

```
