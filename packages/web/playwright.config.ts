import { devices, type PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "bun run build && bun run preview",
    port: 4173,
  },
  testDir: "e2e",
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  projects: [
    {
      // https://playwright.dev/docs/browsers#chromium-new-headless-mode
      use: { ...devices["Desktop Chrome"], channel: "chromium" },
    },
    {
      use: devices["Desktop Edge"],
    },
    {
      use: devices["Desktop Firefox"],
    },
    {
      use: devices["Desktop Safari"],
    },
    {
      use: devices["Pixel 7 landscape"],
    },
    {
      use: devices["Galaxy S III"],
    },
    {
      use: devices["iPad Mini"],
    },
    {
      use: devices["iPhone 15 Pro Max"],
    },
    {
      use: devices["iPhone SE"],
    },
  ],
};

export default config;
