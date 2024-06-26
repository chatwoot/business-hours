import { defineConfig } from "tsup";

export default defineConfig((options) => {
  return {
    entry: { index: "src/index.ts" },
    minify: !options.watch,
    target: "ES2021",
    format: ["cjs", "esm"],
    splitting: false,
    dts: true,
    sourcemap: true,
    clean: true,
  };
});
