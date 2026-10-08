import assert from 'node:assert/strict';

/**
 * 深度比較兩個物件是否具有相同的自有屬性
 * Deep compare two objects for equal own properties
 *
 * 遞迴比較陣列和物件，用於測試斷言
 * Recursively compares arrays and objects for test assertions
 *
 * @param {any} a - 第一個要比較的值 / First value to compare
 * @param {any} b - 第二個要比較的值 / Second value to compare
 *
 * @example
 * ```typescript
 * // 比較物件 / Compare objects
 * deepOwnEqual({ a: 1 }, { a: 1 }); // 通過 / Passes
 *
 * // 比較陣列 / Compare arrays
 * deepOwnEqual([1, 2], [1, 2]); // 通過 / Passes
 * ```
 */
export function deepOwnEqual(a, b)
{
	// 如果是物件陣列，遞迴比較每個元素
	// If arrays of objects, recurse down to the objects
	if (Array.isArray(a) && Array.isArray(b))
	{
		// 先比較陣列長度 / First compare array lengths
		assert.strictEqual(a.length, b.length);

		// 遞迴比較每個元素 / Recursively compare each element
		for (let i = 0; i < a.length; i++)
		{
			deepOwnEqual(a[i], b[i])
		}
	}
	// 比較物件的所有屬性
	// Compare all the object properties
	else
	{
		const aKeys = Object.keys(a);
		const bKeys = Object.keys(b);

		// 使用 toMatchObject 進行部分匹配比較
		// Use toMatchObject for partial match comparison
		// expect(aKeys).toStrictEqual(bKeys);
		// 逐欄遞迴比對（等效於 toMatchObject 的部分匹配語意）
		// Compare each key recursively (equivalent to toMatchObject partial-match semantics)
		for (const key of bKeys)
		{
			const av = a[key];
			const bv = b[key];

			if (av !== null && bv !== null && typeof av === 'object' && typeof bv === 'object')
			{
				deepOwnEqual(av, bv)
			}
			else
			{
				assert.strictEqual(av, bv)
			}
		}

		/*
		// 替代方案：逐一比較每個屬性
		// Alternative: Compare each property individually
		aKeys.forEach(function (key)
		{
			expect(a[key]).toMatchObject(b[key])
		});
		 */
	}
}
