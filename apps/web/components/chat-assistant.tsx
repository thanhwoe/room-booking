"use client";

import type { ComponentProps } from "react";
import {
  CopilotChat,
  CopilotChatInput,
  CopilotChatView,
  UseAgentUpdate,
  useAgent,
} from "@copilotkit/react-core/v2";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { createNewConversationThread } from "@/lib/conversation-storage";
import { ChatInput } from "./chat-input";
import { ChatWelcome } from "./chat-welcome";
import { AGENT_ID } from "@/constants/agent";

type ChatViewProps = ComponentProps<typeof CopilotChatView>;

function ChatView({ className, ...props }: ChatViewProps) {
  return (
    <CopilotChatView
      {...props}
      hasExplicitThreadId={false}
      welcomeScreen={ChatWelcome}
      className={cn("h-full bg-transparent", className)}
    />
  );
}

export function ChatAssistant() {
  const { agent } = useAgent({
    agentId: AGENT_ID,
    updates: [UseAgentUpdate.OnRunStatusChanged],
  });

  function handleNewThread(): void {
    if (agent.isRunning) {
      return;
    }

    createNewConversationThread();

    window.location.reload();
  }

  return (
    <TooltipProvider delay={250}>
      <div className={cn("flex h-svh flex-col overflow-hidden")}>
        <header
          className={cn(
            "flex h-20 shrink-0",
            "items-center justify-end",
            "px-5 sm:px-8 lg:px-12",
          )}
        >
          <Button
            type="button"
            disabled={agent.isRunning}
            onClick={handleNewThread}
            className={cn(
              "h-11 rounded-xl",
              "bg-zinc-950 px-4",
              "text-white shadow-sm",
              "hover:bg-zinc-800",
            )}
          >
            <PlusIcon className="size-4" aria-hidden="true" />
            New Thread
          </Button>
        </header>

        <div className="min-h-0 flex-1">
          <CopilotChat
            agentId={AGENT_ID}
            chatView={ChatView as typeof CopilotChatView}
            input={ChatInput as typeof CopilotChatInput}
            className="h-full"
            labels={{
              modalHeaderTitle: "Room Booking Assistant",

              welcomeMessageText: "How can I help with your meeting?",

              chatInputPlaceholder:
                "Ask about rooms, schedules, or bookings...",
            }}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
