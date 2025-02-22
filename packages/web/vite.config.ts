import { sveltekit } from "@sveltejs/kit/vite";
import postcssPresetEnv from "postcss-preset-env";
import { defineConfig } from "vite";
import * as path from "node:path";

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $assets: path.resolve("src", "assets"),
    },
  },
  css: {
    postcss: {
      plugins: [postcssPresetEnv()],
    },
  },
});
