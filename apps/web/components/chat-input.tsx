import {
  CopilotChatInput,
  CopilotChatInputProps,
} from "@copilotkit/react-core/v2";
import { ChatSendButton } from "./chat-send-button";
import { cn } from "@/lib/utils";
import { SparklesIcon } from "lucide-react";

export const ChatInput = ({
  children: _children,
  className,
  ...props
}: CopilotChatInputProps) => {
  const isWelcomeScreen = props.bottomAnchored !== true;

  return (
    <CopilotChatInput
      {...props}
      className={className}
      sendButton={ChatSendButton}
      textArea={{
        className: cn(
          "w-full bg-transparent px-0",
          "text-base leading-7",
          "placeholder:text-zinc-400",
          isWelcomeScreen ? "min-h-28 py-0" : "min-h-12 py-0",
        ),
      }}
    >
      {({ textArea, sendButton }) => (
        <div
          className={cn(
            "pointer-events-none w-full px-4",
            !isWelcomeScreen && "pb-4",
          )}
        >
          <div
            className={cn(
              "pointer-events-auto mx-auto",
              "flex w-full max-w-3xl",
              "border border-zinc-200",
              "bg-white",
              "shadow-[0_12px_40px_rgba(24,24,27,0.06)]",
              "transition-all",
              "focus-within:border-zinc-300",
              "focus-within:shadow-[0_16px_50px_rgba(24,24,27,0.09)]",
              isWelcomeScreen
                ? "min-h-44 items-start rounded-3xl p-5"
                : "items-end rounded-2xl p-3",
            )}
          >
            <SparklesIcon
              className={cn(
                "size-5 shrink-0 text-zinc-900",
                isWelcomeScreen ? "mt-1" : "mb-2.5",
              )}
              aria-hidden="true"
            />

            <div className="min-w-0 flex-1 px-3">{textArea}</div>

            <div className="shrink-0 self-end">{sendButton}</div>
          </div>
        </div>
      )}
    </CopilotChatInput>
  );
};
