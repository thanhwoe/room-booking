import { formatRange } from "@/lib/date";

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

export function BookingCard({ booking }: { booking: BookingCardData }) {
  const isCancelled = booking.status === "cancelled";

  return (
    <div
      className={`w-full rounded-lg border p-4 shadow-sm ${
        isCancelled
          ? "border-red-200 bg-red-50"
          : "border-green-200 bg-green-50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-gray-900">{booking.title}</p>
          <p className="text-sm text-gray-600">{booking.roomName}</p>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            isCancelled
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isCancelled ? "Cancelled" : "Confirmed"}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-700">
        {formatRange(booking.startTime, booking.endTime)}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        {booking.attendees} attendee{booking.attendees > 1 ? "s" : ""} ·
        Organized by {booking.organizer}
      </p>
    </div>
  );
}
