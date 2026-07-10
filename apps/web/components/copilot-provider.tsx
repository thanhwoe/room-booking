"use client";

import { CopilotKit } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit
      runtimeUrl={process.env.NEXT_PUBLIC_MASTRA_BASE_URL}
      agent="roomBookingAgent"
    >
      {children}
    </CopilotKit>
  );
}
