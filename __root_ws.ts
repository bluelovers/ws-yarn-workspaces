import { join } from "upath2";

export const __ROOT_WS = join(__dirname);

export const __TEST_YARNLOCK = join(__ROOT_WS, 'test/res');

export const isWin = process.platform === "win32";
