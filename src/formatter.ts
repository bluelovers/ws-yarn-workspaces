import chalk from "chalk";
import Table from "cli-table";
import { Diff, DiffArray } from "deep-diff";

export const FormatterService = {
  _diffArray: (array: DiffArray<{}, {}>): [string, string] => {
    const item = array.item;
    switch (item.kind) {
      case "N":
        return [`[...]`, `[..., ${FormatterService._formatVersion(item.rhs)}]`];
      case "D":
        return [`[..., ${FormatterService._formatVersion(item.lhs)}]`, `[...]`];
      case "E":
        return [
          `[...], ${FormatterService._formatVersion(item.lhs)}]`,
          `[..., ${FormatterService._formatVersion(item.lhs)}]`
        ];
      default:
        return [`[...]`, `[...]`];
    }
  },
  _formatVersion: (rhsOrLhs: unknown): string => {
    switch (typeof rhsOrLhs) {
      case "string":
        return rhsOrLhs;
      case "object":
        return Array.isArray(rhsOrLhs)
          ? rhsOrLhs.join(", ")
          : JSON.stringify(rhsOrLhs);
      default:
        return `${rhsOrLhs}`;
    }
  },
  buildDiffTable: (diff: Diff<{}, {}>[]): string => {
    const table = new Table({
      head: [
        chalk.blueBright("package name"),
        chalk.blueBright("old version(s)"),
        chalk.blueBright("new version(s)")
      ],
      colWidths: [30, 50, 50]
    });
    const formatedDiff: Record<string, [string, string, string]> = {};
    diff.map(packageDiff => {
      const path = packageDiff.path!.find(() => true) as string;
      switch (packageDiff.kind) {
        case "D":
          formatedDiff[path] = [
            path,
            chalk.red(FormatterService._formatVersion(packageDiff.lhs)),
            "-"
          ];
          break;
        case "N":
          formatedDiff[path] = [
            path,
            "-",
            chalk.green(FormatterService._formatVersion(packageDiff.rhs))
          ];
          break;
        case "E":
          const lhs = chalk.yellow(
            FormatterService._formatVersion(packageDiff.lhs)
          );
          const rhs = chalk.yellow(
            FormatterService._formatVersion(packageDiff.rhs)
          );
          if (formatedDiff[path]) {
            formatedDiff[path] = [
              path,
              `${formatedDiff[path][1]}, ${lhs}`,
              `${formatedDiff[path][2]}, ${rhs}`
            ];
          } else {
            formatedDiff[path] = [path, lhs, rhs];
          }
          break;
        case "A":
          const diffArray = FormatterService._diffArray(packageDiff);
          formatedDiff[path] = [path, diffArray[0], diffArray[1]];
      }
    });
    Object.values(formatedDiff).forEach(tableRow => table.push(tableRow));
    return table.toString();
  }
};
