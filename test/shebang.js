var test    = require('tap').test,
    shebang = require('../shebang'),
    data;

data = {
  "#!/usr/bin/ruby"          : "ruby",
  "#!/usr/bin/env node"      : "node",
  "#!/usr/bin/env python -c" : "python",
  "#! /bin/sh"               : "sh",
  "#!/usr/awk -f"            : "awk",
  "#!/bin/sed -f"            : "sed",
};

test('shebang', function (assert) {
  for (var prop in data) {
    if (data.hasOwnProperty(prop)) {
      assert.equal(shebang(prop), data[prop]);
    }
  }
  assert.notEqual(shebang('#!/usr/bin/php'), 'php2');
  assert.end();
});
