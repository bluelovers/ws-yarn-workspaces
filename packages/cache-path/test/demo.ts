import { normalizeName } from '../lib/normalizeName';
import { getCachePath, getCachePathAsync } from '../lib/getCachePath';

console.log(normalizeName('@node-novel/sort'));
// => _node_novel_sort
console.log(normalizeName('@node-novel/sort', true));
// => 7bc015f2

// when cwd in a module/package
//console.log(getCachePath());
// => D:\Users\Documents\The Project\nodejs-yarn\ws-segment\packages\cache-path\node_modules\.cache
console.log(getCachePath('@node-novel/sort'));
// => D:\Users\Documents\The Project\nodejs-yarn\ws-segment\packages\cache-path\node_modules\.cache\_node_novel_sort

// when other
//console.log(getCachePathAsync());
// => T:\cache\npm-cache\.cache
console.log(getCachePathAsync('@node-novel/sort'));
// => T:\cache\npm-cache\.cache\_node_novel_sort
