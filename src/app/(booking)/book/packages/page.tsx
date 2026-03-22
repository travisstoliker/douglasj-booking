"use client";

import { useState } from "react";
import { BUSINESS_NAME } from "@/lib/constants";

const PACKAGES = [
  {
    id: "pkg1",
    name: "Bridal Party Package",
    price: 450,
    description: "Hair styling, makeup, and lash services for your special day",
    includes: ["Special Occasion Style", "Makeup Application", "Lash Lift + Tint"],
    sessions: 1,
  },
  {
    id: "pkg2",
    name: "Monthly Glow Up",
    price: 299,
    originalPrice: 375,
    description: "3 facials over 3 months for ongoing skin health",
    includes: ["3x Standard Facial - 60 min"],
    sessions: 3,
  },
  {
    id: "pkg3",
    name: "Color Care Package",
    price: 350,
    originalPrice: 432,
    description: "Color retouch + haircut combo for 3 visits",
    includes: ["3x Color Retouch", "3x Haircut"],
    sessions: 3,
  },
  {
    id: "pkg4",
    name: "Laser Hair Removal - 6 Pack",
    price: 999,
    originalPrice: 1350,
    description: "6 sessions of laser hair removal on one area",
    includes: ["6x Laser Hair Removal (choice of area)"],
    sessions: 6,
  },
  {
    id: "pkg5",
    name: "Wellness Reset",
    price: 599,
    originalPrice: 750,
    description: "5-session IV therapy and massage package",
    includes: ["3x IV Therapy (choice)", "2x Aroma Massage 60 min"],
    sessions: 5,
  },
];

export default function PackagesPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "var(--dj-text)" }}>
          Packages
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--dj-text-muted)" }}>
          Save more with {BUSINESS_NAME} bundled service packages
        </p>
      </div>

      <div className="space-y-3">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="rounded p-5 cursor-pointer transition-colors"
            style={{
              border: selected === pkg.id ? "2px solid var(--dj-teal)" : "1px solid var(--dj-border)",
              backgroundColor: selected === pkg.id ? "var(--dj-teal-muted)" : "transparent",
            }}
            onClick={() => setSelected(pkg.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-bold" style={{ color: "var(--dj-text)" }}>
                  {pkg.name}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--dj-text-muted)" }}>
                  {pkg.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {pkg.includes.map((item) => (
                    <span
                      key={item}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "var(--dj-bg-light)", color: "var(--dj-text-muted)", border: "1px solid var(--dj-border-light)" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <p className="text-lg font-bold" style={{ color: "var(--dj-teal)" }}>
                  ${pkg.price}
                </p>
                {pkg.originalPrice && (
                  <p className="text-xs line-through" style={{ color: "var(--dj-text-light)" }}>
                    ${pkg.originalPrice}
                  </p>
                )}
                <p className="text-[10px]" style={{ color: "var(--dj-text-muted)" }}>
                  {pkg.sessions} session{pkg.sessions > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-6 text-center">
          <button
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
