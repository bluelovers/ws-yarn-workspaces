{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
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
    "test"
  ],
  "exclude": [
    "node_modules",
    "__fixtures__",
    "__snapshots__",
    "coverage",
    "dist"
  ]
}
