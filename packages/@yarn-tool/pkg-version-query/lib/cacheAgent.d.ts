import Cache from 'lru-cache-fs2';
export declare function initCache(): Cache<string, import("ts-type").ITSRequireAtLeastOne<import("./types").ICachedVersionResultCore, "result" | "error">>;
export declare function getCache(): Cache<string, import("ts-type").ITSRequireAtLeastOne<import("./types").ICachedVersionResultCore, "result" | "error">>;
