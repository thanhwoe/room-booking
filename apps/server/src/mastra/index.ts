import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import {
  Observability,
  MastraStorageExporter,
  MastraPlatformExporter,
  SensitiveDataFilter,
} from "@mastra/observability";
import { registerCopilotKit } from "@ag-ui/mastra/copilotkit";
import { mongoDBStore } from "./storage/mongodb";
import { mongodbAgent } from "./agents/mongodb.agent";

export const mastra = new Mastra({
  agents: { mongodbAgent },
  storage: mongoDBStore,
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
  observability: new Observability({
    configs: {
      default: {
        serviceName: "mastra",
        exporters: [
          new MastraStorageExporter(), // Persists observability events to Mastra Storage
          new MastraPlatformExporter(), // Sends observability events to Mastra Platform (if MASTRA_PLATFORM_ACCESS_TOKEN is set)
        ],
        spanOutputProcessors: [
          new SensitiveDataFilter(), // Redacts sensitive data like passwords, tokens, keys
        ],
      },
    },
  }),
  server: {
    cors: {
      origin: "*",
      allowMethods: ["*"],
      allowHeaders: ["*"],
    },
    apiRoutes: [
      registerCopilotKit({
        path: "/chat",
        resourceId: "mongodbAgent",
      }),
    ],
  },
});
