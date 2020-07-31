import { expect, test } from "@oclif/test";

import cmd = require("../src");

describe("yarn-lock-diff", () => {
  test
    .stdout()
    .do(() => cmd.run([]))
    .exit(2)
    .it("exit if missing pararms");

  test
    .stdout()
    .do(() =>
      cmd.run(["-o", "fixtures/a/yarn.lock", "-n", "fixtures/b/yarn.lock"])
    )
    .it("display the diff", ctx => {
      expect(ctx.stdout).to.contain("");
    });
});
