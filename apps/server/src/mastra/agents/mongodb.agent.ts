import { Memory } from "@mastra/memory";
import { Agent } from "@mastra/core/agent";
import { mongoDBStore } from "../storage/mongodb";
import { openrouterModel } from "../models/openrouter";

export const mongodbAgent = new Agent({
  id: "mongodb-agent",
  name: "mongodb-agent",
  instructions:
    "You are an AI agent with the ability to automatically recall memories from previous interactions.",
  model: openrouterModel,
  memory: new Memory({
    storage: mongoDBStore,
    options: {
      generateTitle: true,
    },
  }),
});
