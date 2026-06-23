import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/ha-family-board-card.ts",
  output: {
    file: "dist/ha-family-board-card.js",
    format: "es",
    // Single, self-contained bundle so HACS can serve one file.
    // The editor is imported dynamically but inlined here.
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [
    resolve(),
    typescript({ tsconfig: "./tsconfig.json" }),
    terser({ format: { comments: false } }),
  ],
};
