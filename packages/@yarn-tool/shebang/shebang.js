/**
* Extract normalized shebang command token.
*
*
* Examples:
*
*  shebang("#!/usr/bin/ruby") // "ruby"
*
*  shebang("#!/usr/bin/env node") // "node"
*
*  @param: {String}
*  @return {String|null}
*/

function shebang(data) {
  var matched, script;

  if (data && (matched = data.match(/#!\s*([^\s]+)\s*([^\s]+)?/))) {
    script = matched[1].split('/').pop();
    return (script === 'env') ? matched[2] : script;
  }

  return null;
}

module.exports = shebang;
