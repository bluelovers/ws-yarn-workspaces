var prequire = require('..');

describe('top-require', function() {

  it('should be a function', function() {
    expect(prequire.default).to.be.a('function');
  });

  it('should throw error if unable to resolve module', function() {
    expect(function() {
      prequire.default('foobar');
    }).to.throw(Error);
  });

});
