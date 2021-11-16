# README.md

    

## install

```bash
yarn add @yarn-tool/npa-to-deps-query
yarn-tool add @yarn-tool/npa-to-deps-query
yt add @yarn-tool/npa-to-deps-query
```

```typescript
queryDepsValueByNpa('jest@12')
.tap(console.dir)
```

```js
exports[`jest@<=12 1`] = `
Object {
  "name": "jest",
  "value": "<=12",
}
`;

exports[`jest@<12 1`] = `
Object {
  "name": "jest",
  "value": "<12",
}
`;

exports[`jest@>=12 1`] = `
Object {
  "name": "jest",
  "value": ">=12",
}
`;

exports[`jest@>12 1`] = `
Object {
  "name": "jest",
  "value": ">12",
}
`;

exports[`jest@^12 1`] = `
Object {
  "name": "jest",
  "value": "^12.1.1",
}
`;

exports[`jest@12 1`] = `
Object {
  "name": "jest",
  "value": "12.1.1",
}
`;
```