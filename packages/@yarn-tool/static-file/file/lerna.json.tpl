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
      "concurrency": 1,
      "noPrivate": true,
      "conventionalCommits": true,
      "changelogPreset": "@bluelovers/conventional-changelog-bluelovers"
    },
    "run": {
      "concurrency": 1,
      "stream": true
    },
    "exec": {
      "concurrency": 1,
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
