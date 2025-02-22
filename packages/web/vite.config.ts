import { sveltekit } from "@sveltejs/kit/vite";
import postcssPresetEnv from "postcss-preset-env";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $assets: `${import.meta.dir}/src/assets`,
    },
  },
  css: {
    postcss: {
      plugins: [postcssPresetEnv()],
    },
  },
});
