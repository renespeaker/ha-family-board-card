import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // The suite runs in a timezone that actually observes DST. Under UTC a
    // whole class of calendar bug is invisible - the doubled day in the
    // October 2026 month grid (#62) passed 77 green tests unnoticed.
    env: { TZ: "Europe/Berlin" },
    // events.test.ts is pure logic and needs no DOM; the component tests opt
    // into happy-dom with a `@vitest-environment` comment of their own.
    environment: "node",
    setupFiles: ["./test-setup.ts"],
  },
});
