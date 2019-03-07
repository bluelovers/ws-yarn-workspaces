import chalk from "chalk";
import Table from "cli-table";
import { Diff, DiffArray } from "deep-diff";

export const FormatterService = {
  _diffArray: (array: DiffArray<{}, {}>): [string, string] => {
    const item = array.item;
    switch (item.kind) {
      case "N":
        return [`[...]`, `[..., ${item.rhs}]`];
      case "D":
        return [`[..., ${item.lhs}]`, `[...]`];
      case "E":
        return [`[...], ${item.lhs}]`, `[..., ${item.rhs}]`];
      default:
        return [`[...]`, `[...]`];
    }
  },
  buildDiffTable: (diff: Diff<{}, {}>[]): string => {
    const table = new Table({
      head: [
        chalk.blueBright("package name"),
        chalk.blueBright("old version(s)"),
        chalk.blueBright("new version(s)")
      ],
      colWidths: [50, 20, 20]
    });
    diff.map(packageDiff => {
      switch (packageDiff.kind) {
        case "D":
          table.push([packageDiff.path, chalk.red(`${packageDiff.lhs}`), "-"]);
          break;
        case "N":
          table.push([
            packageDiff.path,
            "-",
            chalk.green(`${packageDiff.rhs}`)
          ]);
          break;
        case "E":
          table.push([
            packageDiff.path,
            chalk.yellow(`${packageDiff.lhs}`),
            chalk.yellow(`${packageDiff.rhs}`)
          ]);
          break;
        case "A":
          table.push([
            packageDiff.path,
            ...FormatterService._diffArray(packageDiff)
          ]);
      }
    });
    return table.toString();
  }
};
