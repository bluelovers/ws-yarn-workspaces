{
  "extends": "@bluelovers/tsconfig/esm/module.json",
  "compilerOptions": {
    "sourceRoot": "./lib",
    "outDir": "./esm",
    "rootDir": "./lib",
    "module": "esnext",
    "noImplicitAny": true,
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
