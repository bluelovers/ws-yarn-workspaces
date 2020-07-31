import { Command, flags } from "@oclif/command";
export declare class YarnLockDiff extends Command {
    static description: string;
    static flags: {
        version: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        old: flags.IOptionFlag<string[]>;
        new: flags.IOptionFlag<string[]>;
    };
    checkIfExist: (filePathString: string) => boolean;
    reportNonExistantFiles: (filePathString: string) => string;
    checkIfLockFile: (filePathString: string) => boolean;
    reportNonLockFile: (filePathString: string) => string;
    run(): Promise<void>;
}
export default YarnLockDiff;
