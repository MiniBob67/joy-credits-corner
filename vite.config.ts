import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  base: "/joy-credits-corner/",

  tanstackStart: {
    server: {
      entry: "server",
    },

    prerender: {
      enabled: true,
      crawlLinks: true,
      autoStaticPathsDiscovery: true,
      autoSubfolderIndex: true,
      failOnError: true,
    },
  },
});
