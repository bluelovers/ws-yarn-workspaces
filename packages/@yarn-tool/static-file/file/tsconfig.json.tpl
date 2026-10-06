{
  "extends": "@bluelovers/tsconfig/esm/mapfile.json",
  "compilerOptions": {
    "importHelpers": true,
    "types": [
      "jest",
      "node"
    ]
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
