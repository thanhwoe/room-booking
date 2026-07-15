import type { ComponentProps } from "react";

import {
  CopilotChatInput,
  type CopilotChatInputProps,
} from "@copilotkit/react-core/v2";
import { SparklesIcon } from "lucide-react";

import { ChatSendButton } from "@/components/chat-send-button";
import { cn } from "@/lib/utils";

type AddMenuButtonProps = ComponentProps<typeof CopilotChatInput.AddMenuButton>;

function ChatLeadingIcon(_props: AddMenuButtonProps) {
  return (
    <span
      className="flex size-10 shrink-0 items-center justify-center text-zinc-900"
      aria-hidden="true"
    >
      <SparklesIcon className="size-5" />
    </span>
  );
}

export function ChatInput({
  children: _children,
  className,
  ...props
}: CopilotChatInputProps) {
  const isWelcomeScreen = props.bottomAnchored !== true;

  return (
    <CopilotChatInput
      {...props}
      className={cn(
        "room-booking-chat-input",

        "[&_.copilotKitInput]:border",
        "[&_.copilotKitInput]:border-zinc-200",
        "[&_.copilotKitInput]:bg-white",
        "[&_.copilotKitInput]:shadow-[0_12px_40px_rgba(24,24,27,0.06)]",
        "[&_.copilotKitInput]:transition-all",
        "[&_.copilotKitInput:focus-within]:border-zinc-300",
        "[&_.copilotKitInput:focus-within]:shadow-[0_16px_50px_rgba(24,24,27,0.09)]",

        isWelcomeScreen &&
          "[&_.copilotKitInput]:min-h-44 [&_.copilotKitInput]:rounded-3xl",

        className,
      )}
      addMenuButton={ChatLeadingIcon}
      sendButton={ChatSendButton}
      textArea={{
        className: cn(
          "w-full bg-transparent text-base leading-7",
          "placeholder:text-zinc-400",

          isWelcomeScreen ? "min-h-28 py-3" : "min-h-12 py-3",
        ),
      }}
    />
  );
}
