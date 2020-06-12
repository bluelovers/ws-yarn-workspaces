# Shebang

### Description

Node module for extracting the normalized shebang command token.

### Examples

```js
var shebang = require('shebang');

console.log(shebang("#!/usr/bin/ruby")) // "ruby"
console.log(shebang("#!/usr/bin/env node")) // "node"
```

### Tests

```bash
npm test
```

## License

MIT.
