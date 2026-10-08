var prequire = require('..');
const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

describe('top-require', function() {

  it('should be a function', function() {
    assert.strictEqual(typeof prequire.default, 'function');
  });

  it('should throw error if unable to resolve module', function() {
    assert.throws(function() {
      prequire.default('foobar');
    }, Error);
  });

});
