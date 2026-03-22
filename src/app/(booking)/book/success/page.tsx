"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, MapPin, Phone } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import {
  BUSINESS_PHONE,
  BUSINESS_ADDRESS,
  CANCELLATION_FEE,
  CANCELLATION_WINDOW_HOURS,
} from "@/lib/constants";

function SuccessContent() {
  const searchParams = useSearchParams();
  const provider = searchParams.get("provider") || "";
  const start = searchParams.get("start") || "";
  const services = searchParams.get("services") || "";
  const total = searchParams.get("total") || "0";

  const startDate = start ? new Date(start) : null;

  return (
    <div className="dj-fade-up space-y-6 max-w-lg mx-auto">
      {/* Success icon */}
      <div className="flex justify-center pt-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "var(--dj-teal)",
            boxShadow: "0 4px 20px rgba(92,160,166,0.3)",
          }}
        >
          <Check className="h-9 w-9 text-white" />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center space-y-1">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--dj-text)" }}
        >
          You&apos;re All Set
        </h1>
        <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>
          We look forward to seeing you
        </p>
      </div>

      {/* Booking details */}
      <div
        className="rounded overflow-hidden"
        style={{ border: "1px solid var(--dj-border)" }}
      >
        <SummaryRow label="Services" value={services} />
        <SummaryRow label="Provider" value={provider} />
        {startDate && (
          <>
            <SummaryRow
              label="Date"
              value={format(startDate, "EEEE, MMMM d, yyyy")}
            />
            <SummaryRow label="Time" value={format(startDate, "h:mm a")} />
          </>
        )}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            backgroundColor: "var(--dj-teal-muted)",
            borderTop: "1px solid var(--dj-border-light)",
          }}
        >
          <span
            className="text-sm font-bold uppercase"
            style={{ color: "var(--dj-text)" }}
          >
            Total
          </span>
          <span
            className="text-lg font-bold"
            style={{ color: "var(--dj-teal)" }}
          >
            ${total}
          </span>
        </div>
      </div>

      {/* Location info */}
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: "var(--dj-text-muted)" }}
        >
          <MapPin className="h-4 w-4" style={{ color: "var(--dj-teal)" }} />
          {BUSINESS_ADDRESS}
        </div>
        <div
          className="flex items-center gap-2 text-sm"
          style={{ color: "var(--dj-text-muted)" }}
        >
          <Phone className="h-4 w-4" style={{ color: "var(--dj-teal)" }} />
          {BUSINESS_PHONE}
        </div>
      </div>

      {/* Policy reminder */}
      <div
        className="rounded p-4 text-center"
        style={{
          backgroundColor: "var(--dj-bg-light)",
          border: "1px solid var(--dj-border-light)",
        }}
      >
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--dj-text-muted)" }}
        >
          Please arrive 5-10 minutes early. Cancellations must be made at least{" "}
          {CANCELLATION_WINDOW_HOURS} hours before your appointment. Late
          cancellations are subject to a ${CANCELLATION_FEE} fee.
        </p>
      </div>

      {/* Book another */}
      <div className="text-center">
        <Link
          href="/book"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded text-sm font-bold tracking-wide transition-colors hover:opacity-90"
          style={{
            border: "1px solid var(--dj-teal)",
            color: "var(--dj-teal)",
            background: "transparent",
          }}
        >
          Book Another Appointment
        </Link>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-start justify-between px-4 py-3"
      style={{ borderBottom: "1px solid var(--dj-border-light)" }}
    >
      <span
        className="text-xs font-bold uppercase flex-shrink-0"
        style={{ color: "var(--dj-text-muted)" }}
      >
        {label}
      </span>
      <span
        className="text-sm font-medium text-right ml-4"
        style={{ color: "var(--dj-text)" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
