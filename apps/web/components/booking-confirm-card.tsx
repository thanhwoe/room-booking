"use client";

import { bookingConfirmSchema } from "@/schemas/booking";
import { useHumanInTheLoop } from "@copilotkit/react-core/v2";
import { BookingConfirmationPanel } from "./booking-confirm-panel";

export function BookingConfirmCard() {
  useHumanInTheLoop(
    {
      name: "confirmBookingChange",
      description:
        "Ask the user to confirm or reject a booking change (create, update, or cancel) before it is applied.",
      parameters: bookingConfirmSchema,
      render: ({ args, respond, status }) => {
        if (status !== "executing" || !respond) {
          return <></>;
        }

        return <BookingConfirmationPanel args={args} respond={respond} />;
      },
    },
    [],
  );

  return null;
}
