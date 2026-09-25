import { defineConfig } from "@playwright/test";
const target = process.env.PLAYWRIGHT_BASE_URL;
export default defineConfig({
  testDir: "./scripts",
  testMatch: "browser.spec.js",
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "qa/test-results.json" }]],
  outputDir: "qa/test-artifacts",
  use: {
    baseURL: target || "http://127.0.0.1:5197",
    channel: "chrome",
    viewport: { width: 1440, height: 1000 },
    screenshot: "only-on-failure",
  },
  webServer: target
    ? undefined
    : {
        command: "npm run dev",
        url: "http://127.0.0.1:5197",
        reuseExistingServer: true,
      },
});
