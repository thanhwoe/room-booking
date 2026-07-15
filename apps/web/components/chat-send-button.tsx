import { ComponentProps } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "lucide-react";

export function ChatSendButton({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  const isStopButton = children !== undefined;

  return (
    <Tooltip>
      <TooltipTrigger
        {...props}
        render={
          <Button
            type="button"
            size="icon-lg"
            className={cn(
              "size-10 rounded-xl bg-zinc-950",
              "text-white shadow-sm",
              "hover:bg-zinc-800",
              "disabled:bg-zinc-200",
              "disabled:text-zinc-400",
              className,
            )}
          />
        }
      >
        {children ?? <ArrowUpIcon className="size-4" aria-hidden="true" />}

        <span className="sr-only">
          {isStopButton ? "Stop generating" : "Send message"}
        </span>
      </TooltipTrigger>

      <TooltipContent side="top">
        {isStopButton ? "Stop generating" : "Send message"}
      </TooltipContent>
    </Tooltip>
  );
}
