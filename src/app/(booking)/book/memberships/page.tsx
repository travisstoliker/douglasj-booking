"use client";

import { useState } from "react";
import { BUSINESS_NAME } from "@/lib/constants";

const MEMBERSHIPS = [
  {
    id: "mem1",
    name: "Essential",
    price: 79,
    period: "month",
    features: [
      "1 Blowout per month",
      "10% off all services",
      "10% off retail products",
      "Priority booking",
    ],
  },
  {
    id: "mem2",
    name: "Premium",
    price: 149,
    period: "month",
    popular: true,
    features: [
      "1 Facial or Massage per month",
      "15% off all services",
      "15% off retail products",
      "Priority booking",
      "Free birthday service upgrade",
    ],
  },
  {
    id: "mem3",
    name: "Elite",
    price: 249,
    period: "month",
    features: [
      "1 HydraFacial per month",
      "20% off all services",
      "20% off retail products",
      "VIP priority booking",
      "Free birthday service upgrade",
      "Complimentary IV therapy quarterly",
    ],
  },
];

export default function MembershipsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedMembership = MEMBERSHIPS.find((m) => m.id === selected);

  function handleCheckout() {
    if (selected) {
      setSubmitted(true);
    }
  }

  if (submitted && selectedMembership) {
    return (
      <div className="py-6">
        <div className="max-w-md mx-auto text-center py-12">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--dj-teal)" }}
          >
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--dj-text)" }}>Membership Confirmed!</h2>
          <p className="text-sm mb-1" style={{ color: "var(--dj-text-muted)" }}>
            You have selected the <strong style={{ color: "var(--dj-text)" }}>{selectedMembership.name}</strong> plan at <strong style={{ color: "var(--dj-teal)" }}>${selectedMembership.price}/{selectedMembership.period}</strong>.
          </p>
          <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>
            A confirmation email will be sent with your membership details.
          </p>
          <button
            onClick={() => { setSubmitted(false); setSelected(null); }}
            className="mt-4 px-6 py-2 rounded text-sm font-bold"
            style={{ border: "1px solid var(--dj-teal)", color: "var(--dj-teal)" }}
          >
            View Plans Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--dj-text)" }}>
          Memberships
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--dj-text-muted)" }}>
          Join {BUSINESS_NAME} for exclusive benefits and savings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MEMBERSHIPS.map((mem) => (
          <div
            key={mem.id}
            className="rounded p-5 relative"
            style={{
              border: selected === mem.id ? "2px solid var(--dj-teal)" : "1px solid var(--dj-border)",
              backgroundColor: selected === mem.id ? "var(--dj-teal-muted)" : "transparent",
            }}
          >
            {mem.popular && (
              <span
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: "var(--dj-purple)" }}
              >
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-bold" style={{ color: "var(--dj-text)" }}>{mem.name}</h3>
            <p className="mt-2">
              <span className="text-2xl font-bold" style={{ color: "var(--dj-teal)" }}>${mem.price}</span>
              <span className="text-sm" style={{ color: "var(--dj-text-muted)" }}>/{mem.period}</span>
            </p>
            <ul className="mt-4 space-y-2">
              {mem.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--dj-text)" }}>
                  <svg className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "var(--dj-teal)" }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelected(mem.id)}
              className="w-full mt-5 py-2.5 rounded text-sm font-bold transition-colors"
              style={{
                backgroundColor: selected === mem.id ? "var(--dj-teal)" : "transparent",
                color: selected === mem.id ? "#ffffff" : "var(--dj-teal)",
                border: "1px solid var(--dj-teal)",
              }}
            >
              {selected === mem.id ? "Selected" : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-6 text-center">
          <button
            onClick={handleCheckout}
            className="px-8 py-3 rounded text-sm font-bold text-white"
            style={{ backgroundColor: "var(--dj-teal)" }}
          >
            Continue to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
