import { NextRequest, NextResponse } from "next/server";
import { addMinutes, format, parse, isBefore, isAfter } from "date-fns";

// Generate realistic time slots for a given date
function generateSlots(date: string, providerId: string) {
  const dayOfWeek = new Date(date + "T12:00:00").getDay();

  // Closed on Sunday or very limited
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
  // Use provider ID to create some variation in availability
  const seed = providerId.charCodeAt(1) || 0;

  for (let hour = startHour; hour < endHour; hour++) {
    for (const min of [0, 30]) {
      const time = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
      // Make ~70% of slots available, varying by provider
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

  // Simulate a small delay like a real API
  await new Promise((r) => setTimeout(r, 300));

  const providerNames: Record<string, string> = {
    s1: "Sarah Mitchell",
    s2: "Jessica Taylor",
    s3: "Marcus Johnson",
    s4: "Emily Chen",
    s5: "Dr. Lauren Davis",
    s6: "Amanda Rivera",
    s7: "Nicole Park",
  };

  const slots = [
    {
      providerId,
      providerName: providerNames[providerId] || "Provider",
      slots: generateSlots(date, providerId),
    },
  ];

  return NextResponse.json({ slots });
}
