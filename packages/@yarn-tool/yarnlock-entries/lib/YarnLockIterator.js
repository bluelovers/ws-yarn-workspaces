"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YarnLockIterator = void 0;
const lodash_1 = require("lodash");
const yarnlock_util_1 = require("@yarn-tool/yarnlock-util");
const yarnlock_stringify_1 = require("@yarn-tool/yarnlock-stringify");
const yarnlock_error_1 = require("@yarn-tool/yarnlock-error");
const yarnlock_parsed_to_json_1 = require("@yarn-tool/yarnlock-parsed-to-json");
const yarnlock_parse_assert_1 = require("@yarn-tool/yarnlock-parse-assert");
class YarnLockIterator {
    constructor(object) {
        this.object = object;
        if (!this.isV1() && !this.isV2()) {
            throw (0, yarnlock_error_1.newYarnLockParsedVersionError)();
        }
    }
    get verType() {
        return this.object.verType;
    }
    isV1() {
        return (0, yarnlock_parse_assert_1.isYarnLockParsedV1)(this.object);
    }
    isV2() {
        return (0, yarnlock_parse_assert_1.isYarnLockParsedV2)(this.object);
    }
    v1() {
        if (this.isV1()) {
            return this;
        }
        throw (0, yarnlock_error_1.newYarnLockParsedVersionError)(`current object not v1 yarnlock`);
    }
    v2() {
        if (this.isV2()) {
            return this;
        }
        throw (0, yarnlock_error_1.newYarnLockParsedVersionError)(`current object not v2 yarnlock`);
    }
    keys() {
        return Object.keys(this.object.data);
    }
    values() {
        return [...this.iterator()];
    }
    get(key) {
        return this.object.data[key];
    }
    set(key, raw) {
        this.object.data[key] = raw;
    }
    has(key) {
        const row = this.get(key);
        return row !== null && typeof row === 'object';
    }
    del(key) {
        const row = this.get(key);
        delete this.object.data[key];
        return row;
    }
    update(key, raw) {
        if (this.has(key)) {
            return (0, lodash_1.merge)(this.object.data[key], raw);
        }
        throw new TypeError(`'${key}' not exists`);
    }
    _wrap(key, raw) {
        return {
            key,
            raw,
            value: this._normalize(raw, key),
        };
    }
    _normalize(raw, key) {
        if (this.isV2()) {
            return (0, yarnlock_util_1.parseYarnLockRowV2)(key, raw);
        }
        else {
            return (0, yarnlock_util_1.parseYarnLockRowV1)(key, raw);
        }
    }
    *[Symbol.iterator]() {
        yield* this.iterator();
    }
    *iterator() {
        for (const key in this.object.data) {
            let row = this.object.data[key];
            yield this._wrap(key, row);
        }
    }
    stringify() {
        return (0, yarnlock_stringify_1.yarnLockStringify)(this.toJSON());
    }
    toJSON() {
        return (0, yarnlock_parsed_to_json_1.yarnLockParsedToRawJSON)(this.object, {
            throwError: true,
        });
    }
    map(fn) {
        const list = [];
        for (const value of this.iterator()) {
            list.push(fn(value, value.key, this));
        }
        return list;
    }
    async mapAsync(fn) {
        const list = [];
        for await (const value of this.iterator()) {
            list.push(await fn(value, value.key, this));
        }
        return list;
    }
    reduce(fn, initValue = {}) {
        for (const value of this.iterator()) {
            initValue = fn(initValue, value, value.key, this);
        }
        return initValue;
    }
    async reduceAsync(fn, initValue = {}) {
        for await (const value of this.iterator()) {
            initValue = await fn(initValue, value, value.key, this);
        }
        return initValue;
    }
}
exports.YarnLockIterator = YarnLockIterator;
exports.default = YarnLockIterator;
//# sourceMappingURL=YarnLockIterator.js.map