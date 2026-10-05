/**
 * 套件入口：以 `export =` 形式轉出 core 的預設函式
 * Package entry: re-exports the default function from core via `export =`
 *
 * 使用 `export =` 是為了同時相容 CommonJS 的 `require('yarn-list-link')`
 * 與 TypeScript 的 esModuleInterop 匯入方式。
 * `export =` is used so both CommonJS `require('yarn-list-link')`
 * and TypeScript's esModuleInterop import style keep working.
 *
 * Created by user on 2018/9/20/020.
 */

import yarnListLink from './core';

export = yarnListLink;
