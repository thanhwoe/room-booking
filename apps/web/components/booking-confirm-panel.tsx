"use client";

import { useState } from "react";
import type { z } from "zod";
import type { LucideIcon } from "lucide-react";
import {
  CalendarClockIcon,
  CalendarDaysIcon,
  CalendarPlusIcon,
  CalendarXIcon,
  DoorOpenIcon,
  HashIcon,
  Loader2Icon,
  ShieldCheckIcon,
  TextIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatRange } from "@/lib/date";
import { cn } from "@/lib/utils";
import { bookingConfirmSchema } from "@/schemas/booking";

type BookingConfirmationArgs = z.infer<typeof bookingConfirmSchema>;

type BookingAction = BookingConfirmationArgs["action"];

type Decision = "approved" | "denied";

interface BookingConfirmationPanelProps {
  args: BookingConfirmationArgs;
  respond: (result: string) => void | Promise<void>;
}

interface DetailItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}

interface ActionConfig {
  heading: string;
  description: string;
  badge: string;
  confirmLabel: string;
  rejectLabel: string;
  icon: LucideIcon;
  accentClassName: string;
  iconClassName: string;
  badgeClassName: string;
  confirmButtonClassName?: string;
}

const actionConfig: Record<BookingAction, ActionConfig> = {
  create: {
    heading: "Confirm new booking",
    description: "Review these details before creating the room reservation.",
    badge: "Create",
    confirmLabel: "Create booking",
    rejectLabel: "Not now",
    icon: CalendarPlusIcon,
    accentClassName: "bg-blue-500",
    iconClassName:
      "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
    badgeClassName:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400",
  },

  update: {
    heading: "Confirm booking changes",
    description: "Review the updated details before applying these changes.",
    badge: "Update",
    confirmLabel: "Apply changes",
    rejectLabel: "Keep current",
    icon: CalendarClockIcon,
    accentClassName: "bg-amber-500",
    iconClassName:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
    badgeClassName:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
  },

  cancel: {
    heading: "Cancel this booking?",
    description: "This reservation will be cancelled after you confirm.",
    badge: "Cancel",
    confirmLabel: "Cancel booking",
    rejectLabel: "Keep booking",
    icon: CalendarXIcon,
    accentClassName: "bg-destructive",
    iconClassName: "bg-destructive/10 text-destructive",
    badgeClassName: "border-destructive/20 bg-destructive/10 text-destructive",
    confirmButtonClassName: "bg-destructive text-white hover:bg-destructive/90",
  },
};

function DetailItem({ icon: Icon, label, value, className }: DetailItemProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-start gap-3 rounded-xl",
        "bg-muted/40 p-3",
        className,
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center",
          "justify-center rounded-lg",
          "bg-background text-muted-foreground",
          "ring-1 ring-foreground/10",
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p
          className={cn(
            "text-xs font-medium uppercase",
            "tracking-wide text-muted-foreground",
          )}
        >
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export function BookingConfirmationPanel({
  args,
  respond,
}: BookingConfirmationPanelProps) {
  const [submittingDecision, setSubmittingDecision] = useState<Decision | null>(
    null,
  );

  const config = actionConfig[args.action];
  const ActionIcon = config.icon;

  const range = formatRange(args.startTime, args.endTime);

  const isSubmitting = submittingDecision !== null;

  async function submitDecision(decision: Decision): Promise<void> {
    if (isSubmitting) {
      return;
    }

    setSubmittingDecision(decision);

    const response =
      decision === "approved"
        ? "APPROVED: the user confirmed, proceed with the booking change."
        : "DENIED: the user rejected the booking change, do not proceed.";

    try {
      await respond(response);
    } catch (error) {
      console.error("[BookingConfirmCard] Could not submit decision.", error);

      setSubmittingDecision(null);
    }
  }

  return (
    <Card size="sm" className="w-full gap-0 overflow-hidden py-0 shadow-sm">
      <div className={cn("h-1 w-full", config.accentClassName)} />

      <CardHeader className="border-b py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-11 shrink-0 items-center",
              "justify-center rounded-xl",
              config.iconClassName,
            )}
          >
            <ActionIcon className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <Badge variant="outline" className={config.badgeClassName}>
              <ShieldCheckIcon data-icon="inline-start" aria-hidden="true" />
              Approval required · {config.badge}
            </Badge>

            <CardTitle className="mt-2 text-base">{config.heading}</CardTitle>

            <CardDescription className="mt-1 leading-5">
              {config.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          {args.title && (
            <DetailItem icon={TextIcon} label="Purpose" value={args.title} />
          )}

          {args.roomName && (
            <DetailItem
              icon={DoorOpenIcon}
              label="Room"
              value={args.roomName}
            />
          )}

          {range && (
            <DetailItem
              icon={CalendarDaysIcon}
              label="Schedule"
              value={range}
              className={
                args.attendees === undefined ? "sm:col-span-2" : undefined
              }
            />
          )}

          {args.attendees !== undefined && (
            <DetailItem
              icon={UsersIcon}
              label="Attendees"
              value={`${args.attendees} ${
                args.attendees === 1 ? "person" : "people"
              }`}
            />
          )}

          {args.bookingId && (
            <DetailItem
              icon={HashIcon}
              label="Booking ID"
              value={args.bookingId}
              className="sm:col-span-2"
            />
          )}
        </div>
      </CardContent>

      <CardFooter
        className={cn(
          "flex-col items-stretch gap-3",
          "bg-muted/30 sm:flex-row",
          "sm:items-center sm:justify-between",
        )}
      >
        <p className="text-xs leading-5 text-muted-foreground">
          Nothing will be changed until you confirm.
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isSubmitting}
            onClick={() => {
              void submitDecision("denied");
            }}
            className="sm:min-w-28"
          >
            {submittingDecision === "denied" ? (
              <Loader2Icon className="animate-spin" aria-hidden="true" />
            ) : null}

            {config.rejectLabel}
          </Button>

          <Button
            type="button"
            size="lg"
            disabled={isSubmitting}
            onClick={() => {
              void submitDecision("approved");
            }}
            className={cn("sm:min-w-32", config.confirmButtonClassName)}
          >
            {submittingDecision === "approved" ? (
              <Loader2Icon className="animate-spin" aria-hidden="true" />
            ) : null}

            {config.confirmLabel}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
