"use client";

import { CalendarClockIcon, SearchXIcon } from "lucide-react";

import { useRenderTool } from "@copilotkit/react-core/v2";

import {
  AvailableRoomCard,
  type AvailableRoom,
} from "@/components/available-room-card";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AGENT_ID } from "@/constants/agent";
import { formatRange } from "@/lib/date";

import { roomAvailabilitySchema } from "@/schemas/booking";

interface RoomAvailabilityResult {
  availableRooms: AvailableRoom[];
}

function parseAvailabilityResult(
  result: unknown,
): RoomAvailabilityResult | null {
  try {
    const value = typeof result === "string" ? JSON.parse(result) : result;

    if (
      !value ||
      typeof value !== "object" ||
      !Array.isArray((value as RoomAvailabilityResult).availableRooms)
    ) {
      return null;
    }

    return value as RoomAvailabilityResult;
  } catch {
    return null;
  }
}

function AvailabilitySkeleton() {
  return (
    <div className="w-full space-y-3">
      <div className="h-20 animate-pulse rounded-xl border bg-muted/40" />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-48 animate-pulse rounded-xl border bg-muted/40" />
        <div className="h-48 animate-pulse rounded-xl border bg-muted/40" />
      </div>
    </div>
  );
}

export function RoomAvailabilityCard() {
  useRenderTool(
    {
      agentId: AGENT_ID,

      name: "checkRoomAvailabilityTool",

      parameters: roomAvailabilitySchema,

      render: ({ status, result, parameters }) => {
        if (status !== "complete") {
          return <AvailabilitySkeleton />;
        }

        const data = parseAvailabilityResult(result);

        if (!data) {
          return (
            <Card size="sm" className="w-full">
              <CardContent className="py-5 text-sm text-destructive">
                Could not display the available rooms.
              </CardContent>
            </Card>
          );
        }

        const range = formatRange(parameters.startTime, parameters.endTime);

        if (data.availableRooms.length === 0) {
          return (
            <Card size="sm" className="w-full border-dashed">
              <CardContent className="flex flex-col items-center py-8 text-center">
                <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                  <SearchXIcon
                    className="size-5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>

                <p className="mt-3 font-medium">No available rooms</p>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try another time, reduce the attendee count, or choose a
                  different date.
                </p>
              </CardContent>
            </Card>
          );
        }

        const sortedRooms = [...data.availableRooms].sort(
          (first, second) => first.capacity - second.capacity,
        );

        const bestMatchId = sortedRooms[0]?.id;

        return (
          <div className="w-full space-y-3">
            <Card size="sm" className="w-full bg-muted/20">
              <CardHeader className="gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <CalendarClockIcon className="size-5" aria-hidden="true" />
                  </div>

                  <div>
                    <CardTitle className="text-base">Available rooms</CardTitle>

                    <CardDescription className="mt-1">
                      {range ?? "Rooms matching your request"}
                      {parameters.minCapacity
                        ? ` · ${parameters.minCapacity} people`
                        : ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid gap-3 sm:grid-cols-2">
              {sortedRooms.map((room) => (
                <AvailableRoomCard
                  key={room.id}
                  room={room}
                  requestedCapacity={parameters.minCapacity}
                  isBestMatch={room.id === bestMatchId}
                />
              ))}
            </div>

            <p className="px-1 text-xs text-muted-foreground">
              {data.availableRooms.length} available{" "}
              {data.availableRooms.length === 1 ? "room" : "rooms"} found.
            </p>
          </div>
        );
      },
    },
    [],
  );

  return null;
}
