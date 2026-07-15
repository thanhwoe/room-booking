"use client";

import { AGENT_ID } from "@/constants/agent";
import { getOrCreateConversationSession } from "@/lib/conversation-storage";
import { CopilotKit } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";

export function CopilotProvider({ children }: { children: React.ReactNode }) {
  const session = getOrCreateConversationSession();

  return (
    <CopilotKit
      runtimeUrl={process.env.NEXT_PUBLIC_MASTRA_BASE_URL}
      agent={AGENT_ID}
      threadId={session.threadId}
      enableInspector={false}
      headers={{
        "x-resource-id": session.resourceId,
      }}
    >
      {children}
    </CopilotKit>
  );
}
