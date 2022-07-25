import { sveltekit } from "@sveltejs/kit/vite";
import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync("./package.json"));

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  ssr: {
    noExternal: Object.keys(pkg.dependencies || {}),
  },
};

export default config;
