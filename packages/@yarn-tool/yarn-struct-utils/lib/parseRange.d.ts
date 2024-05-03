import { ParsedUrlQuery } from 'querystring';
export type IParseRangeOptions = {
    /** Throw an error if bindings are missing */
    requireBindings?: boolean;
    /** Throw an error if the protocol is missing or is not the specified one */
    requireProtocol?: boolean | string;
    /** Throw an error if the source is missing */
    requireSource?: boolean;
    /** Whether to parse the selector as a query string */
    parseSelector?: boolean;
};
type I_ParseRangeReturnTypeCore<Opts extends IParseRangeOptions> = ({
    params: Opts extends {
        requireBindings: true;
    } ? ParsedUrlQuery : ParsedUrlQuery | null;
}) & ({
    protocol: Opts extends {
        requireProtocol: true | string;
    } ? string : string | null;
}) & ({
    source: Opts extends {
        requireSource: true;
    } ? string : string | null;
}) & ({
    selector: Opts extends {
        parseSelector: true;
    } ? ParsedUrlQuery : string;
});
export type IParseRangeReturnType<Opts extends IParseRangeOptions> = I_ParseRangeReturnTypeCore<Opts> & {
    params?: {
        version?: string;
        hash?: string;
        locator?: string;
    };
};
declare module '@yarnpkg/core/lib/structUtils' {
    function parseRange<Opts extends IParseRangeOptions>(range: string, opts?: Opts): IParseRangeReturnType<Opts>;
}
export declare function parseRange<Opts extends IParseRangeOptions>(range: string, opts?: Opts): IParseRangeReturnType<Opts>;
export {};
