export function deepOwnEqual(a, b)
{

	// if arrays of objects, recurse down to the objects
	if (Array.isArray(a) && Array.isArray(b))
	{
		expect(a.length).toStrictEqual(b.length);

		for (let i = 0; i < a.length; i++)
		{
			deepOwnEqual(a[i], b[i])
		}
	}
	// compare all the object properties
	else
	{
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);

		expect(aKeys).toStrictEqual(bKeys);
		expect(a).toMatchObject(b)

		/*
		aKeys.forEach(function (key)
		{
			expect(a[key]).toMatchObject(b[key])
		});
		 */
	}
}
