import { readFileSync, writeFileSync } from "fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { preserveDirectives } from "rollup-plugin-preserve-directives";
import dts from "vite-plugin-dts";

const packageJson = JSON.parse(
  readFileSync("./package.json", { encoding: "utf-8" })
);

const globals = {
  ...(packageJson?.dependencies || {}),
};
export default defineConfig({
  test: {
    environment: "jsdom",
  },
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      beforeWriteFile: (filePath, content) => {
        writeFileSync(filePath.replace(".d.ts", ".d.cts"), content);
        return { filePath, content };
      },
    }),
  ],

  build: {
    lib: {
      entry: ["src/index.ts"],
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "lodash",
        "lodash-es",
        "react/jsx-runtime",
        ...Object.keys(globals),
      ],
      output: {
        preserveModules: true,
      },
      plugins: [preserveDirectives()],
    },
  },
});
