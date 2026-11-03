{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "declaration": false,
    "noUnusedParameters": false,
    "allowUnusedLabels": true,
    "noUnusedLocals": false,
    "noPropertyAccessFromIndexSignature": false,
    "types": [
      "jest",
      "node"
    ]
  },
  "include": [
    "../**/*.ts",
    "**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "__fixtures__",
    "__snapshots__",
    "coverage",
    "dist"
  ]
}
