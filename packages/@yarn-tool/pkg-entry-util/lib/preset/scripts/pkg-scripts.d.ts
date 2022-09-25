import { EnumScriptsEntry } from '../../field/scripts';
export declare function defaultPkgScripts(): {
    "test:jest": EnumScriptsEntry;
    "test:snapshot": string;
    "test:jest:snapshot": string;
    "test:tsd": string;
};
export declare function defaultPkgNotOldExists(): {
    "test:mocha": string;
    "test:tsdx": string;
    "build:dts:bundle": EnumScriptsEntry;
    "build:dts:copy": string;
    "build:dts:tsc:emit": string;
    "build:dts:tsc": string;
    "build:tsdx": string;
    "build:microbundle": string;
    lint: string;
    "lint:eslint": string;
    review: string;
    "review:test": string;
    "review:coverage": string;
    coverage: string;
    "test:jest": EnumScriptsEntry;
    "test:snapshot": string;
    "test:jest:snapshot": string;
    "test:tsd": string;
};
