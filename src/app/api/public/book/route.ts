import { NextRequest, NextResponse } from "next/server";
import { SERVICE_NAMES, SERVICE_PRICES, PROVIDER_NAMES } from "@/lib/constants";

// In-memory bookings store (resets on deploy — for demo purposes)
const bookings: Array<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceIds: string[];
  providerId: string;
  startTime: string;
  notes?: string;
  createdAt: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, serviceIds, providerId, startTime, notes } = body;

    if (!firstName || !lastName || !email || !phone || !serviceIds?.length || !providerId || !startTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await new Promise((r) => setTimeout(r, 500));

    const id = `DJ-${Date.now().toString(36).toUpperCase()}`;
    const total = serviceIds.reduce(
      (sum: number, sid: string) => sum + (SERVICE_PRICES[sid] || 0),
      0
    );

    const booking = {
      id,
      firstName,
      lastName,
      email,
      phone,
      serviceIds,
      providerId,
      startTime,
      notes,
      createdAt: new Date().toISOString(),
    };

    bookings.push(booking);

    return NextResponse.json({
      appointment: {
        id,
        providerName: PROVIDER_NAMES[providerId] || "Provider",
        startTime,
        services: serviceIds.map((sid: string) => SERVICE_NAMES[sid] || sid),
        total,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// GET endpoint to retrieve bookings (for admin)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== "Bearer douglasj-admin-2026") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ bookings, total: bookings.length });
}
