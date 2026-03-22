"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BUSINESS_NAME } from "@/lib/constants";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Simulate auth
    await new Promise((r) => setTimeout(r, 800));

    if (mode === "login") {
      // Demo accounts
      if (
        (email === "guest@douglasj.com" && password === "Douglas2026!") ||
        (email === "admin@douglasj.com" && password === "DJAdmin2026!")
      ) {
        setSuccess("Welcome back! Redirecting...");
        setTimeout(() => router.push("/book"), 1500);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } else {
      if (!firstName || !lastName || !email || !phone || !password) {
        setError("Please fill in all fields.");
      } else {
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => router.push("/book"), 1500);
      }
    }
    setLoading(false);
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="text-center mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--dj-text)" }}
        >
          {mode === "login" ? "Sign In" : "Create Account"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--dj-text-muted)" }}>
          {mode === "login"
            ? `Sign in to your ${BUSINESS_NAME} account`
            : `Join ${BUSINESS_NAME} to book appointments`}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase block mb-1" style={{ color: "var(--dj-text-muted)" }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded px-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid var(--dj-border)", color: "var(--dj-text)" }}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase block mb-1" style={{ color: "var(--dj-text-muted)" }}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded px-3 py-2.5 text-sm outline-none"
                style={{ border: "1px solid var(--dj-border)", color: "var(--dj-text)" }}
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-bold uppercase block mb-1" style={{ color: "var(--dj-text-muted)" }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded px-3 py-2.5 text-sm outline-none"
            style={{ border: "1px solid var(--dj-border)", color: "var(--dj-text)" }}
            required
          />
        </div>

        {mode === "register" && (
          <div>
            <label className="text-xs font-bold uppercase block mb-1" style={{ color: "var(--dj-text-muted)" }}>
              Phone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(517) 555-0100"
              className="w-full rounded px-3 py-2.5 text-sm outline-none"
              style={{ border: "1px solid var(--dj-border)", color: "var(--dj-text)" }}
              required
            />
          </div>
        )}

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
          <p className="text-sm p-3 rounded" style={{ backgroundColor: "rgba(239,68,68,0.08)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}>
            {error}
          </p>
        )}

        {success && (
          <p className="text-sm p-3 rounded" style={{ backgroundColor: "var(--dj-teal-muted)", color: "var(--dj-teal-dark)", border: "1px solid rgba(92,160,166,0.3)" }}>
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded text-sm font-bold text-white transition-colors hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "var(--dj-teal)" }}
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign In"
            : "Create Account"}
        </button>
      </form>

      <div className="text-center mt-5">
        {mode === "login" ? (
          <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>
            Don&apos;t have an account?{" "}
            <button
              onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
              className="font-bold"
              style={{ color: "var(--dj-teal)" }}
            >
              Create one
            </button>
          </p>
        ) : (
          <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>
            Already have an account?{" "}
            <button
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className="font-bold"
              style={{ color: "var(--dj-teal)" }}
            >
              Sign in
            </button>
          </p>
        )}
      </div>

      {mode === "login" && (
        <div
          className="mt-6 p-4 rounded text-xs"
          style={{ backgroundColor: "var(--dj-bg-light)", border: "1px solid var(--dj-border-light)" }}
        >
          <p className="font-bold mb-2" style={{ color: "var(--dj-text)" }}>Demo Accounts:</p>
          <p style={{ color: "var(--dj-text-muted)" }}>
            <strong>Guest:</strong> guest@douglasj.com / Douglas2026!
          </p>
          <p style={{ color: "var(--dj-text-muted)" }}>
            <strong>Admin:</strong> admin@douglasj.com / DJAdmin2026!
          </p>
        </div>
      )}
    </div>
  );
}
