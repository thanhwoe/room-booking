"use client";

import { formatRange } from "@/lib/date";
import { bookingConfirmSchema } from "@/schemas/booking";
import { useHumanInTheLoop } from "@copilotkit/react-core/v2";

const actionCopy: Record<
  "create" | "update" | "cancel",
  { heading: string; color: string }
> = {
  create: {
    heading: "Create this booking?",
    color: "border-blue-200 bg-blue-50",
  },
  update: {
    heading: "Apply this change?",
    color: "border-amber-200 bg-amber-50",
  },
  cancel: {
    heading: "Cancel this booking?",
    color: "border-red-200 bg-red-50",
  },
};

export function BookingConfirmCard() {
  useHumanInTheLoop(
    {
      name: "confirmBookingChange",
      description:
        "Ask the user to confirm or reject a booking change (create, update, or cancel) before it is applied.",
      parameters: bookingConfirmSchema,
      render: ({ args, respond, status }) => {
        if (status !== "executing" || !respond) return <></>;
        const { heading, color } = actionCopy[args.action];
        const range = formatRange(args.startTime, args.endTime);

        return (
          <div className={`w-full rounded-lg border p-4 shadow-sm ${color}`}>
            <p className="font-semibold text-gray-900">{heading}</p>
            <div className="mt-2 space-y-1 text-sm text-gray-700">
              {args.title && <p>Purpose: {args.title}</p>}
              {args.roomName && <p>Room: {args.roomName}</p>}
              {range && <p>When: {range}</p>}
              {args.attendees !== undefined && (
                <p>Attendees: {args.attendees}</p>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() =>
                  respond(
                    "APPROVED: the user confirmed, proceed with the booking change.",
                  )
                }
                className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
              >
                Confirm
              </button>
              <button
                onClick={() =>
                  respond(
                    "DENIED: the user rejected the booking change, do not proceed.",
                  )
                }
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      },
    },
    [],
  );

  return null;
}
