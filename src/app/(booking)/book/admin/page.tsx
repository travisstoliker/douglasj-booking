"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { BUSINESS_NAME, BUSINESS_LOCATION } from "@/lib/constants";

type Booking = {
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
};

const ADMIN_TOKEN = "douglasj-admin-2026";

const PROVIDER_NAMES: Record<string, string> = {
  s1: "Sarah Mitchell",
  s2: "Jessica Taylor",
  s3: "Marcus Johnson",
  s4: "Emily Chen",
  s5: "Dr. Lauren Davis",
  s6: "Amanda Rivera",
  s7: "Nicole Park",
};

const SERVICE_NAMES: Record<string, string> = {
  h1: "Haircut - Female", h2: "Haircut - Male", h3: "Haircut - Child Female",
  h4: "Haircut - Child Male", h5: "Haircut Blowout Finish", h6: "Haircut Thermal Blowout",
  h7: "Beard Trim", hc2: "Color Retouch", hc3: "All-Over Color",
  hc4: "Color + Partial Highlight", hc5: "Full Highlight", hc6: "Custom Color",
  hc7: "Color Transformation", hs1: "Blowout Finish", hs2: "Blowout Thermal Style",
  b1: "Barber Haircut", b2: "Barber Fade", b3: "Beard Trim", b4: "Hot Towel Shave",
  b5: "Express Hot Towel Facial", b6: "Hot Towel Shave + Facial",
  n1: "Aveda Manicure", n2: "Aveda Pedicure", n3: "Hot Stone Pedicure",
  n5: "Manicure + Gel Polish", n6: "Pedicure + Gel Polish",
  sk1: "Standard Facial 60min", sk2: "Standard Facial 90min", sk3: "Dermaplane",
  sk5: "Signature HydraFacial", sk6: "Deluxe HydraFacial", sk7: "Platinum HydraFacial",
  bw1: "Aroma Massage 60min", bw2: "Aroma Massage 90min", bw3: "Hot Stone Massage",
  bw5: "Reboot IV", bw6: "Myer's Cocktail IV", bw7: "Immunity IV",
  i3: "Filler Dissolver",
  m1: "Makeup - Advanced", m2: "Makeup - Senior", m3: "Lash Lift",
  m6: "Brow Lamination", m8: "Microblading",
  w1: "Brow Wax", w4: "Full Face Wax", w7: "Brazilian Wax",
  l1: "Laser - Upper Lip", l5: "Laser - Brazilian", l6: "Laser - Full Face",
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"bookings" | "providers" | "stats">("bookings");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (email === "admin@douglasj.com" && password === "DJAdmin2026!") {
      setAuthenticated(true);
      fetchBookings();
    } else {
      setError("Invalid admin credentials.");
    }
  }

  async function fetchBookings() {
    setLoading(true);
    try {
      const res = await fetch("/api/public/book", {
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {
      setBookings([]);
    }
    setLoading(false);
  }

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto py-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "var(--dj-text)" }}>
            Admin Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--dj-text-muted)" }}>
            {BUSINESS_NAME} - {BUSINESS_LOCATION}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase block mb-1" style={{ color: "var(--dj-text-muted)" }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@douglasj.com"
              className="w-full rounded px-3 py-2.5 text-sm outline-none"
              style={{ border: "1px solid var(--dj-border)", color: "var(--dj-text)" }}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase block mb-1" style={{ color: "var(--dj-text-muted)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded px-3 py-2.5 text-sm outline-none"
              style={{ border: "1px solid var(--dj-border)", color: "var(--dj-text)" }}
              required
            />
          </div>

          {error && (
            <p className="text-sm p-3 rounded" style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#dc2626" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded text-sm font-bold text-white"
            style={{ backgroundColor: "var(--dj-teal)" }}
          >
            Sign In to Admin
          </button>
        </form>

        <div className="mt-6 p-4 rounded text-xs" style={{ backgroundColor: "var(--dj-bg-light)", border: "1px solid var(--dj-border-light)" }}>
          <p className="font-bold mb-1" style={{ color: "var(--dj-text)" }}>Admin Login:</p>
          <p style={{ color: "var(--dj-text-muted)" }}>admin@douglasj.com / DJAdmin2026!</p>
        </div>
      </div>
    );
  }

  // Stats
  const totalBookings = bookings.length;
  const todayBookings = bookings.filter(
    (b) => new Date(b.createdAt).toDateString() === new Date().toDateString()
  ).length;
  const uniqueClients = new Set(bookings.map((b) => b.email)).size;

  return (
    <div className="py-6">
      {/* Admin Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--dj-text)" }}>
            Admin Dashboard
          </h1>
          <p className="text-xs" style={{ color: "var(--dj-text-muted)" }}>
            {BUSINESS_NAME} - {BUSINESS_LOCATION}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchBookings}
            className="px-4 py-2 rounded text-xs font-bold"
            style={{ border: "1px solid var(--dj-teal)", color: "var(--dj-teal)" }}
          >
            Refresh
          </button>
          <button
            onClick={() => setAuthenticated(false)}
            className="px-4 py-2 rounded text-xs font-bold text-white"
            style={{ backgroundColor: "#999" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded p-4" style={{ backgroundColor: "var(--dj-teal-muted)", border: "1px solid rgba(92,160,166,0.2)" }}>
          <p className="text-2xl font-bold" style={{ color: "var(--dj-teal)" }}>{totalBookings}</p>
          <p className="text-xs font-bold uppercase" style={{ color: "var(--dj-text-muted)" }}>Total Bookings</p>
        </div>
        <div className="rounded p-4" style={{ backgroundColor: "var(--dj-purple-muted)", border: "1px solid rgba(181,96,242,0.2)" }}>
          <p className="text-2xl font-bold" style={{ color: "var(--dj-purple)" }}>{todayBookings}</p>
          <p className="text-xs font-bold uppercase" style={{ color: "var(--dj-text-muted)" }}>Today</p>
        </div>
        <div className="rounded p-4" style={{ backgroundColor: "var(--dj-bg-light)", border: "1px solid var(--dj-border-light)" }}>
          <p className="text-2xl font-bold" style={{ color: "var(--dj-text)" }}>{uniqueClients}</p>
          <p className="text-xs font-bold uppercase" style={{ color: "var(--dj-text-muted)" }}>Unique Clients</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-4">
        {(["bookings", "providers", "stats"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded text-xs font-bold uppercase"
            style={{
              backgroundColor: activeTab === tab ? "var(--dj-teal)" : "transparent",
              color: activeTab === tab ? "#ffffff" : "var(--dj-text-muted)",
              border: activeTab === tab ? "1px solid var(--dj-teal)" : "1px solid var(--dj-border)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div>
          {loading ? (
            <div className="py-10 text-center">
              <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-10 text-center rounded" style={{ border: "1px solid var(--dj-border)" }}>
              <p className="text-lg font-bold mb-1" style={{ color: "var(--dj-text)" }}>No Bookings Yet</p>
              <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>
                Bookings made through the public site will appear here.
              </p>
              <p className="text-xs mt-2" style={{ color: "var(--dj-text-light)" }}>
                Note: Bookings are stored in memory and reset on redeploy.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded p-4"
                  style={{ border: "1px solid var(--dj-border)" }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--dj-text)" }}>
                        {booking.firstName} {booking.lastName}
                      </p>
                      <p className="text-xs" style={{ color: "var(--dj-text-muted)" }}>
                        {booking.email} &middot; {booking.phone}
                      </p>
                    </div>
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-1 rounded"
                      style={{ backgroundColor: "var(--dj-teal-muted)", color: "var(--dj-teal)" }}
                    >
                      {booking.id}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: "var(--dj-text-muted)" }}>
                    <p><strong>Services:</strong> {booking.serviceIds.map((id) => SERVICE_NAMES[id] || id).join(", ")}</p>
                    <p><strong>Provider:</strong> {PROVIDER_NAMES[booking.providerId] || booking.providerId}</p>
                    <p><strong>Date/Time:</strong> {format(new Date(booking.startTime), "MMM d, yyyy h:mm a")}</p>
                    <p><strong>Booked:</strong> {format(new Date(booking.createdAt), "MMM d, yyyy h:mm a")}</p>
                  </div>
                  {booking.notes && (
                    <p className="text-xs mt-2 italic" style={{ color: "var(--dj-text-light)" }}>
                      Note: {booking.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Providers Tab */}
      {activeTab === "providers" && (
        <div className="space-y-3">
          {Object.entries(PROVIDER_NAMES).map(([id, name]) => {
            const providerBookings = bookings.filter((b) => b.providerId === id);
            return (
              <div
                key={id}
                className="flex items-center justify-between rounded p-4"
                style={{ border: "1px solid var(--dj-border)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: "var(--dj-teal)" }}
                  >
                    {name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: "var(--dj-text)" }}>{name}</p>
                    <p className="text-xs" style={{ color: "var(--dj-text-muted)" }}>ID: {id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: "var(--dj-teal)" }}>{providerBookings.length}</p>
                  <p className="text-[10px] uppercase font-bold" style={{ color: "var(--dj-text-muted)" }}>Bookings</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === "stats" && (
        <div className="space-y-4">
          <div className="rounded p-5" style={{ border: "1px solid var(--dj-border)" }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: "var(--dj-text)" }}>System Info</h3>
            <div className="space-y-2 text-xs" style={{ color: "var(--dj-text-muted)" }}>
              <p><strong>Platform:</strong> Next.js 16.2.1 on Vercel</p>
              <p><strong>Database:</strong> In-memory (resets on deploy)</p>
              <p><strong>API:</strong> /api/public/availability, /api/public/book</p>
              <p><strong>Auth:</strong> Demo mode (client-side)</p>
            </div>
          </div>
          <div className="rounded p-5" style={{ border: "1px solid var(--dj-border)" }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: "var(--dj-text)" }}>Service Categories</h3>
            <div className="flex flex-wrap gap-2">
              {["Hair", "Barber", "Nails", "Skin", "Body + Wellness", "Injectables", "Makeup Brows + Lashes", "Waxing", "Laser Hair Removal"].map((cat) => (
                <span
                  key={cat}
                  className="text-[10px] font-bold uppercase px-3 py-1 rounded"
                  style={{ backgroundColor: "var(--dj-bg-light)", color: "var(--dj-text-muted)", border: "1px solid var(--dj-border-light)" }}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
