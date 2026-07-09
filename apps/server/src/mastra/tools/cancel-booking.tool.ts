import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { ObjectId } from "mongodb";
import { getBookingsCollection } from "../database/collections/booking.collection";

export const cancelBookingTool = createTool({
  id: "cancel-booking",
  description:
    "Cancel an existing confirmed booking. Only call this AFTER the user has approved the cancellation via the confirmBookingChange confirmation step.",
  inputSchema: z.object({
    bookingId: z.string().describe("The id of the booking to cancel"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
  }),
  execute: async (inputData) => {
    const { bookingId } = inputData;

    let bookingObjectId: ObjectId;
    try {
      bookingObjectId = new ObjectId(bookingId);
    } catch {
      return { success: false, message: `Invalid bookingId: "${bookingId}".` };
    }

    const bookingsCollection = await getBookingsCollection();
    const booking = await bookingsCollection.findOne({ _id: bookingObjectId });

    if (!booking) {
      return {
        success: false,
        message: `Booking with id "${bookingId}" was not found.`,
      };
    }
    if (booking.status === "cancelled") {
      return { success: false, message: "This booking is already cancelled." };
    }

    await bookingsCollection.updateOne(
      { _id: bookingObjectId },
      { $set: { status: "cancelled", updatedAt: new Date().toISOString() } },
    );

    return {
      success: true,
      message: `Booking for "${booking.title}" (${booking.roomName}) has been cancelled.`,
    };
  },
});
