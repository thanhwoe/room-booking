import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// tencent/hy3:free
export const openrouterModel = openrouter("poolside/laguna-m.1:free");
