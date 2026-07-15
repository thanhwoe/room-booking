"use client";

import { useRenderTool } from "@copilotkit/react-core/v2";

import { BookingCard } from "@/components/booking-card";
import { bookingSchema } from "@/schemas/booking";
import { AGENT_ID } from "@/constants/agent";

interface BookingListResult {
  bookings: {
    id: string;
    roomId: string;
    roomName: string;
    title: string;
    organizer: string;
    startTime: string;
    endTime: string;
    attendees: number;
    status: "confirmed" | "cancelled";
  }[];
}

export function BookingListCard() {
  useRenderTool(
    {
      agentId: AGENT_ID,
      name: "listBookingsTool",
      parameters: bookingSchema,
      render: ({ status, result }) => {
        if (status !== "complete") {
          return (
            <div className="w-full animate-pulse rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
              Looking up bookings...
            </div>
          );
        }

        let data: BookingListResult;

        try {
          data = JSON.parse(result) as BookingListResult;
        } catch {
          return (
            <div className="w-full rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              Could not display the booking information.
            </div>
          );
        }

        if (data.bookings.length === 0) {
          return (
            <div className="w-full rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
              No bookings found.
            </div>
          );
        }

        return (
          <div className="flex w-full flex-col gap-3">
            {data.bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        );
      },
    },
    [],
  );

  return null;
}
