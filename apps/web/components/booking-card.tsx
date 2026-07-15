import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  DoorOpenIcon,
  UserRoundIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatRange } from "@/lib/date";
import { cn } from "@/lib/utils";

interface BookingCardData {
  id: string;
  roomId: string;
  roomName: string;
  title: string;
  organizer: string;
  startTime: string;
  endTime: string;
  attendees: number;
  status: "confirmed" | "cancelled";
}

interface BookingCardProps {
  booking: BookingCardData;
}

interface BookingDetailProps {
  icon: typeof CalendarDaysIcon;
  label: string;
  value: string;
  className?: string;
}

function BookingDetail({
  icon: Icon,
  label,
  value,
  className,
}: BookingDetailProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-start gap-3 px-4 py-3.5",
        "sm:px-5 sm:py-4",
        className,
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex size-8 shrink-0",
          "items-center justify-center rounded-lg",
          "bg-background text-muted-foreground",
          "ring-1 ring-foreground/10",
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export function BookingCard({ booking }: BookingCardProps) {
  const isCancelled = booking.status === "cancelled";

  const attendeeLabel = `${booking.attendees} ${
    booking.attendees === 1 ? "attendee" : "attendees"
  }`;

  return (
    <Card
      size="sm"
      className={cn(
        "w-full gap-0 py-0",
        "bg-card shadow-sm",
        "transition duration-200",
        "hover:-translate-y-0.5 hover:shadow-md",
        isCancelled && "opacity-80",
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start gap-4 p-4 sm:p-5">
          <div
            className={cn(
              "flex size-11 shrink-0",
              "items-center justify-center rounded-xl",
              isCancelled
                ? "bg-destructive/10 text-destructive"
                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
            )}
          >
            <DoorOpenIcon className="size-5" aria-hidden="true" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words text-base font-semibold leading-snug text-card-foreground">
                  {booking.title}
                </h3>

                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <DoorOpenIcon
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />

                  <span className="truncate">{booking.roomName}</span>
                </p>
              </div>

              {isCancelled ? (
                <Badge variant="destructive" className="shrink-0">
                  <XCircleIcon data-icon="inline-start" aria-hidden="true" />
                  Cancelled
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0",
                    "border-emerald-200 bg-emerald-50",
                    "text-emerald-700",
                    "dark:border-emerald-900",
                    "dark:bg-emerald-950/40",
                    "dark:text-emerald-400",
                  )}
                >
                  <CheckCircle2Icon
                    data-icon="inline-start"
                    aria-hidden="true"
                  />
                  Confirmed
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "grid border-t bg-muted/30",
            "sm:grid-cols-[1.35fr_0.8fr_1fr]",
          )}
        >
          <BookingDetail
            icon={CalendarDaysIcon}
            label="Schedule"
            value={formatRange(booking.startTime, booking.endTime) || "--"}
          />

          <BookingDetail
            icon={UsersIcon}
            label="Guests"
            value={attendeeLabel}
            className="border-t sm:border-l sm:border-t-0"
          />

          <BookingDetail
            icon={UserRoundIcon}
            label="Organizer"
            value={booking.organizer}
            className="border-t sm:border-l sm:border-t-0"
          />
        </div>
      </CardContent>
    </Card>
  );
}
