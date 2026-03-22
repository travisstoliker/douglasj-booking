"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Check,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  ArrowLeft,
  Search,
} from "lucide-react";
import { format, addDays } from "date-fns";
import {
  BUSINESS_PHONE,
  CANCELLATION_FEE,
  CANCELLATION_WINDOW_HOURS,
} from "@/lib/constants";

type ServiceItem = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  depositRequired: number | null;
  requiresConsult: boolean;
  providerIds: string[];
  subcategory?: string;
};

type Category = {
  id: string;
  name: string;
  color: string;
  services: ServiceItem[];
};

type Staff = {
  id: string;
  firstName: string;
  lastName: string;
  color: string;
};

type AvailabilitySlot = {
  time: string;
  available: boolean;
};

type ProviderSlots = {
  providerId: string;
  providerName: string;
  slots: AvailabilitySlot[];
};

type Props = {
  categories: Category[];
  staff: Staff[];
};

const STEPS = ["Services", "Provider", "Date & Time", "Your Info", "Confirm"];

const POPULAR_SERVICES = [
  { id: "bw5", name: "Reboot IV", description: "Recover fast — alleviates nausea, headaches and dehydration. Vita...", price: 200 },
  { id: "b1", name: "Barber Haircut", description: "Includes a stress-relieving scalp and shoulder massage, hot towel ritual, shampoo, p...", price: 35 },
  { id: "bw1", name: "Aroma Massage", description: "A relaxing full-body massage with Aveda essential oils to melt away tension...", price: 106 },
];

export function BookingWizard({ categories, staff }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categories[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [openSubcategories, setOpenSubcategories] = useState<string[]>([]);

  // Step 2: Provider
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  // Step 3: Date/Time
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [providerSlots, setProviderSlots] = useState<ProviderSlots[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Step 4: Guest Info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const allServices = categories.flatMap((c) => c.services);

  const totalDuration = selectedServices.reduce((sum, id) => {
    const svc = allServices.find((s) => s.id === id);
    return sum + (svc?.durationMinutes || 0);
  }, 0);

  const totalPrice = selectedServices.reduce((sum, id) => {
    const svc = allServices.find((s) => s.id === id);
    return sum + (svc?.price || 0);
  }, 0);

  const depositAmount = selectedServices.reduce((max, id) => {
    const svc = allServices.find((s) => s.id === id);
    const dep = svc?.depositRequired || 0;
    return dep > max ? dep : max;
  }, 0);

  const availableProviders = staff.filter((s) => {
    if (selectedServices.length === 0) return true;
    return selectedServices.every((svcId) => {
      const service = allServices.find((svc) => svc.id === svcId);
      return service?.providerIds.includes(s.id);
    });
  });

  // Group services by subcategory
  const activeCat = categories.find((c) => c.id === activeCategory);
  const subcategoryGroups = useMemo(() => {
    if (!activeCat) return {};
    const groups: Record<string, ServiceItem[]> = {};
    for (const svc of activeCat.services) {
      const sub = svc.subcategory || "General";
      if (!groups[sub]) groups[sub] = [];
      groups[sub].push(svc);
    }
    return groups;
  }, [activeCat]);

  // Search filter
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();
    return allServices.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }, [searchQuery, allServices]);

  // Fetch available slots
  useEffect(() => {
    if (step !== 3 || !selectedProvider || selectedServices.length === 0) return;

    setSlotsLoading(true);
    setSelectedTime(null);

    const params = new URLSearchParams({
      date: selectedDate,
      serviceIds: selectedServices.join(","),
      providerId: selectedProvider,
    });

    fetch(`/api/public/availability?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setProviderSlots(data.slots || []);
        setSlotsLoading(false);
      })
      .catch(() => {
        setSlotsLoading(false);
      });
  }, [step, selectedProvider, selectedDate, selectedServices]);

  const currentProviderSlots = providerSlots.find(
    (p) => p.providerId === selectedProvider
  );
  const availableTimes =
    currentProviderSlots?.slots.filter((s) => s.available) || [];

  // Generate next 14 days for date picker
  const dateOptions: { date: string; label: string; dayName: string }[] = [];
  for (let i = 0; i < 14; i++) {
    const d = addDays(new Date(), i);
    dateOptions.push({
      date: format(d, "yyyy-MM-dd"),
      label: format(d, "MMM d"),
      dayName: i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(d, "EEE"),
    });
  }

  async function handleSubmit() {
    setLoading(true);
    setError("");

    const startTime = new Date(
      `${selectedDate}T${selectedTime}:00`
    ).toISOString();

    try {
      const res = await fetch("/api/public/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          serviceIds: selectedServices,
          providerId: selectedProvider,
          startTime,
          notes: notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams({
        id: data.appointment.id,
        provider: data.appointment.providerName,
        start: data.appointment.startTime,
        services: data.appointment.services.join(", "),
        total: String(data.appointment.total),
      });
      router.push(`/book/success?${params}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  function toggleSubcategory(name: string) {
    setOpenSubcategories((prev) =>
      prev.includes(name)
        ? prev.filter((s) => s !== name)
        : [...prev, name]
    );
  }

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  return (
    <div className="dj-fade-up">
      {/* ═══ STEP 1: Select Services ═══ */}
      {step === 1 && (
        <div className="space-y-5">
          {/* Location Header */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-wide mb-2"
              style={{ color: "var(--dj-text)" }}
            >
              LOCATION
            </h3>
            <div
              className="flex items-center justify-between p-3 rounded"
              style={{ border: "1px solid var(--dj-border)" }}
            >
              <span className="text-sm font-medium" style={{ color: "var(--dj-text)" }}>
                SALON &amp; MEDSPA OKEMOS
              </span>
              <button
                className="text-sm font-medium"
                style={{ color: "var(--dj-teal)" }}
              >
                Change Location
              </button>
            </div>
          </div>

          {/* Appointment For */}
          <div
            className="p-4 rounded"
            style={{ border: "1px solid var(--dj-border)" }}
          >
            <p
              className="text-sm text-center mb-3"
              style={{ color: "var(--dj-text)" }}
            >
              I would like to book an appointment for
            </p>
            <select
              className="w-full p-2.5 rounded text-sm"
              style={{
                border: "1px solid var(--dj-border)",
                color: "var(--dj-text)",
              }}
            >
              <option>just me</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4 Guests</option>
              <option>5 Guests</option>
              <option>6 Guests</option>
            </select>
          </div>

          {/* Popular Services Carousel */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-wide mb-3"
              style={{ color: "var(--dj-text)" }}
            >
              POPULAR SERVICES
            </h3>
            <div className="dj-scroll-hide flex gap-4 overflow-x-auto pb-2">
              {POPULAR_SERVICES.map((ps) => {
                const isSelected = selectedServices.includes(ps.id);
                return (
                  <div
                    key={ps.name}
                    className="flex-shrink-0 w-[260px] rounded p-4 flex flex-col justify-between"
                    style={{
                      border: isSelected
                        ? "2px solid var(--dj-teal)"
                        : "1px solid var(--dj-border)",
                      backgroundColor: isSelected ? "var(--dj-teal-muted)" : "transparent",
                    }}
                  >
                    <div>
                      <h4
                        className="text-sm font-bold mb-1"
                        style={{ color: "var(--dj-text)" }}
                      >
                        {ps.name}
                      </h4>
                      <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--dj-text-muted)" }}>
                        {ps.description}{" "}
                        <button
                          className="font-medium"
                          style={{ color: "var(--dj-purple)" }}
                        >
                          more
                        </button>
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-base font-bold" style={{ color: "var(--dj-text)" }}>
                        $ {ps.price}
                      </span>
                      <button
                        onClick={() => toggleService(ps.id)}
                        className="px-6 py-1.5 rounded text-sm font-medium transition-colors"
                        style={{
                          border: "1px solid var(--dj-teal)",
                          color: isSelected ? "#ffffff" : "var(--dj-teal)",
                          backgroundColor: isSelected ? "var(--dj-teal)" : "transparent",
                        }}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SELECT A SERVICE heading */}
          <div>
            <h3
              className="text-sm font-bold uppercase tracking-wide mb-3"
              style={{ color: "var(--dj-text)" }}
            >
              SELECT A SERVICE
            </h3>
            <hr style={{ borderColor: "var(--dj-border)" }} />
          </div>

          {/* Provider first prompt */}
          <div
            className="flex items-center justify-between p-4 rounded"
            style={{ border: "1px solid var(--dj-border)" }}
          >
            <span className="text-sm" style={{ color: "var(--dj-text)" }}>
              Want to choose your Service Provider first?
            </span>
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2 rounded text-sm font-medium text-white"
              style={{ backgroundColor: "var(--dj-teal)" }}
            >
              Select Now
            </button>
          </div>

          {/* Search Bar */}
          <div
            className="flex items-center gap-3 p-3 rounded"
            style={{ border: "1px solid var(--dj-border)" }}
          >
            <Search className="h-4 w-4 flex-shrink-0" style={{ color: "var(--dj-text-muted)" }} />
            <input
              type="text"
              placeholder="Search for a Service"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color: "var(--dj-text)" }}
            />
          </div>

          {/* Search Results */}
          {filteredServices && (
            <div className="space-y-1">
              {filteredServices.length === 0 ? (
                <p className="text-sm py-4 text-center" style={{ color: "var(--dj-text-muted)" }}>
                  No services found matching &ldquo;{searchQuery}&rdquo;
                </p>
              ) : (
                filteredServices.map((svc) => (
                  <ServiceRow
                    key={svc.id}
                    service={svc}
                    isSelected={selectedServices.includes(svc.id)}
                    onToggle={() => toggleService(svc.id)}
                  />
                ))
              )}
            </div>
          )}

          {/* Category Grid (only show when not searching) */}
          {!filteredServices && (
            <>
              <div className="grid grid-cols-4 gap-0">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setOpenSubcategories([]);
                      }}
                      className="px-2 py-3 text-xs font-bold uppercase tracking-wide text-center transition-colors"
                      style={{
                        backgroundColor: isActive ? "var(--dj-teal)" : "#9e9e9e",
                        color: "#ffffff",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Subcategory Accordions */}
              {activeCat && (
                <div className="dj-stagger">
                  {Object.entries(subcategoryGroups).map(([subName, services]) => (
                    <div
                      key={subName}
                      style={{ borderBottom: "1px solid var(--dj-border-light)" }}
                    >
                      <button
                        onClick={() => toggleSubcategory(subName)}
                        className="w-full flex items-center gap-2 py-3 px-1 text-left"
                      >
                        <ChevronDown
                          className="h-4 w-4 transition-transform flex-shrink-0"
                          style={{
                            color: "var(--dj-teal)",
                            transform: openSubcategories.includes(subName)
                              ? "rotate(0deg)"
                              : "rotate(-90deg)",
                          }}
                        />
                        <span
                          className="text-sm font-bold"
                          style={{ color: "var(--dj-text)" }}
                        >
                          {subName}
                        </span>
                      </button>

                      {openSubcategories.includes(subName) && (
                        <div className="pb-2 space-y-0.5">
                          {services.map((svc) => (
                            <ServiceRow
                              key={svc.id}
                              service={svc}
                              isSelected={selectedServices.includes(svc.id)}
                              onToggle={() => toggleService(svc.id)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Sticky summary bar */}
          {selectedServices.length > 0 && (
            <div
              className="dj-fade-up sticky bottom-4 rounded-lg p-4 flex items-center justify-between shadow-lg"
              style={{
                backgroundColor: "var(--dj-teal)",
                color: "#ffffff",
              }}
            >
              <div>
                <p className="text-sm font-bold">
                  {selectedServices.length} service
                  {selectedServices.length > 1 ? "s" : ""} selected
                </p>
                <p className="text-xs opacity-90 mt-0.5">
                  {totalDuration} min &middot; ${totalPrice}
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-5 py-2 rounded text-sm font-bold bg-white transition-colors"
                style={{ color: "var(--dj-teal)" }}
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══ STEP 2: Select Provider ═══ */}
      {step === 2 && (
        <div className="dj-fade-up space-y-5">
          <div className="text-center space-y-1">
            <h2
              className="text-xl font-bold"
              style={{ color: "var(--dj-text)" }}
            >
              Choose Your Provider
            </h2>
            <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>
              Select who you&apos;d like to see
            </p>
          </div>

          {availableProviders.length === 0 ? (
            <div
              className="text-center py-10 rounded"
              style={{
                border: "1px solid var(--dj-border)",
                color: "var(--dj-text-muted)",
              }}
            >
              No providers available for the selected services.
            </div>
          ) : (
            <div className="dj-stagger space-y-2">
              {/* No preference */}
              <button
                className="w-full flex items-center gap-4 p-4 rounded transition-colors group text-left hover:bg-gray-50"
                style={{ border: "1px solid var(--dj-border)" }}
                onClick={() => {
                  setSelectedProvider(availableProviders[0].id);
                  setStep(3);
                }}
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: "var(--dj-teal-muted)",
                    color: "var(--dj-teal)",
                  }}
                >
                  ?
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: "var(--dj-text)" }}>
                    No preference
                  </p>
                  <p className="text-xs" style={{ color: "var(--dj-text-muted)" }}>
                    First available provider
                  </p>
                </div>
                <ChevronRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  style={{ color: "var(--dj-text-light)" }}
                />
              </button>

              {availableProviders.map((s) => (
                <button
                  key={s.id}
                  className="w-full flex items-center gap-4 p-4 rounded transition-colors group text-left hover:bg-gray-50"
                  style={{ border: "1px solid var(--dj-border)" }}
                  onClick={() => {
                    setSelectedProvider(s.id);
                    setStep(3);
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.firstName[0]}
                    {s.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: "var(--dj-text)" }}>
                      {s.firstName} {s.lastName}
                    </p>
                  </div>
                  <ChevronRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    style={{ color: "var(--dj-text-light)" }}
                  />
                </button>
              ))}
            </div>
          )}

          <BackButton onClick={() => setStep(1)} />
        </div>
      )}

      {/* ═══ STEP 3: Date & Time ═══ */}
      {step === 3 && (
        <div className="dj-fade-up space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold" style={{ color: "var(--dj-text)" }}>
              Pick Your Time
            </h2>
            <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>
              Select a date and time that works for you
            </p>
          </div>

          {/* Date scroller */}
          <div className="dj-scroll-hide flex gap-2 overflow-x-auto pb-2">
            {dateOptions.map((d) => {
              const isActive = selectedDate === d.date;
              return (
                <button
                  key={d.date}
                  onClick={() => {
                    setSelectedDate(d.date);
                    setSelectedTime(null);
                  }}
                  className="flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded transition-colors"
                  style={{
                    backgroundColor: isActive ? "var(--dj-teal)" : "transparent",
                    border: isActive
                      ? "1px solid var(--dj-teal)"
                      : "1px solid var(--dj-border)",
                    color: isActive ? "#ffffff" : "var(--dj-text)",
                    minWidth: "72px",
                  }}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {d.dayName}
                  </span>
                  <span className="text-sm font-medium mt-0.5">{d.label}</span>
                </button>
              );
            })}
          </div>

          {/* Time slots */}
          {slotsLoading ? (
            <div className="py-10 text-center">
              <div
                className="inline-block w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{
                  borderColor: "var(--dj-teal)",
                  borderTopColor: "transparent",
                }}
              />
              <p className="text-sm mt-3" style={{ color: "var(--dj-text-muted)" }}>
                Finding available times...
              </p>
            </div>
          ) : availableTimes.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableTimes.map((slot) => {
                const isActive = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    onClick={() => setSelectedTime(slot.time)}
                    className="py-2.5 rounded text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: isActive ? "var(--dj-teal)" : "transparent",
                      border: isActive
                        ? "1px solid var(--dj-teal)"
                        : "1px solid var(--dj-border)",
                      color: isActive ? "#ffffff" : "var(--dj-text)",
                    }}
                  >
                    {format(new Date(`2000-01-01T${slot.time}:00`), "h:mm a")}
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              className="py-10 text-center rounded"
              style={{ border: "1px solid var(--dj-border)" }}
            >
              <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>
                No available times on this date.
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--dj-text-light)" }}>
                Try selecting another day.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <BackButton onClick={() => setStep(2)} />
            {selectedTime && (
              <TealButton onClick={() => setStep(4)}>
                Continue
                <ChevronRight className="h-4 w-4" />
              </TealButton>
            )}
          </div>
        </div>
      )}

      {/* ═══ STEP 4: Guest Info ═══ */}
      {step === 4 && (
        <div className="dj-fade-up space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold" style={{ color: "var(--dj-text)" }}>
              Your Information
            </h2>
            <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>
              So we can confirm your appointment
            </p>
          </div>

          <div
            className="rounded p-5 space-y-4"
            style={{ border: "1px solid var(--dj-border)" }}
          >
            <div className="grid grid-cols-2 gap-4">
              <DJInput
                label="First Name"
                value={firstName}
                onChange={setFirstName}
                placeholder="Jane"
                required
              />
              <DJInput
                label="Last Name"
                value={lastName}
                onChange={setLastName}
                placeholder="Doe"
                required
              />
            </div>
            <DJInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="jane@example.com"
              required
            />
            <DJInput
              label="Phone"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="(517) 555-0100"
              required
            />
            <div className="space-y-1.5">
              <label
                className="text-xs font-bold uppercase block"
                style={{ color: "var(--dj-text-muted)" }}
              >
                Notes{" "}
                <span style={{ color: "var(--dj-text-light)" }}>(optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Anything we should know?"
                className="w-full rounded px-3 py-2.5 text-sm outline-none transition-colors resize-none"
                style={{
                  border: "1px solid var(--dj-border)",
                  color: "var(--dj-text)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--dj-teal)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--dj-border)";
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <BackButton onClick={() => setStep(3)} />
            <TealButton
              onClick={() => setStep(5)}
              disabled={!firstName || !lastName || !email || !phone}
            >
              Review Booking
              <ChevronRight className="h-4 w-4" />
            </TealButton>
          </div>
        </div>
      )}

      {/* ═══ STEP 5: Confirm ═══ */}
      {step === 5 && (
        <div className="dj-fade-up space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold" style={{ color: "var(--dj-text)" }}>
              Review &amp; Confirm
            </h2>
            <p className="text-sm" style={{ color: "var(--dj-text-muted)" }}>
              Everything look good?
            </p>
          </div>

          {/* Booking summary */}
          <div
            className="rounded overflow-hidden"
            style={{ border: "1px solid var(--dj-border)" }}
          >
            <SummaryRow
              label="Services"
              value={
                selectedServices
                  .map((id) => allServices.find((s) => s.id === id)?.name)
                  .join(", ")
              }
            />
            <SummaryRow
              label="Provider"
              value={`${staff.find((s) => s.id === selectedProvider)?.firstName} ${staff.find((s) => s.id === selectedProvider)?.lastName}`}
            />
            <SummaryRow
              label="Date"
              value={format(
                new Date(selectedDate + "T12:00:00"),
                "EEEE, MMMM d, yyyy"
              )}
            />
            <SummaryRow
              label="Time"
              value={
                selectedTime
                  ? format(
                      new Date(`2000-01-01T${selectedTime}:00`),
                      "h:mm a"
                    )
                  : ""
              }
            />
            <SummaryRow label="Duration" value={`${totalDuration} min`} />
            <SummaryRow label="Name" value={`${firstName} ${lastName}`} />
            <SummaryRow label="Email" value={email} />
            <SummaryRow label="Phone" value={phone} />
            {notes && <SummaryRow label="Notes" value={notes} />}
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
                ${totalPrice}
              </span>
            </div>
          </div>

          {/* Deposit notice */}
          {depositAmount > 0 && (
            <InfoBanner
              variant="teal"
              text={
                <>
                  A <strong>${depositAmount}</strong> deposit is required.
                  You&apos;ll be contacted to collect payment before your visit is
                  confirmed.
                </>
              }
            />
          )}

          {/* Cancellation policy */}
          <InfoBanner
            variant="gray"
            text={
              <>
                Cancellations must be made at least {CANCELLATION_WINDOW_HOURS}{" "}
                hours in advance. Late cancellations are subject to a $
                {CANCELLATION_FEE} fee.
              </>
            }
          />

          {error && (
            <div
              className="rounded p-3 text-sm"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#dc2626",
              }}
            >
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <BackButton onClick={() => setStep(4)} />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded text-sm font-bold uppercase tracking-wide text-white transition-colors hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"
              style={{ backgroundColor: "var(--dj-teal)" }}
            >
              {loading ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{
                      borderColor: "#ffffff",
                      borderTopColor: "transparent",
                    }}
                  />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────── */

function ServiceRow({
  service,
  isSelected,
  onToggle,
}: {
  service: ServiceItem;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="flex items-start gap-3 px-3 py-3 transition-colors cursor-pointer hover:bg-gray-50"
      style={{
        borderBottom: "1px solid var(--dj-border-light)",
        backgroundColor: isSelected ? "var(--dj-teal-muted)" : "transparent",
        opacity: service.requiresConsult ? 0.5 : 1,
        cursor: service.requiresConsult ? "not-allowed" : "pointer",
      }}
      onClick={() => {
        if (!service.requiresConsult) onToggle();
      }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold" style={{ color: "var(--dj-text)" }}>
          {service.name}
        </p>
        {service.description && (
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--dj-text-muted)" }}>
            {expanded
              ? service.description
              : service.description.slice(0, 80) + (service.description.length > 80 ? "..." : "")}
            {service.description.length > 80 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className="ml-1 font-medium"
                style={{ color: "var(--dj-purple)" }}
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </p>
        )}
        {service.requiresConsult && (
          <span
            className="inline-block text-[10px] font-bold uppercase mt-1 px-2 py-0.5 rounded"
            style={{
              backgroundColor: "var(--dj-teal-muted)",
              color: "var(--dj-teal)",
            }}
          >
            Consultation Required
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-sm font-medium" style={{ color: "var(--dj-text)" }}>
          {service.price > 0
            ? `${service.price > 0 ? "Starting at " : ""}$${service.price}.00`
            : "Free"}
        </span>
        <button
          onClick={onToggle}
          disabled={service.requiresConsult}
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{
            backgroundColor: isSelected ? "var(--dj-teal)" : "transparent",
            border: isSelected
              ? "2px solid var(--dj-teal)"
              : "2px solid var(--dj-border)",
            cursor: service.requiresConsult ? "not-allowed" : "pointer",
          }}
        >
          {isSelected && <Check className="h-3 w-3 text-white" />}
        </button>
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors hover:opacity-80 group"
      style={{ color: "var(--dj-teal)" }}
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
      Back
    </button>
  );
}

function TealButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-5 py-2 rounded text-sm font-bold text-white transition-colors hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none"
      style={{ backgroundColor: "var(--dj-teal)" }}
    >
      {children}
    </button>
  );
}

function DJInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="text-xs font-bold uppercase block"
        style={{ color: "var(--dj-text-muted)" }}
      >
        {label}
        {required && (
          <span className="ml-0.5" style={{ color: "var(--dj-teal)" }}>
            *
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded px-3 py-2.5 text-sm outline-none transition-colors"
        style={{
          border: "1px solid var(--dj-border)",
          color: "var(--dj-text)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--dj-teal)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--dj-border)";
        }}
        required={required}
      />
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

function InfoBanner({
  variant,
  text,
}: {
  variant: "teal" | "gray";
  text: React.ReactNode;
}) {
  const isTeal = variant === "teal";
  return (
    <div
      className="flex gap-3 rounded p-3"
      style={{
        backgroundColor: isTeal ? "var(--dj-teal-muted)" : "var(--dj-bg-light)",
        border: isTeal
          ? "1px solid rgba(92,160,166,0.25)"
          : "1px solid var(--dj-border-light)",
      }}
    >
      <AlertCircle
        className="h-4 w-4 mt-0.5 flex-shrink-0"
        style={{
          color: isTeal ? "var(--dj-teal)" : "var(--dj-text-muted)",
        }}
      />
      <p className="text-xs leading-relaxed" style={{ color: "var(--dj-text-muted)" }}>
        {text}
      </p>
    </div>
  );
}
