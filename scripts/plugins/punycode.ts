import { plugin } from "bun";

const punycode = import.meta.require("../../node_modules/punycode");

// https://bun.sh/docs/runtime/plugins#overriding-existing-modules
plugin({
  name: "punycode-substituter",
  setup(build) {
    build.module("punycode", () => ({
      exports: punycode,
      loader: "object",
    }));
  },
});
