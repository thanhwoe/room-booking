"use client";

import { useRenderTool } from "@copilotkit/react-core/v2";
import { BookingCard } from "./booking-card";
import { bookingSchema } from "@/schemas/booking";

interface BookingListCardProps {
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
      name: "list-bookings",
      parameters: bookingSchema,

      render: ({ status, result }) => {
        if (status !== "complete") {
          return (
            <div className="p-2 text-sm text-gray-500">
              Looking up bookings...
            </div>
          );
        }
        const data = (
          typeof result === "string" ? JSON.parse(result) : result
        ) as BookingListCardProps;
        if (data.bookings.length === 0) {
          return (
            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
              No bookings found.
            </div>
          );
        }
        return (
          <div className="flex w-full flex-col gap-2">
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
