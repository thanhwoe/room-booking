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
import { roomBookingAgent } from "./agents/room-booking.agent";
import { MASTRA_RESOURCE_ID_KEY } from "@mastra/core/request-context";

export const mastra = new Mastra({
  agents: { roomBookingAgent },
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
        resourceId: "room-booking-agent",
        setContext: (context, requestContext) => {
          const resourceId = context.req.header("x-resource-id");

          if (resourceId) {
            requestContext.set(MASTRA_RESOURCE_ID_KEY, resourceId);
          }
        },
      }),
    ],
  },
});
