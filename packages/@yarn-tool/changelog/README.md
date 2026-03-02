# @yarn-tool/changelog

Generate and update CHANGELOG.md using conventional commits for monorepo workspaces.

## Features

- **Conventional Commits**: Automatically generate changelogs from conventional commit messages
- **Monorepo Support**: Works seamlessly with Lerna and Yarn workspaces
- **CLI Tool**: Easy-to-use command line interface
- **Version Recommendation**: Analyze commits to recommend next version
- **Independent/Root Modes**: Support both independent and fixed versioning modes

## Install

```bash
# Using yarn
yarn add @yarn-tool/changelog

# Using yarn-tool
yarn-tool add @yarn-tool/changelog

# Using yt (alias)
yt add @yarn-tool/changelog
```

## CLI Usage

```bash
# Generate changelog for current package
changelog

# Specify preset
changelog --preset conventional-changelog-angular

# Specify tag prefix
changelog --tag-prefix v

# Specify type (independent or root)
changelog --type independent
```

## API Usage

### Update Changelog

```typescript
import { updateChangelogByCwd } from '@yarn-tool/changelog';

updateChangelogByCwd(process.cwd(), {
  changelogPreset: '@bluelovers/conventional-changelog-bluelovers',
  tagPrefix: 'v',
  type: 'independent',
}).then(data => {
  console.log(`Updated ${data.logPath}`);
  console.log(`New version: ${data.version}`);
});
```

### Recommend Version

```typescript
import { recommendVersion } from '@yarn-tool/changelog';

recommendVersion(pkg, {
  changelogPreset: 'conventional-changelog-angular',
  type: 'independent',
}).then(version => {
  console.log(`Recommended version: ${version}`);
});
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `preset` | `string` | `@bluelovers/conventional-changelog-bluelovers` | Changelog preset to use |
| `tag-prefix` | `string` | `v` | Tag prefix for version tags |
| `type` | `string` | `independent` | Changelog type: `independent` or `root` |
| `cwd` | `string` | `process.cwd()` | Working directory |

## Supported Presets

- `@bluelovers/conventional-changelog-bluelovers`
- `conventional-changelog-angular`
- `conventional-changelog-atom`
- `conventional-changelog-codemirror`
- `conventional-changelog-ember`
- `conventional-changelog-eslint`
- And more...

## Related

- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)
- [Lerna](https://lerna.js.org/)

## License

ISC
