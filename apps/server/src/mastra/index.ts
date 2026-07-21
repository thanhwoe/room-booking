import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { VercelDeployer } from "@mastra/deployer-vercel";
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
  deployer: new VercelDeployer({
    maxDuration: 300,
    memory: 1536,
  }),

  agents: {
    roomBookingAgent,
  },

  storage: mongoDBStore,

  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),

  observability: new Observability({
    configs: {
      default: {
        serviceName: "mastra",
        exporters: [new MastraStorageExporter(), new MastraPlatformExporter()],
        spanOutputProcessors: [new SensitiveDataFilter()],
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
