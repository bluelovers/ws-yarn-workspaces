{
  "extends": "@bluelovers/tsconfig/tsdx/index.json",
  "compilerOptions": {
    "importHelpers": true,
    "moduleResolution": "bundler",
    "rootDir": "src"
  },
  "exclude": [
    "dist",
    "node_modules",
    "__fixtures__",
    "__snapshots__",
    "coverage",
    "test"
  ]
}
