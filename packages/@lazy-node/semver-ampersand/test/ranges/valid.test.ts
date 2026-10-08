import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import rangeParse from '../fixtures/range-parse';
import validRange from '../../lib/validRange';
import { inspect } from 'util';
import { _replaceDoubleVerticalBar } from '../util';

describe('valid range test', () => {
  // validRange(range) -> result
  // translate ranges into their canonical form
  rangeParse.forEach(([pre, wanted, options]) =>
    test(`validRange(${pre}, ${inspect(options)}) === ${wanted = _replaceDoubleVerticalBar(wanted)}`, () => assert.strictEqual(validRange(pre, options), wanted)))
})
