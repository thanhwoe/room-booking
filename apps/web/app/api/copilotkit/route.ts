import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { MastraClient } from "@mastra/client-js";
import { MastraAgent } from "@ag-ui/mastra";

export const POST = async (req: NextRequest) => {
  const baseUrl = process.env.MASTRA_BASE_URL || "http://localhost:4111";

  const mastraClient = new MastraClient({ baseUrl });

  const mastraAgents = await MastraAgent.getRemoteAgents({
    mastraClient,
    resourceId: "roomBookingAgent",
  });

  const runtime = new CopilotRuntime({
    agents: mastraAgents,
  });

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
