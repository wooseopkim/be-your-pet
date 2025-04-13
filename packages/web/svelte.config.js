// @ts-check

import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess({
    script: true,
  }),

  kit: {
    adapter: adapter({
      fallback: "404.html",
    }),
    paths: {
      base: process.argv.includes("dev")
        ? ""
        : /** @type {`/${string}`} */ (process.env.BASE_PATH),
    },
  },
};

export default config;
