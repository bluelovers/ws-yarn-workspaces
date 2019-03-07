import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import * as path from "path";

import { DiffService } from "./diff-service";
import { FormatterService } from "./formatter";

class YarnLockDiff extends Command {
  static description =
    "Given one or more old yarn.lock files and one or more new yarn.lock files, compute the diff";

  static flags = {
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    old: flags.string({
      char: "o",
      description: "old yarn.lock file(s)",
      multiple: true,
      required: true
    }),
    new: flags.string({
      char: "n",
      description: "new yarn.lock file(s)",
      multiple: true,
      required: true
    })
  };

  checkIfExist = (filePathString: string) => {
    const filePath = path.resolve(process.cwd(), filePathString);
    return fs.existsSync(filePath);
  };

  reportNonExistantFiles = (filePathString: string) => {
    if (!this.checkIfExist(filePathString)) {
      this.error(`File does not exist "${filePathString}"`);
    }
    return filePathString;
  };

  checkIfLockFile = (filePathString: string) => {
    const fileExtension = path.extname(filePathString);
    return fileExtension === ".lock";
  };

  reportNonLockFile = (filePathString: string) => {
    if (!this.checkIfLockFile(filePathString)) {
      this.error(`File is not a lock file "${filePathString}"`);
    }
    return filePathString;
  };

  async run() {
    const { flags } = this.parse(YarnLockDiff);

    const oldYarnLockPaths = flags.old;
    const newYarnLockPaths = flags.new;

    [...oldYarnLockPaths, ...newYarnLockPaths]
      .map(this.reportNonExistantFiles)
      .map(this.reportNonLockFile);

    const oldContents = oldYarnLockPaths.map(path =>
      fs.readFileSync(path, "utf8")
    );
    const newContents = newYarnLockPaths.map(path =>
      fs.readFileSync(path, "utf8")
    );

    DiffService.buildDiff(oldContents, newContents)
      .map(FormatterService.buildDiffTable)
      .map(this.log);
  }
}

export = YarnLockDiff;
