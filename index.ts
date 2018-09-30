function requireStartFromParent(id) {
	var parent = module.parent;
	for (; parent; parent = parent.parent) {
		try {
			return parent.require(id);
		} catch(ex) {}
	}
	throw new Error("Cannot find module '" + id + "' from parent");
}

function requireFromTopParent(id)
{
	var stack = [module];
	var parent = module.parent;
	for ( ; parent; parent = parent.parent ) {
		stack.push (parent);
	}
	var current;
	while ( (current = stack.pop ()) != null ) {
		try {
			return current.require (id);
		} catch ( ex ) {
		}
	}
	throw new Error ("Cannot find module '" + id + "' from parent");
}

export = requireFromTopParent
