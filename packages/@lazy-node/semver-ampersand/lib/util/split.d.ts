/**
 * 依 `||` 切割範圍字串，且不保留分隔符
 * Split a range string on `||` without keeping the separator
 *
 * brackets: true 讓括號內的 `||`（如 peerdep 群組）不被切開，
 * 拆掉分隔符是因為呼叫端會自行補回 ` || `。
 * `brackets: true` keeps `||` inside brackets intact (e.g. peer-dependency
 * groups); the separator is dropped because callers re-add ` || ` themselves.
 */
export declare const splitDoubleVerticalBar: (str: string) => string[];
/**
 * 依空白切割範圍字串，且不保留分隔符
 * Split a range string on whitespace without keeping the separator
 *
 * 與 splitDoubleVerticalBar 相同的括號保護，避免切開括號內的空白。
 * Same bracket protection as splitDoubleVerticalBar, so whitespace inside
 * brackets is not split.
 */
export declare const splitSpace: (str: string) => string[];
