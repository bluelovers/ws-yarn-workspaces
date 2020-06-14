{
  "packages": [
    "packages/*"
  ],
  "command": {
    "publish": {
      "ignoreChanges": [
        "**/node_modules/**",
        "**/__snapshots__/**",
        "**/__fixtures__/**",
        "**/test/**",
        "**/tests/**",
        "**/__tests__/**",
        "*.map",
        "*.spec.*",
        "*.test.*",
        "**/test/temp/**",
        "lerna.json",
        "CHANGELOG.md",
        ".gitignore",
        ".gitrepo"
      ],
      "message": "chore(release): publish",
      "bump": "patch",
      "conventionalCommits": true,
      "conventionalGraduate": false
    },
    "version": {
      "conventionalCommits": true,
      "changelogPreset": "@bluelovers/conventional-changelog-bluelovers"
    },
    "run": {
      "stream": true
    },
    "exec": {
      "stream": true
    }
  },
  "npmClient": "yarn",
  "useWorkspaces": true,
  "version": "independent"
}
