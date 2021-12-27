import { join } from "path";

export const __root_ws = join(__dirname);

export const isWin = process.platform === "win32";
