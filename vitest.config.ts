import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // events.test.ts is pure logic and needs no DOM; the component tests opt
    // into happy-dom with a `@vitest-environment` comment of their own.
    environment: "node",
    setupFiles: ["./test-setup.ts"],
  },
});
