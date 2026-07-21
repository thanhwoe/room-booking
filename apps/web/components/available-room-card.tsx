"use client";

import {
  CheckCircle2Icon,
  DoorOpenIcon,
  MapPinIcon,
  MonitorIcon,
  PresentationIcon,
  UsersIcon,
  VideoIcon,
  WifiIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface AvailableRoom {
  id: string;
  name: string;
  capacity: number;
  location?: string;
  amenities: string[];
}

interface AvailableRoomCardProps {
  room: AvailableRoom;
  requestedCapacity?: number;
  isBestMatch?: boolean;
}

function getAmenityIcon(amenity: string) {
  const normalized = amenity.toLowerCase();

  if (normalized.includes("video") || normalized.includes("conference")) {
    return VideoIcon;
  }

  if (normalized.includes("projector")) {
    return PresentationIcon;
  }

  if (normalized.includes("screen") || normalized.includes("tv")) {
    return MonitorIcon;
  }

  if (normalized.includes("wifi")) {
    return WifiIcon;
  }

  return CheckCircle2Icon;
}

export function AvailableRoomCard({
  room,
  requestedCapacity,
  isBestMatch = false,
}: AvailableRoomCardProps) {
  const remainingSeats =
    requestedCapacity === undefined
      ? undefined
      : room.capacity - requestedCapacity;

  return (
    <Card
      size="sm"
      className={cn(
        "relative overflow-hidden transition-all",
        "hover:-translate-y-0.5 hover:shadow-md",
        isBestMatch && "border-primary/40 ring-1 ring-primary/10",
      )}
    >
      {isBestMatch && (
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
      )}

      <CardHeader className="gap-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center",
                "justify-center rounded-xl",
                "bg-primary/10 text-primary",
              )}
            >
              <DoorOpenIcon className="size-5" aria-hidden="true" />
            </div>

            <div className="min-w-0">
              <CardTitle className="truncate text-base">{room.name}</CardTitle>

              {room.location && (
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPinIcon className="size-3.5" aria-hidden="true" />

                  <span>{room.location}</span>
                </div>
              )}
            </div>
          </div>

          <Badge
            variant="outline"
            className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
          >
            <CheckCircle2Icon data-icon="inline-start" aria-hidden="true" />
            Available
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
          <div className="flex size-8 items-center justify-center rounded-lg bg-background text-muted-foreground ring-1 ring-foreground/10">
            <UsersIcon className="size-4" aria-hidden="true" />
          </div>

          <div>
            <p className="text-sm font-medium">Up to {room.capacity} people</p>

            {remainingSeats !== undefined && remainingSeats >= 0 && (
              <p className="text-xs text-muted-foreground">
                {remainingSeats === 0
                  ? "Exact capacity match"
                  : `${remainingSeats} extra ${
                      remainingSeats === 1 ? "seat" : "seats"
                    }`}
              </p>
            )}
          </div>
        </div>

        {room.amenities.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Amenities
            </p>

            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => {
                const AmenityIcon = getAmenityIcon(amenity);

                return (
                  <Badge
                    key={amenity}
                    variant="secondary"
                    className="font-normal"
                  >
                    <AmenityIcon data-icon="inline-start" aria-hidden="true" />

                    {amenity}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {isBestMatch && (
          <div className="flex items-center gap-2 border-t pt-3 text-xs font-medium text-primary">
            <CheckCircle2Icon className="size-4" aria-hidden="true" />
            Best capacity match
          </div>
        )}
      </CardContent>
    </Card>
  );
}
