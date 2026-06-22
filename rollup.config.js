import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/ha-family-board-card.ts",
  output: {
    dir: "dist",
    format: "es",
    entryFileNames: "ha-family-board-card.js",
    sourcemap: false,
  },
  plugins: [
    resolve(),
    typescript({ tsconfig: "./tsconfig.json" }),
    terser({ format: { comments: false } }),
  ],
};
