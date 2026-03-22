import Link from "next/link";
import Image from "next/image";
import {
  BUSINESS_NAME,
  BUSINESS_LOCATION,
  BUSINESS_ADDRESS,
  BUSINESS_PHONE,
  BUSINESS_EMAIL,
  BUSINESS_WEBSITE,
  LOGO_URL,
  BACKGROUND_IMAGE_URL,
  SERVICE_HOURS,
} from "@/lib/constants";

export const metadata = {
  title: "Book Online | Douglas J Salon + MedSpa",
  description:
    "Book your appointment online at Douglas J Salon + MedSpa in Okemos, MI",
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-lato), 'Lato', sans-serif" }}
    >
      {/* ─── Top Navigation Bar ─── */}
      <header
        className="relative z-20 bg-white border-b"
        style={{ borderColor: "var(--dj-border-light)" }}
      >
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo */}
          <Link href={BUSINESS_WEBSITE} className="flex-shrink-0">
            <img
              src={LOGO_URL}
              alt={BUSINESS_NAME}
              className="h-16 w-auto"
            />
          </Link>

          {/* Nav Items */}
          <nav className="flex items-center gap-6 sm:gap-10">
            <NavItem href="/book" icon="services" label="SERVICES" active />
            <NavItem href="/book/giftcards" icon="giftcards" label="GIFT CARDS" />
            <NavItem href="/book/memberships" icon="memberships" label="MEMBERSHIPS" />
            <NavItem href="/book/packages" icon="packages" label="PACKAGES" />
            <NavItem href="/book/signin" icon="signin" label="SIGN IN" />
          </nav>
        </div>
      </header>

      {/* ─── Background Image + Content Area ─── */}
      <div
        className="flex-1 relative"
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGE_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Main two-column layout */}
        <div className="max-w-[1200px] mx-auto px-4 py-6 flex gap-6 items-start">
          {/* ─── Left Column: Main Booking Content ─── */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded shadow-sm p-6">
              {children}
            </div>
          </main>

          {/* ─── Right Column: Sidebar ─── */}
          <aside
            className="hidden lg:block w-[340px] flex-shrink-0 rounded shadow-sm p-6"
            style={{ backgroundColor: "var(--dj-bg-gray)" }}
          >
            {/* Business Name */}
            <div className="mb-6">
              <h2
                className="text-xl font-bold uppercase tracking-wide"
                style={{ color: "var(--dj-text)" }}
              >
                {BUSINESS_NAME}
              </h2>
              <p
                className="text-sm mt-0.5"
                style={{ color: "var(--dj-text)" }}
              >
                {BUSINESS_LOCATION}
              </p>
            </div>

            {/* Location */}
            <div className="mb-5">
              <p className="text-sm font-bold uppercase" style={{ color: "var(--dj-text)" }}>
                LOCATION:
              </p>
              <p className="text-sm mt-1 ml-2" style={{ color: "var(--dj-text)" }}>
                4663 Ardmore Ave
              </p>
              <p className="text-sm ml-2" style={{ color: "var(--dj-text)" }}>
                Okemos, Michigan 48864
              </p>
            </div>

            {/* Guest Services */}
            <div className="mb-5">
              <p className="text-sm" style={{ color: "var(--dj-text)" }}>
                <span className="font-bold">GUEST SERVICES:</span>{" "}
                <a
                  href={`tel:${BUSINESS_PHONE}`}
                  style={{ color: "var(--dj-text)" }}
                  className="hover:underline"
                >
                  {BUSINESS_PHONE}
                </a>
              </p>
            </div>

            {/* Email */}
            <div className="mb-5">
              <p className="text-sm" style={{ color: "var(--dj-text)" }}>
                <span className="font-bold">EMAIL:</span>{" "}
                <a
                  href={`mailto:${BUSINESS_EMAIL}`}
                  style={{ color: "var(--dj-text)" }}
                  className="hover:underline"
                >
                  {BUSINESS_EMAIL}
                </a>
              </p>
            </div>

            {/* Service Hours */}
            <div className="mb-6">
              <p className="text-sm font-bold uppercase mb-2" style={{ color: "var(--dj-text)" }}>
                SERVICE HOURS:
              </p>
              <div className="space-y-0.5">
                {SERVICE_HOURS.map((h) => (
                  <div
                    key={h.day}
                    className="flex justify-between text-sm"
                    style={{ color: "var(--dj-text)" }}
                  >
                    <span>{h.day}:</span>
                    <span>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download App */}
            <div className="mb-4">
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: "var(--dj-text)" }}
              >
                Download the App!
              </h3>
              <div className="flex gap-2">
                <div
                  className="h-10 px-3 rounded flex items-center gap-1.5 text-white text-xs font-medium"
                  style={{ backgroundColor: "#333" }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <div className="text-[8px] leading-none opacity-80">Available on the</div>
                    <div className="text-[11px] font-semibold leading-tight">App Store</div>
                  </div>
                </div>
                <div
                  className="h-10 px-3 rounded flex items-center gap-1.5 text-white text-xs font-medium"
                  style={{ backgroundColor: "#333" }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.18 23.27L14.45 12 3.18.73c-.35.2-.58.57-.58 1.01v20.52c0 .44.23.81.58 1.01zm1.45 1.09l12.56-7.03-2.75-2.75L4.63 24.36zm14.14-8.61L5.73 23.7l9.05-9.05 3.99 2.1zm0-7.5L5.73.3l9.05 9.05 3.99-2.1z"/>
                  </svg>
                  <div>
                    <div className="text-[8px] leading-none opacity-80">GET IT ON</div>
                    <div className="text-[11px] font-semibold leading-tight">Google Play</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instagram */}
            <a
              href="#"
              className="text-sm hover:underline"
              style={{ color: "var(--dj-teal)" }}
            >
              Follow us on Instagram
            </a>
          </aside>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 bg-[#2a2a2a] text-white">
        <div className="max-w-[1200px] mx-auto px-4">
          {/* Expandable sections */}
          <div className="grid grid-cols-3 divide-x divide-white/10">
            <FooterSection title="Refund" />
            <FooterSection title="Cancellation" />
            <FooterSection title="About Us" />
          </div>

          {/* Social icons */}
          <div className="flex items-center justify-center gap-8 py-6 border-t border-white/10">
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="#" className="text-white/70 hover:text-white transition-colors">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Nav Item Component ─── */
function NavItem({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  const iconMap: Record<string, React.ReactNode> = {
    services: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    ),
    giftcards: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5z" />
      </svg>
    ),
    memberships: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0z" />
      </svg>
    ),
    packages: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    signin: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  };

  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 text-center group"
      style={{ color: active ? "var(--dj-teal)" : "var(--dj-text)" }}
    >
      <span className="transition-colors group-hover:text-[var(--dj-teal)]">
        {iconMap[icon]}
      </span>
      <span className="text-[11px] font-bold tracking-wide transition-colors group-hover:text-[var(--dj-teal)]">
        {label}
      </span>
      {/* Active indicator line */}
      {active && (
        <div
          className="w-0.5 h-3 -mb-1 rounded-full"
          style={{ backgroundColor: "var(--dj-teal)" }}
        />
      )}
    </Link>
  );
}

/* ─── Footer Section Component ─── */
function FooterSection({ title }: { title: string }) {
  return (
    <details className="group">
      <summary className="flex items-center gap-2 px-6 py-4 cursor-pointer list-none text-sm font-medium text-white/80 hover:text-white transition-colors">
        <svg
          className="h-3 w-3 transition-transform group-open:rotate-90"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
        {title}
      </summary>
      <div className="px-6 pb-4 text-sm text-white/60">
        <p>Contact us for more information about our {title.toLowerCase()} policy.</p>
      </div>
    </details>
  );
}
