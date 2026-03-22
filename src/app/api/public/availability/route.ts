import { NextRequest, NextResponse } from "next/server";
import { PROVIDER_NAMES } from "@/lib/constants";

// Generate realistic time slots for a given date
function generateSlots(date: string, providerId: string) {
  const dayOfWeek = new Date(date + "T12:00:00").getDay();

  const startHour = dayOfWeek === 0 ? 11 : dayOfWeek === 6 ? 8 : 8;
  const endHour =
    dayOfWeek === 0
      ? 17
      : dayOfWeek === 5
      ? 18
      : dayOfWeek === 6
      ? 17
      : dayOfWeek === 3 || dayOfWeek === 4
      ? 21
      : 20;

  const slots = [];
  const seed = providerId.charCodeAt(1) || 0;

  for (let hour = startHour; hour < endHour; hour++) {
    for (const min of [0, 30]) {
      const time = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      const available = ((hour + min + seed) % 10) > 2;
      slots.push({ time, available });
    }
  }

  return slots;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");
  const providerId = searchParams.get("providerId");
  const serviceIds = searchParams.get("serviceIds");

  if (!date || !providerId || !serviceIds) {
    return NextResponse.json(
      { error: "Missing required parameters: date, providerId, serviceIds" },
      { status: 400 }
    );
  }

  await new Promise((r) => setTimeout(r, 300));

  const slots = [
    {
      providerId,
      providerName: PROVIDER_NAMES[providerId] || "Provider",
      slots: generateSlots(date, providerId),
    },
  ];

  return NextResponse.json({ slots });
}
