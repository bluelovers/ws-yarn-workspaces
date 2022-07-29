import { IArgvRuntime, IRuntimeInput } from './lib/types';
import Bluebird from 'bluebird';
export declare function _handleNcuArgvAuto(argv: IArgvRuntime, runtimeInput: IRuntimeInput, isWorkspace?: boolean, includeRoot?: boolean): Bluebird<void>;
export default _handleNcuArgvAuto;
