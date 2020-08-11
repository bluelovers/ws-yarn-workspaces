function deepOwnEqual(a, b) {

  // if arrays of objects, recurse down to the objects
  if(Array.isArray(a) && Array.isArray(b)) {
    expect(a.length).toEqual(b.length)
    for(var i=0; i<a.length; i++) {
      deepOwnEqual(a[i], b[i])
    }
  }
  // compare all the object properties
  else {
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);

    expect(aKeys).toEqual(bKeys);

    aKeys.forEach(function(key) {
      expect(a[key]).toEqual(b[key])
    });
  }
}

module.exports = deepOwnEqual