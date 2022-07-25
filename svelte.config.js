import preprocess from "svelte-preprocess";
import adapter from "@sveltejs/adapter-static";
import fs from "node:fs";
import dotenv from "dotenv";

dotenv.config();

const entries = JSON.parse(fs.readFileSync("./src/routes/articles.json"));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),

    prerender: {
      crawl: true,
      enabled: true,
      default: true,
      entries,
    },
  },
};

export default config;
