import { sveltekit } from "@sveltejs/kit/vite";
import postcssPresetEnv from "postcss-preset-env";
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $assets: resolve("src", "assets"),
    },
  },
  css: {
    postcss: {
      plugins: [postcssPresetEnv()],
    },
  },
});
