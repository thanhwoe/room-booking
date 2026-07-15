import { AGENT_ID } from "@/constants/agent";
import { SUGGESTIONS } from "@/constants/suggestions";
import { cn } from "@/lib/utils";
import {
  CopilotChatView,
  useAgent,
  UseAgentUpdate,
  useCopilotKit,
} from "@copilotkit/react-core/v2";
import { ComponentProps } from "react";
import { Card, CardContent } from "./ui/card";

type WelcomeScreenProps = ComponentProps<typeof CopilotChatView.WelcomeScreen>;
export function ChatWelcome({
  input,
  welcomeMessage: _welcomeMessage,
  suggestionView: _suggestionView,
  children: _children,
  className,
  ...props
}: WelcomeScreenProps) {
  const { copilotkit } = useCopilotKit();

  const { agent } = useAgent({
    agentId: AGENT_ID,
    updates: [UseAgentUpdate.OnRunStatusChanged],
  });

  async function submitSuggestion(prompt: string): Promise<void> {
    if (agent.isRunning) {
      return;
    }

    try {
      agent.addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: prompt,
      });

      await copilotkit.runAgent({
        agent,
      });
    } catch (error) {
      console.error("[RoomBookingChat] Suggestion failed:", error);
    }
  }

  return (
    <section
      {...props}
      className={cn(
        "flex min-h-full flex-1",
        "items-center justify-center",
        "px-4 py-10 sm:px-6 lg:py-16",
        className,
      )}
    >
      <div className="w-full max-w-5xl">
        <div className="mx-auto max-w-3xl">
          <h1
            className={cn(
              "text-balance text-4xl text-center",
              "font-medium leading-[1.15]",
              "tracking-tight text-zinc-950",
              "sm:text-5xl",
            )}
          >
            Find the right room.
            <br />
            <span>
              What are you{" "}
              <span
                className={cn(
                  "bg-gradient-to-r",
                  "from-fuchsia-500 to-violet-500",
                  "bg-clip-text text-transparent",
                )}
              >
                planning?
              </span>
            </span>
          </h1>

          <div className="mt-10">{input}</div>
        </div>

        <div className="mx-auto mt-9 max-w-4xl">
          <p className="mb-3 px-1 text-lg font-medium text-zinc-600">
            Suggestions
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SUGGESTIONS.map(({ title, description, prompt, icon: Icon }) => (
              <button
                key={title}
                type="button"
                disabled={agent.isRunning}
                onClick={() => {
                  void submitSuggestion(prompt);
                }}
                className={cn(
                  "group rounded-xl text-left",
                  "outline-none",
                  "focus-visible:ring-2",
                  "focus-visible:ring-violet-400",
                  "disabled:pointer-events-none",
                  "disabled:opacity-50",
                )}
              >
                <Card
                  className={cn(
                    "h-full min-h-40 py-0",
                    "border-0 bg-white/70",
                    "shadow-[0_8px_30px_rgba(24,24,27,0.035)]",
                    "transition-all duration-200",
                    "group-hover:-translate-y-0.5",
                    "group-hover:bg-white",
                    "group-hover:ring-zinc-300",
                  )}
                >
                  <CardContent className="flex h-full flex-col p-4">
                    <div
                      className={cn(
                        "mb-5 flex size-9",
                        "items-center justify-center",
                        "rounded-xl bg-zinc-100",
                        "text-zinc-700",
                        "transition-colors",
                        "group-hover:bg-violet-50",
                        "group-hover:text-violet-600",
                      )}
                    >
                      <Icon className="size-4" />
                    </div>

                    <p className="font-medium text-zinc-900">{title}</p>

                    <p className="mt-1 text-sm leading-5 text-zinc-500">
                      {description}
                    </p>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
