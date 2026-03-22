"use client";

import { useState } from "react";
import { BUSINESS_NAME } from "@/lib/constants";

const GIFT_CARDS = [
  { id: "gc1", name: "Pamper Package", amount: 50, description: "Perfect for a quick pick-me-up" },
  { id: "gc2", name: "Indulgence Package", amount: 100, description: "Treat someone to a full service" },
  { id: "gc3", name: "Luxury Experience", amount: 200, description: "The ultimate salon & spa gift" },
  { id: "gc4", name: "VIP Package", amount: 500, description: "An unforgettable wellness journey" },
];

export default function GiftCardsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--dj-text)" }}>
          Gift Cards
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--dj-text-muted)" }}>
          Give the gift of beauty and wellness from {BUSINESS_NAME}
        </p>
      </div>

      {submitted ? (
        <div className="text-center py-12">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--dj-teal)" }}
          >
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: "var(--dj-text)" }}>Gift Card Sent!</h2>
          <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>
            An email has been sent to {recipientEmail} with the gift card details.
          </p>
          <button
            onClick={() => { setSubmitted(false); setSelected(null); setRecipientName(""); setRecipientEmail(""); setMessage(""); }}
            className="mt-4 px-6 py-2 rounded text-sm font-bold"
            style={{ border: "1px solid var(--dj-teal)", color: "var(--dj-teal)" }}
          >
            Send Another
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {GIFT_CARDS.map((gc) => (
              <button
                key={gc.id}
                onClick={() => setSelected(gc.id)}
                className="p-4 rounded text-left transition-colors"
                style={{
                  border: selected === gc.id ? "2px solid var(--dj-teal)" : "1px solid var(--dj-border)",
                  backgroundColor: selected === gc.id ? "var(--dj-teal-muted)" : "transparent",
                }}
              >
                <p className="text-lg font-bold" style={{ color: "var(--dj-teal)" }}>${gc.amount}</p>
                <p className="text-sm font-bold mt-1" style={{ color: "var(--dj-text)" }}>{gc.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--dj-text-muted)" }}>{gc.description}</p>
              </button>
            ))}
          </div>

          {selected && (
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Recipient's Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full rounded px-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid var(--dj-border)", color: "var(--dj-text)" }}
              />
              <input
                type="email"
                placeholder="Recipient's Email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full rounded px-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid var(--dj-border)", color: "var(--dj-text)" }}
              />
              <textarea
                placeholder="Add a personal message (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full rounded px-3 py-2.5 text-sm outline-none resize-none"
                style={{ border: "1px solid var(--dj-border)", color: "var(--dj-text)" }}
              />
              <button
                onClick={() => { if (recipientName && recipientEmail) setSubmitted(true); }}
                disabled={!recipientName || !recipientEmail}
                className="w-full py-3 rounded text-sm font-bold text-white transition-colors hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: "var(--dj-teal)" }}
              >
                Continue to Checkout
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
