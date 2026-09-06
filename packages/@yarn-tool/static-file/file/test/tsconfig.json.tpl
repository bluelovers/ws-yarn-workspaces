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
  ]
}
