# npm-package-arg 特殊輸入狀況說明
# npm-package-arg Special Input Cases

## 概述 Overview

本文檔說明 `@yarn-tool/npm-package-arg-util` 及其相關套件在處理特殊輸入時的行為，特別是空字串 (`''`)、空格 (`' '`)、星號 (`'*'`) 等邊緣情況。

This document describes the behavior of `@yarn-tool/npm-package-arg-util` and related packages when handling special inputs, particularly edge cases like empty strings (`''`), spaces (`' '`), and star wildcards (`'*'`).

---

## 特殊輸入類型 Special Input Types

### 1. 空字串 Empty String (`''`)

當輸入為空字串時，npm-package-arg 會將其解析為 `range` 類型，且 `rawSpec` 為空。

When the input is an empty string, npm-package-arg parses it as `range` type with an empty `rawSpec`.

```typescript
import { npa } from '@yarn-tool/npm-package-arg-util';

const result = npa('@fake/fake@');
// result.type = 'range'
// result.rawSpec = ''
// result.fetchSpec = '*'
```

**處理結果 Processing Result:**
- [`isRawSpecIsEmpty()`](packages/@yarn-tool/npm-package-arg-util/lib/detect.ts:209) 返回 `true`
- [`isInputSpecIsEmpty()`](packages/@yarn-tool/npm-package-arg-util/lib/detect.ts:277) 返回 `true`
- [`normalizeDepsValue()`](packages/@yarn-tool/normalize-deps-value/index.ts:291) 返回 `"*"`

---

### 2. 空格 Space (`' '`)

當輸入為單一空格時，行為與空字串類似，npm-package-arg 將其視為有效的範圍規格。

When the input is a single space, the behavior is similar to an empty string, with npm-package-arg treating it as a valid range specification.

```typescript
const result = npa('@fake/fake@ ');
// result.type = 'range'
// result.rawSpec = ' '
// result.fetchSpec = '*'
```

**處理結果 Processing Result:**
- [`isRawSpecIsEmpty()`](packages/@yarn-tool/npm-package-arg-util/lib/detect.ts:209) 返回 `true`（經過 trim）
- [`isInputSpecIsEmpty()`](packages/@yarn-tool/npm-package-arg-util/lib/detect.ts:277) 返回 `true`
- [`normalizeDepsValue()`](packages/@yarn-tool/normalize-deps-value/index.ts:291) 返回 `"*"`

---

### 3. 星號萬用字元 Star Wildcard (`'*'`)

星號表示「任何版本」，是 npm 和 yarn 中的特殊版本規格。

The star represents "any version" and is a special version specification in npm and yarn.

```typescript
const result = npa('@fake/fake@*');
// result.type = 'range'
// result.rawSpec = '*'
// result.fetchSpec = '*'
```

**處理結果 Processing Result:**
- [`isInputSpecIsStar()`](packages/@yarn-tool/npm-package-arg-util/lib/detect.ts:241) 返回 `true`
- [`isInputSpecIsEmpty()`](packages/@yarn-tool/npm-package-arg-util/lib/detect.ts:277) 返回 `true`（因為 fetchSpec 為 '*' 且符合其他條件）
- [`normalizeDepsValue()`](packages/@yarn-tool/normalize-deps-value/index.ts:291) 返回 `"*"`

**注意 Note:**
純星號輸入（無套件名稱）也會被識別：
Pure star input (without package name) is also recognized:

```typescript
const result = npa('*');
// isInputSpecIsStar(result) = true
```

---

### 4. 套件名稱無版本 Package Name Without Version

當只提供套件名稱而沒有版本規格時，npm-package-arg 會預設使用 `*` 作為 fetchSpec。

When only the package name is provided without a version specification, npm-package-arg defaults to `*` as the fetchSpec.

```typescript
const result = npa('lodash');
// result.type = 'tag' | 'range'
// result.rawSpec = ''
// result.fetchSpec = '*'
```

**處理結果 Processing Result:**
- [`isNameSameAsRaw()`](packages/@yarn-tool/npm-package-arg-util/lib/detect.ts:177) 返回 `true`
- [`isInputSpecIsEmpty()`](packages/@yarn-tool/npm-package-arg-util/lib/detect.ts:277) 返回 `true`

---

## 檢測函式對照表 Detection Function Reference

| 輸入 Input | `isRawSpecIsEmpty` | `isInputSpecIsStar` | `isInputSpecIsEmpty` | `isNameSameAsRaw` |
|-----------|-------------------|--------------------|---------------------|------------------|
| `''` (empty) | ✅ true | ❌ false | ✅ true | ❌ false |
| `' '` (space) | ✅ true | ❌ false | ✅ true | ❌ false |
| `'*'` (star) | ❌ false | ✅ true | ✅ true | ❌ false |
| `'lodash'` | ✅ true | ❌ false | ✅ true | ✅ true |
| `'lodash@'` | ✅ true | ❌ false | ✅ true | ✅ true |
| `'lodash@*'` | ❌ false | ✅ true | ❌ false | ❌ false |
| `'lodash@4.0.0'` | ❌ false | ❌ false | ❌ false | ❌ false |

---

## 在測試中的應用 Usage in Tests

參考 [`space.spec.ts`](packages/@yarn-tool/npm-package-arg-util/test/space.spec.ts:1) 測試檔案：

```typescript
describe(`Any`, () =>
{
	['', ' ', '*'].forEach(value =>
	{
		const title = value === '' ? 'empty' : value === ' ' ? 'space' : 'star';

		test(title, () =>
		{
			let actual = _lazyTestNpaTypeGuard(value);
			expect(actual).toMatchSnapshot({
				isInputSpecIsEmpty: !isInputSpecIsStar,
				isInputSpecIsStar,
			});
		});
	});
});
```

---

## 正規化行為 Normalization Behavior

### @yarn-tool/normalize-deps-value

```typescript
import { normalizeDepsValue } from '@yarn-tool/normalize-deps-value';

normalizeDepsValue('');           // => "*"
normalizeDepsValue(' ');          // => "*"
normalizeDepsValue('*');          // => "*"
normalizeDepsValue('lodash');     // => "*"
normalizeDepsValue('lodash@');    // => "*"
normalizeDepsValue('lodash@*');   // => "*"
normalizeDepsValue('^4.0.0');     // => "^4.0.0"
normalizeDepsValue('lodash@^4.0.0'); // => "^4.0.0"
```

### @yarn-tool/npa-to-deps

```typescript
import { npaToDepsValue } from '@yarn-tool/npa-to-deps';

npaToDepsValue('lodash@');
// => { name: 'lodash', operator: '^', fetchQuery: true, ... }

npaToDepsValue('lodash@*');
// => { name: 'lodash', operator: '^', fetchQuery: true, ... }

npaToDepsValue('lodash@4.0.0');
// => { name: 'lodash', semver: '4.0.0', ... }
```

---

## 相關程式碼連結 Related Code Links

- [`lib/detect.ts`](packages/@yarn-tool/npm-package-arg-util/lib/detect.ts) - 類型檢測函式
- [`test/space.spec.ts`](packages/@yarn-tool/npm-package-arg-util/test/space.spec.ts) - 特殊輸入測試
- [`normalize-deps-value/index.ts`](packages/@yarn-tool/normalize-deps-value/index.ts) - 正規化實作
- [`npa-to-deps/index.ts`](packages/@yarn-tool/npa-to-deps/index.ts) - 依賴值轉換

---

## 總結 Summary

- **空字串和空格** (`''`, `' '`)：都被視為空的版本規格，最終轉換為 `"*"`
- **星號** (`'*'`)：明確表示任何版本，與空規格有相似的處理結果
- **無版本套件名稱**：預設使用 `"*"` 作為版本
- **檢測函式**提供多種方式識別這些特殊輸入，用於不同的處理邏輯

---

- **Empty strings and spaces** (`''`, `' '`): Both treated as empty version specifications, ultimately normalized to `"*"`
- **Star wildcard** (`'*'`): Explicitly means any version, with similar processing results to empty specs
- **Package name without version**: Defaults to `"*"` as the version
- **Detection functions** provide multiple ways to identify these special inputs for different processing logic
