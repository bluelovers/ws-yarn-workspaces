{
  "packages": [
    "packages/*"
  ],
  "command": {
    "publish": {
      "concurrency": 1,
      "loglevel": "silly",
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
      "noPrivate": true,
      "conventionalCommits": true,
      "conventionalGraduate": false
    },
    "version": {
      "noPrivate": true,
      "conventionalCommits": true,
      "changelogPreset": "@bluelovers/conventional-changelog-bluelovers"
    },
    "run": {
      "stream": true
    },
    "exec": {
      "stream": true
    },
    "add": {
      "concurrency": 1,
      "stream": true
    }
  },
  "npmClient": "yarn",
  "useWorkspaces": true,
  "version": "independent"
}
