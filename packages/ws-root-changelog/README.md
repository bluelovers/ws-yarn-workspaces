# ws-root-changelog

Generate a root CHANGELOG.md with links to all workspace package changelogs.

## Features

- **Table of Contents**: Creates a centralized changelog index for monorepos
- **Package Icons**: 🔒 for private packages, 🌏 for public packages
- **Quick Navigation**: Direct links to each package's changelog
- **CLI Tool**: Easy-to-use command line interface
- **Sync/Async API**: Both synchronous and asynchronous functions available

## Install

```bash
# Using yarn
yarn add ws-root-changelog

# Using yarn-tool
yarn-tool add ws-root-changelog

# Using yt (alias)
yt add ws-root-changelog
```

## CLI Usage

```bash
# Generate root changelog in current directory
ws-root-changelog

# Generate for specific directory
ws-root-changelog /path/to/workspace
```

## API Usage

### Create Root Changelog

```typescript
import { createWorkspacesRootChangelog, outputWorkspacesRootChangelog } from 'ws-root-changelog';

// Generate markdown content
const markdown = createWorkspacesRootChangelog(process.cwd());
console.log(markdown);

// Output to file (sync)
const result = outputWorkspacesRootChangelog(process.cwd());
console.log(`Created: ${result.file}`);

// Output to file (async)
const result = await outputWorkspacesRootChangelogAsync(process.cwd());
```

### List Package Changelogs

```typescript
import { listChangelog } from 'ws-root-changelog';

const links = listChangelog(process.cwd());
// Returns: ['* 🔒 [`@scope/private-pkg`](./packages/private/CHANGELOG.md) *packages/private*', ...]
```

### Get Changelog Path

```typescript
import { getWorkspacesRootChangelogPath } from 'ws-root-changelog';

const path = getWorkspacesRootChangelogPath(process.cwd(), './CHANGELOG.md');
```

## Output Example

Generated `CHANGELOG.md`:

```markdown
# Change Log

Please see the individual package changelogs for what's new:

* 🔒 [`@scope/private-pkg`](./packages/private/CHANGELOG.md "packages/private") *packages/private*
* 🌏 [`public-pkg`](./packages/public/CHANGELOG.md "packages/public") *packages/public*
* 🌏 [`ws-root-changelog`](./packages/ws-root-changelog/CHANGELOG.md "packages/ws-root-changelog") *packages/ws-root-changelog*
```

## API Reference

### Functions

| Function | Description | Returns |
|----------|-------------|---------|
| `createWorkspacesRootChangelog(cwd?)` | Generate markdown content | `string` |
| `outputWorkspacesRootChangelog(cwd?, filename?)` | Write to file (sync) | `{ file, md }` |
| `outputWorkspacesRootChangelogAsync(cwd?, filename?)` | Write to file (async) | `Promise<{ file, md }>` |
| `listChangelog(cwd)` | Get list of markdown links | `string[]` |
| `getWorkspacesRootChangelogPath(cwd?, filename?)` | Get file path | `string` |

### Icons

| Icon | Meaning |
|------|---------|
| 🔒 | Private package |
| 🌏 | Public package |

## Use Cases

### CI/CD Integration

```bash
# Update root changelog before release
ws-root-changelog

git add CHANGELOG.md
git commit -m "docs: update root changelog"
```

### Pre-release Hook

```json
{
  "scripts": {
    "prerelease": "ws-root-changelog && git add CHANGELOG.md"
  }
}
```

## Related

- [@yarn-tool/changelog](../@yarn-tool/changelog) - Generate changelogs for individual packages
- [@yarn-tool/ws-changed](../@yarn-tool/ws-changed) - Detect changed packages

## License

ISC
