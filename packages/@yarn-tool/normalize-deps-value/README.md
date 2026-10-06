# @yarn-tool/normalize-deps-value

Normalize dependency values to standardized semver format.
將依賴值正規化為標準化的 semver 格式。

目前版本：`2.0.9`

## Features / 功能特點

- Handles edge cases like empty inputs, spaces, and star wildcards / 處理空輸入、空格和星號萬用字元等邊緣情況
- Normalizes complex semver ranges / 正規化複雜的 semver 範圍
- Converts npm-package-arg results to standardized dependency values / 將 npm-package-arg 結果轉換為標準化的依賴值

## Install / 安裝

```bash
yarn add @yarn-tool/normalize-deps-value
yarn-tool add @yarn-tool/normalize-deps-value
yt add @yarn-tool/normalize-deps-value
```

## Usage / 使用方式

```typescript
import { normalizeDepsValue, normalizeResultToDepsValue, _getNpaResult } from '@yarn-tool/normalize-deps-value';

// Normalize a dependency value string
// 正規化依賴值字串
normalizeDepsValue('');           // => "*"
normalizeDepsValue(' ');          // => "*"
normalizeDepsValue('*');          // => "*"
normalizeDepsValue('^4.0.0');     // => "^4.0.0"
normalizeDepsValue('>=1.0.0 <2.0.0'); // => ">=1.0.0 <2.0.0"
normalizeDepsValue('lodash@^4.0.0'); // => "^4.0.0"

// Parse and normalize npm-package-arg result
// 解析並正規化 npm-package-arg 結果
const result = _getNpaResult('^4.0.0');
normalizeResultToDepsValue(result); // => "^4.0.0"
```

## API / API 文件

### `normalizeDepsValue(value: string): string`

Normalizes a dependency value string to standard format.
將依賴值字串正規化為標準格式。

**Parameters / 參數:**
- `value` - The dependency value to normalize / 要正規化的依賴值

**Returns / 返回:**
- Normalized dependency value / 正規化的依賴值

### `normalizeResultToDepsValue(result): string`

Converts an npm-package-arg result to a dependency value string.
將 npm-package-arg 結果轉換為依賴值字串。

### `_getNpaResult(value: string): IResult`

Parses a value string into an npm-package-arg result using multiple strategies.
使用多種策略將值字串解析為 npm-package-arg 結果。

## Configuration / 設定

本套件不需任何設定 (No configuration)，匯入後即可直接使用：

- 所有函式皆為純函式 (Pure function)，不讀取檔案系統、環境變數或設定檔。
- 內部使用的虛假套件名稱 (Fake Package Name) `@fake/fake` 為固定常數，
  僅用於解析純 semver 字串（例如 `^4.0.0`），不影響回傳值。
- 回傳值只會是 `*`（任意版本）或標準的 semver range 字串，
  因此不需要設定預設版本或替代策略。

## Related / 相關專案

- [@yarn-tool/npm-package-arg-util](../npm-package-arg-util) - npm-package-arg utilities
- [@yarn-tool/npa-to-deps](../npa-to-deps) - Convert npm-package-arg results to dependency objects

## License / 授權

ISC
