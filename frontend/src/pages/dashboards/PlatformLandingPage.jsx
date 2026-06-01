import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ─── Google Fonts injected once ─────────────────────────────────────────── */

/* ─── Scroll reveal hook ─────────────────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Animated counter ───────────────────────────────────────────────────── */
function Counter({ end, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(ease * end));
            if (p < 1) requestAnimationFrame(tick);
            else setCount(end);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Accordion item ─────────────────────────────────────────────────────── */
function AccItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="glass rounded-2xl overflow-hidden animate-border"
      style={{ marginBottom: "12px" }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "16px",
        }}
      >
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
            fontSize: "1rem",
            color: "#e8eaf0",
          }}
        >
          {q}
        </span>
        <span
          className="material-symbols-outlined"
          style={{
            color: "#60a5fa",
            flexShrink: 0,
            transition: "transform 0.3s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          expand_more
        </span>
      </button>
      <div className={`acc-body ${open ? "open" : ""}`}>
        <p
          style={{
            padding: "0 24px 20px",
            color: "#94a3b8",
            lineHeight: 1.7,
            fontSize: "0.95rem",
          }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

/* ─── Dashboard Mockup ───────────────────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div
      style={{
        background: "#0d1425",
        borderRadius: "16px",
        border: "1px solid rgba(59,130,246,0.2)",
        overflow: "hidden",
        boxShadow:
          "0 40px 120px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.1)",
      }}
    >
      {/* title bar */}
      <div
        style={{
          background: "#0a0f1e",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ef4444",
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#f59e0b",
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#22c55e",
          }}
        />
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "0.7rem",
            color: "#475569",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          EventOps — Operations Dashboard
        </span>
      </div>
      {/* content */}
      <div style={{ padding: "16px", display: "flex", gap: "12px" }}>
        {/* sidebar */}
        <div
          style={{
            width: "44px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "center",
            paddingTop: "4px",
          }}
        >
          {[
            "dashboard",
            "calendar_today",
            "group",
            "meeting_room",
            "analytics",
            "settings",
          ].map((ic, i) => (
            <div
              key={i}
              style={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background:
                  i === 0 ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "15px",
                  color: i === 0 ? "#60a5fa" : "#475569",
                }}
              >
                {ic}
              </span>
            </div>
          ))}
        </div>
        {/* main */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* kpi row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
            }}
          >
            {[
              {
                label: "Guests",
                val: "1,284",
                color: "#3b82f6",
                icon: "group",
              },
              {
                label: "Checked In",
                val: "847",
                color: "#22c55e",
                icon: "how_to_reg",
              },
              {
                label: "Rooms",
                val: "96%",
                color: "#a78bfa",
                icon: "meeting_room",
              },
              {
                label: "Services",
                val: "12",
                color: "#f59e0b",
                icon: "room_service",
              },
            ].map((k, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px",
                  padding: "10px 10px 8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.6rem",
                      color: "#475569",
                      fontFamily: "'DM Sans',sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {k.label}
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "13px", color: k.color }}
                  >
                    {k.icon}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 800,
                    fontFamily: "'Syne',sans-serif",
                    color: k.color,
                  }}
                >
                  {k.val}
                </span>
              </div>
            ))}
          </div>
          {/* chart placeholder */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "10px",
              padding: "12px",
              height: "80px",
            }}
          >
            <div
              style={{
                fontSize: "0.65rem",
                color: "#475569",
                fontFamily: "'DM Sans',sans-serif",
                marginBottom: "8px",
              }}
            >
              Check-in Activity
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "4px",
                height: "44px",
              }}
            >
              {[40, 65, 45, 80, 60, 90, 75, 85, 70, 95, 80, 100].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    borderRadius: "3px 3px 0 0",
                    background:
                      i === 11
                        ? "#3b82f6"
                        : `rgba(59,130,246,${0.15 + i * 0.05})`,
                    transition: "height 0.5s ease",
                  }}
                />
              ))}
            </div>
          </div>
          {/* guest list rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              {
                name: "Alexandra Chen",
                room: "Suite 401",
                status: "Checked In",
                vip: true,
              },
              {
                name: "Marcus Williams",
                room: "Room 215",
                status: "Arriving",
                vip: false,
              },
              {
                name: "Priya Patel",
                room: "Suite 302",
                status: "Checked In",
                vip: true,
              },
            ].map((g, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                  padding: "7px 10px",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "6px",
                    background: `rgba(59,130,246,0.15)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      color: "#60a5fa",
                      fontFamily: "'Syne',sans-serif",
                    }}
                  >
                    {g.name[0]}
                  </span>
                </div>
                <span
                  style={{
                    flex: 1,
                    fontSize: "0.68rem",
                    color: "#cbd5e1",
                    fontFamily: "'DM Sans',sans-serif",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {g.name}
                </span>
                {g.vip && (
                  <span
                    style={{
                      fontSize: "0.55rem",
                      background: "rgba(245,158,11,0.15)",
                      color: "#f59e0b",
                      border: "1px solid rgba(245,158,11,0.25)",
                      borderRadius: "4px",
                      padding: "1px 5px",
                      fontWeight: 700,
                    }}
                  >
                    VIP
                  </span>
                )}
                <span style={{ fontSize: "0.6rem", color: "#475569" }}>
                  {g.room}
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    padding: "2px 7px",
                    borderRadius: "99px",
                    background:
                      g.status === "Checked In"
                        ? "rgba(34,197,94,0.12)"
                        : "rgba(59,130,246,0.12)",
                    color: g.status === "Checked In" ? "#22c55e" : "#60a5fa",
                    border: `1px solid ${g.status === "Checked In" ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)"}`,
                  }}
                >
                  {g.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════════════════════ */
export default function PlatformLandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Section refs ── */
  const heroRef = useReveal();
  const statsRef = useReveal();
  const featRef = useReveal();
  const howRef = useReveal();
  const useCaseRef = useReveal();
  const testiRef = useReveal();
  const priceRef = useReveal();
  const faqRef = useReveal();
  const ctaRef = useReveal();

  const features = [
    {
      icon: "group",
      title: "Guest Management",
      desc: "Centralised attendee database with real-time profiles, VIP tagging, group segmentation, special requests, and instant search across all events.",
      color: "#3b82f6",
    },
    {
      icon: "meeting_room",
      title: "Smart Room Assignment",
      desc: "Automated allocation engine that honours preferences, capacity limits, and proximity rules. Manual overrides with drag-and-drop room grids.",
      color: "#8b5cf6",
    },
    {
      icon: "how_to_reg",
      title: "Check-in Operations",
      desc: "QR code and mobile-ready check-in desk. Real-time arrival tracking with hourly heatmaps, VIP alerts, and instant badge printing support.",
      color: "#22c55e",
    },
    {
      icon: "room_service",
      title: "Service Requests",
      desc: "Instant task routing for housekeeping, F&B, valet, and maintenance. Priority queuing with SLA timers and floor-staff mobile notifications.",
      color: "#f59e0b",
    },
    {
      icon: "local_shipping",
      title: "Transport Coordination",
      desc: "End-to-end fleet management — schedule pickups, assign drivers, track vehicles live, and send arrival alerts directly to guests.",
      color: "#ec4899",
    },
    {
      icon: "badge",
      title: "Team Management",
      desc: "Assign roles, track active staff across event zones, manage shifts, and get a live on-duty count at any point during the event.",
      color: "#14b8a6",
    },
    {
      icon: "schedule",
      title: "Operational Schedule",
      desc: "Multi-workstream timeline view for Main Sessions, Catering, Transport, AV, and Staffing. Gantt-style blocks with conflict detection.",
      color: "#f97316",
    },
    {
      icon: "analytics",
      title: "Analytics & Reports",
      desc: "Per-event deep-dive plus cross-event organisation analytics. Export guest lists, service logs, and transport CSVs in one click.",
      color: "#a78bfa",
    },
  ];

  const steps = [
    {
      n: "01",
      icon: "add_circle",
      title: "Create Your Event",
      desc: "Set up the event in minutes — name, venue, dates, and privacy settings. Import guest lists via CSV or add guests manually.",
    },
    {
      n: "02",
      icon: "tune",
      title: "Configure Operations",
      desc: "Set up rooms, assign staff roles, schedule transport routes, and configure service request workflows for your event type.",
    },
    {
      n: "03",
      icon: "play_circle",
      title: "Go Live & Monitor",
      desc: "Run the event from your operations dashboard. Every check-in, service request, and transport update flows in real time.",
    },
  ];

  const useCases = [
    {
      icon: "corporate_fare",
      label: "Corporate Summits",
      desc: "Multi-day conferences with hundreds of VIP delegates, breakout rooms, and complex transport logistics.",
    },
    {
      icon: "celebration",
      label: "Luxury Weddings",
      desc: "High-touch guest experience management, seating, dietary requirements, and same-day service orchestration.",
    },
    {
      icon: "stadium",
      label: "Sports & Entertainment",
      desc: "Large-scale event check-in at scale with QR scanning, suite management, and F&B coordination.",
    },
    {
      icon: "groups_2",
      label: "Government & Diplomatic",
      desc: "Security-first guest handling, restricted room access, protocol-aware VIP management.",
    },
    {
      icon: "medical_services",
      label: "Healthcare Conferences",
      desc: "Delegate registration, accreditation tracking, and multi-session check-in across parallel tracks.",
    },
    {
      icon: "apartment",
      label: "Hotel & Resort Events",
      desc: "Deep integration with room inventory, housekeeping workflows, and multi-day stay management.",
    },
  ];

  const testimonials = [
    {
      quote:
        "EventOps cut our check-in desk queue from 45 minutes to under 4 minutes at a 1,200-delegate summit. The VIP alert system alone was worth every rupee.",
      name: "Rohan Mehta",
      title: "Director of Operations, Ascent Events",
      avatar: "RM",
      stars: 5,
    },
    {
      quote:
        "We ran 14 parallel workstreams at our annual conference. The schedule timeline kept every department synced without a single WhatsApp group needed.",
      name: "Sarah Okonkwo",
      title: "Senior Event Manager, PrismConf",
      avatar: "SO",
      stars: 5,
    },
    {
      quote:
        "The transport coordination module replaced our entire fleet spreadsheet. Drivers get push notifications, guests get real-time ETAs. Game changer.",
      name: "Arjun Kapoor",
      title: "Head of Logistics, Gala Hospitality Group",
      avatar: "AK",
      stars: 5,
    },
  ];

  const plans = [
    {
      name: "Starter",
      price: "₹4,999",
      period: "/event",
      desc: "For teams running occasional high-value events.",
      features: [
        "Up to 300 guests per event",
        "Guest management & check-in",
        "Room assignment (up to 50 rooms)",
        "Basic service requests",
        "CSV export",
        "Email support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Operations",
      price: "₹14,999",
      period: "/event",
      desc: "For professional teams managing complex operations.",
      features: [
        "Up to 2,000 guests per event",
        "Full transport coordination",
        "Advanced schedule timeline",
        "Team management & roles",
        "Real-time analytics dashboard",
        "Priority support + onboarding",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "pricing",
      desc: "For organisations running events at scale.",
      features: [
        "Unlimited guests & events",
        "Multi-event organisation analytics",
        "Custom integrations & API access",
        "Dedicated account manager",
        "SLA-backed uptime guarantee",
        "White-label options available",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "How quickly can we get set up for an event?",
      a: "Most teams go live within 30 minutes. You create the event, import your guest list CSV, set up rooms, and you're operational. We also offer a guided onboarding call for Operations and Enterprise customers.",
    },
    {
      q: "Does EventOps work for events outside India?",
      a: "Yes. The platform supports multiple timezones, currencies, and languages. Enterprise customers can request localisation for specific regions.",
    },
    {
      q: "Can guests check in themselves without staff assistance?",
      a: "Yes. You can enable Self Check-in in event settings. Guests receive a QR code and can scan at kiosks or on a staff device without any manual intervention.",
    },
    {
      q: "Is our guest data secure?",
      a: "All data is encrypted in transit (TLS 1.3) and at rest. Access is JWT-authenticated with per-event ownership isolation — no user can access another organisation's data.",
    },
    {
      q: "Can I export data after the event?",
      a: "Absolutely. You can export the full guest list, service request log, and transport log as CSV files directly from the Analytics & Reports section.",
    },
    {
      q: "What happens to my data after an event ends?",
      a: "Data is retained indefinitely until you archive or permanently delete the event. Archived events are hidden from operations views but all data is preserved for compliance and analytics.",
    },
  ];

  const stats = [
    { val: 500, suffix: "+", label: "Operations Teams" },
    { val: 1200000, suffix: "+", label: "Guests Managed" },
    { val: 98, suffix: "%", label: "On-time Check-in Rate" },
    { val: 4, suffix: "min", label: "Average Queue Time" },
  ];

  /* ── Logos ── */
  const logos = [
    "Ascent Events",
    "PrismConf",
    "Gala Group",
    "RoyalHostel",
    "SummitCo",
    "BlueSky Events",
    "NovaCorp",
    "EliteVenues",
  ];

  return (
    <div className="lp-root">
      {/* ══════════════════════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════════════════════ */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition: "all 0.3s ease",
          background: scrolled ? "rgba(5,9,20,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg,#2463eb,#7c3aed)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(36,99,235,0.4)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "18px", color: "#fff" }}
              >
                event_seat
              </span>
            </div>
            <span
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: "1.2rem",
                color: "#e8eaf0",
                letterSpacing: "-0.02em",
              }}
            >
              EventOps
            </span>
          </div>

          {/* Desktop nav */}
          <nav
            style={{ display: "flex", alignItems: "center", gap: "32px" }}
            className="hidden-mobile"
          >
            {["Features", "How It Works", "Use Cases", "FAQ"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.9rem",
                    color: "#94a3b8",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#e8eaf0")}
                  onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
                >
                  {item}
                </a>
              ),
            )}
          </nav>

          {/* CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                className="btn-outline"
                style={{
                  padding: "8px 18px",
                  borderRadius: "10px",
                  color: "#cbd5e1",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  fontFamily: "'DM Sans',sans-serif",
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </Link>
            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button
                className="btn-primary btn-glow"
                style={{
                  padding: "8px 20px",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  fontFamily: "'DM Sans',sans-serif",
                  cursor: "pointer",
                }}
              >
                Get Started Free
              </button>
            </Link>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              <button
                className="bg-[#eab308] btn-glow"
                style={{
                  padding: "8px 20px",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  fontFamily: "'DM Sans',sans-serif",
                  cursor: "pointer",
                }}
              >
              Dashboard
              </button>
            </Link>
            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "none",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#e8eaf0",
              }}
              className="hamburger"
            >
              <span className="material-symbols-outlined">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`mobile-nav ${mobileOpen ? "open" : ""}`}
          style={{
            background: "rgba(5,9,20,0.98)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: mobileOpen ? "16px 24px 24px" : "0 24px",
          }}
        >
          {["Features", "How It Works", "Use Cases", "FAQ"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  color: "#94a3b8",
                  textDecoration: "none",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.95rem",
                }}
              >
                {item}
              </a>
            ),
          )}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <Link to="/login" style={{ flex: 1, textDecoration: "none" }}>
              <button
                className="btn-outline"
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: "10px",
                  color: "#cbd5e1",
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Sign In
              </button>
            </Link>
            <Link to="/signup" style={{ flex: 1, textDecoration: "none" }}>
              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "11px",
                  borderRadius: "10px",
                  color: "#fff",
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </header>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="hero"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "88px",
          overflow: "hidden",
        }}
      >
        {/* Backgrounds */}
        <div
          className="blob-hero"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />
        <div
          className="grid-bg"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.6,
          }}
        />
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            right: "8%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            left: "5%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 24px 100px",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "60px",
              alignItems: "center",
            }}
          >
            {/* Left: copy */}
            <div ref={heroRef} className="reveal" style={{ maxWidth: "580px" }}>
              {/* Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(59,130,246,0.1)",
                  border: "1px solid rgba(59,130,246,0.25)",
                  borderRadius: "999px",
                  padding: "6px 14px 6px 8px",
                  marginBottom: "28px",
                }}
              >
                <span
                  style={{
                    background: "#2463eb",
                    borderRadius: "50%",
                    width: 20,
                    height: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "11px", color: "#fff" }}
                  >
                    bolt
                  </span>
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#60a5fa",
                    letterSpacing: "0.03em",
                  }}
                >
                  The #1 Hospitality Operations Platform
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-display hero-title"
                style={{
                  fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: "-0.03em",
                  color: "#f1f5f9",
                  marginBottom: "24px",
                }}
              >
                Run Every Event
                <br />
                <span className="grad-text">Like a Command</span>
                <br />
                Centre
              </h1>

              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "1.1rem",
                  color: "#94a3b8",
                  lineHeight: 1.75,
                  marginBottom: "36px",
                  fontWeight: 300,
                }}
              >
                EventOps centralises guest management, room assignments, service
                requests, transport coordination, and live analytics into one
                secure operations platform — built for teams that can't afford a
                single missed detail.
              </p>

              {/* CTAs */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "44px",
                }}
              >
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button
                    className="btn-primary btn-glow"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "13px 28px",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      fontFamily: "'DM Sans',sans-serif",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      rocket_launch
                    </span>
                    Start for Free
                  </button>
                </Link>
                <button
                  className="btn-outline"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "13px 24px",
                    borderRadius: "12px",
                    color: "#cbd5e1",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    fontFamily: "'DM Sans',sans-serif",
                    cursor: "pointer",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px", color: "#60a5fa" }}
                  >
                    play_circle
                  </span>
                  Watch Demo
                </button>
              </div>

              {/* Trust signals */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex" }}>
                  {["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: c,
                        border: "2px solid #050914",
                        marginLeft: i > 0 ? "-8px" : 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          color: "#fff",
                          fontFamily: "'Syne',sans-serif",
                        }}
                      >
                        {["R", "S", "P", "A"][i]}
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <div
                    style={{ display: "flex", gap: "2px", marginBottom: "2px" }}
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined"
                        style={{ fontSize: "13px", color: "#f59e0b" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      color: "#64748b",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Trusted by 500+ operations teams
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#22c55e",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "16px" }}
                  >
                    verified
                  </span>
                  <span
                    style={{
                      fontSize: "0.78rem",
                      fontFamily: "'DM Sans',sans-serif",
                      color: "#64748b",
                    }}
                  >
                    No credit card required
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Dashboard mockup */}
            <div className="animate-float" style={{ position: "relative" }}>
              <DashboardMockup />
              {/* Floating stat badges */}
              <div
                className="glass"
                style={{
                  position: "absolute",
                  top: "-16px",
                  right: "-20px",
                  borderRadius: "12px",
                  padding: "10px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22c55e",
                    animation: "pulse-ring 2s infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.78rem",
                    color: "#e8eaf0",
                    fontWeight: 600,
                  }}
                >
                  847 guests checked in
                </span>
              </div>
              <div
                className="glass"
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "-24px",
                  borderRadius: "12px",
                  padding: "10px 14px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    color: "#f59e0b",
                    lineHeight: 1,
                  }}
                >
                  96%
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.7rem",
                    color: "#64748b",
                    marginTop: "2px",
                  }}
                >
                  Room Occupancy
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "120px",
            background: "linear-gradient(transparent, #050914)",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          LOGO TICKER
      ══════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          padding: "48px 0",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            textAlign: "center",
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.78rem",
            color: "#475569",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: "28px",
          }}
        >
          Trusted by event teams at
        </p>
        <div style={{ display: "flex", overflow: "hidden" }}>
          <div
            className="ticker-inner"
            style={{ display: "flex", gap: "60px", whiteSpace: "nowrap" }}
          >
            {[...logos, ...logos].map((l, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#334155",
                  letterSpacing: "0.02em",
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STATS
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="stats"
        style={{ padding: "100px 24px", position: "relative" }}
      >
        <div
          className="blob-1"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}
        >
          <div
            ref={statsRef}
            className="reveal"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "2px",
            }}
          >
            {stats.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: "48px 32px",
                  textAlign: "center",
                  borderRight:
                    i < stats.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                }}
              >
                <div className="stat-num grad-text">
                  <Counter end={s.val} suffix={s.suffix} />
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.9rem",
                    color: "#64748b",
                    marginTop: "8px",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
        className="hr-glow"
        style={{ maxWidth: "1200px", margin: "0 auto 0" }}
      />

      {/* ══════════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            ref={featRef}
            className="reveal"
            style={{ textAlign: "center", marginBottom: "72px" }}
          >
            <span
              className="tag"
              style={{
                background: "rgba(59,130,246,0.1)",
                color: "#60a5fa",
                border: "1px solid rgba(59,130,246,0.2)",
                marginBottom: "20px",
                display: "inline-block",
              }}
            >
              Platform Features
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#f1f5f9",
                marginBottom: "20px",
                lineHeight: 1.15,
              }}
            >
              Everything operations teams
              <br />
              need — nothing they don't
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "1.05rem",
                color: "#64748b",
                maxWidth: "560px",
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Eight tightly integrated modules that cover the full lifecycle of
              event hospitality operations.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "16px",
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="glass feat-card reveal"
                ref={useReveal()}
                style={{
                  borderRadius: "16px",
                  padding: "28px 24px",
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: `${f.color}18`,
                    border: `1px solid ${f.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "18px",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "22px", color: f.color }}
                  >
                    {f.icon}
                  </span>
                </div>
                <h3
                  className="font-display"
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "#e8eaf0",
                    marginBottom: "10px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.88rem",
                    color: "#64748b",
                    lineHeight: 1.65,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="how-it-works"
        style={{ padding: "120px 24px", position: "relative" }}
      >
        <div
          className="blob-2"
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        />
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}
        >
          <div
            ref={howRef}
            className="reveal"
            style={{ textAlign: "center", marginBottom: "72px" }}
          >
            <span
              className="tag"
              style={{
                background: "rgba(139,92,246,0.1)",
                color: "#a78bfa",
                border: "1px solid rgba(139,92,246,0.2)",
                marginBottom: "20px",
                display: "inline-block",
              }}
            >
              How It Works
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#f1f5f9",
                lineHeight: 1.15,
              }}
            >
              Up and running in
              <br />
              <span className="grad-gold">under 30 minutes</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
              position: "relative",
            }}
          >
            {steps.map((s, i) => (
              <div
                key={i}
                className="reveal"
                ref={useReveal()}
                style={{
                  position: "relative",
                  textAlign: "center",
                  padding: "40px 28px",
                }}
              >
                {i < steps.length - 1 && <div className="step-line" />}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))",
                    border: "1px solid rgba(59,130,246,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "24px", color: "#60a5fa" }}
                  >
                    {s.icon}
                  </span>
                </div>
                <div
                  className="font-display"
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    color: "#2463eb",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  {s.n}
                </div>
                <h3
                  className="font-display"
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "#e8eaf0",
                    marginBottom: "12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.9rem",
                    color: "#64748b",
                    lineHeight: 1.65,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          USE CASES
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="use-cases"
        style={{
          padding: "120px 24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            ref={useCaseRef}
            className="reveal"
            style={{ textAlign: "center", marginBottom: "72px" }}
          >
            <span
              className="tag"
              style={{
                background: "rgba(20,184,166,0.1)",
                color: "#2dd4bf",
                border: "1px solid rgba(20,184,166,0.2)",
                marginBottom: "20px",
                display: "inline-block",
              }}
            >
              Use Cases
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#f1f5f9",
                lineHeight: 1.15,
              }}
            >
              Built for every event type,
              <br />
              every scale
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
            }}
          >
            {useCases.map((u, i) => (
              <div
                key={i}
                className="glass feat-card reveal"
                ref={useReveal()}
                style={{
                  borderRadius: "14px",
                  padding: "24px",
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                    background: "rgba(20,184,166,0.1)",
                    border: "1px solid rgba(20,184,166,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px", color: "#2dd4bf" }}
                  >
                    {u.icon}
                  </span>
                </div>
                <div>
                  <h3
                    className="font-display"
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#e8eaf0",
                      marginBottom: "6px",
                    }}
                  >
                    {u.label}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.85rem",
                      color: "#64748b",
                      lineHeight: 1.6,
                    }}
                  >
                    {u.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="testimonials"
        style={{ padding: "120px 24px", position: "relative" }}
      >
        <div
          className="blob-1"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.7,
          }}
        />
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}
        >
          <div
            ref={testiRef}
            className="reveal"
            style={{ textAlign: "center", marginBottom: "72px" }}
          >
            <span
              className="tag"
              style={{
                background: "rgba(245,158,11,0.1)",
                color: "#fbbf24",
                border: "1px solid rgba(245,158,11,0.2)",
                marginBottom: "20px",
                display: "inline-block",
              }}
            >
              Testimonials
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#f1f5f9",
                lineHeight: 1.15,
              }}
            >
              What operations directors say
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="glass testi-card reveal"
                ref={useReveal()}
                style={{ borderRadius: "16px", padding: "32px 28px" }}
              >
                {/* Stars */}
                <div
                  style={{ display: "flex", gap: "3px", marginBottom: "20px" }}
                >
                  {[0, 1, 2, 3, 4].map((s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined"
                      style={{ fontSize: "16px", color: "#f59e0b" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                {/* Quote */}
                <p
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.95rem",
                    color: "#cbd5e1",
                    lineHeight: 1.75,
                    marginBottom: "28px",
                    fontStyle: "italic",
                  }}
                >
                  "{t.quote}"
                </p>
                {/* Author */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#2463eb,#7c3aed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        color: "#fff",
                      }}
                    >
                      {t.avatar}
                    </span>
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: "#e8eaf0",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.78rem",
                        color: "#475569",
                      }}
                    >
                      {t.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════════════════════ */}
      {/* <section
        id="pricing"
        style={{
          padding: "120px 24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div
            ref={priceRef}
            className="reveal"
            style={{ textAlign: "center", marginBottom: "72px" }}
          >
            <span
              className="tag"
              style={{
                background: "rgba(59,130,246,0.1)",
                color: "#60a5fa",
                border: "1px solid rgba(59,130,246,0.2)",
                marginBottom: "20px",
                display: "inline-block",
              }}
            >
              Pricing
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#f1f5f9",
                marginBottom: "16px",
                lineHeight: 1.15,
              }}
            >
              Pay per event, not per month
            </h2>
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "1rem",
                color: "#64748b",
                maxWidth: "480px",
                margin: "0 auto",
              }}
            >
              Only pay when you run events. No monthly subscriptions, no seat
              fees, no surprises.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              alignItems: "center",
            }}
          >
            {plans.map((p, i) => (
              <div
                key={i}
                className={
                  p.popular
                    ? "pricing-popular reveal"
                    : "glass reveal feat-card"
                }
                ref={useReveal()}
                style={{
                  borderRadius: "20px",
                  padding: "36px 32px",
                  position: "relative",
                }}
              >
                {p.popular && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-14px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg,#2463eb,#7c3aed)",
                      borderRadius: "999px",
                      padding: "5px 18px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#fff",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                <div style={{ marginBottom: "28px" }}>
                  <h3
                    className="font-display"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "#e8eaf0",
                      marginBottom: "6px",
                    }}
                  >
                    {p.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.85rem",
                      color: "#64748b",
                      marginBottom: "20px",
                    }}
                  >
                    {p.desc}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "4px",
                    }}
                  >
                    <span
                      className="font-display"
                      style={{
                        fontSize: "2.4rem",
                        fontWeight: 800,
                        color: p.popular ? "#60a5fa" : "#e8eaf0",
                        lineHeight: 1,
                      }}
                    >
                      {p.price}
                    </span>
                    <span
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.85rem",
                        color: "#64748b",
                      }}
                    >
                      {p.period}
                    </span>
                  </div>
                </div>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 32px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {p.features.map((f, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                      }}
                    >
                      <div className="check-icon" style={{ marginTop: "2px" }}>
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "13px", color: "#60a5fa" }}
                        >
                          check
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: "0.88rem",
                          color: "#94a3b8",
                          lineHeight: 1.5,
                        }}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/signup"
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <button
                    className={
                      p.popular ? "btn-primary btn-glow" : "btn-outline"
                    }
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      fontFamily: "'DM Sans',sans-serif",
                      cursor: "pointer",
                    }}
                  >
                    {p.cta}
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ══════════════════════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════════════════════ */}
      <section
        id="faq"
        style={{
          padding: "120px 24px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <div
            ref={faqRef}
            className="reveal"
            style={{ textAlign: "center", marginBottom: "64px" }}
          >
            <span
              className="tag"
              style={{
                background: "rgba(139,92,246,0.1)",
                color: "#a78bfa",
                border: "1px solid rgba(139,92,246,0.2)",
                marginBottom: "20px",
                display: "inline-block",
              }}
            >
              FAQ
            </span>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "#f1f5f9",
                lineHeight: 1.15,
              }}
            >
              Common questions, honest answers
            </h2>
          </div>
          {faqs.map((f, i) => (
            <AccItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "40px 24px 120px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div
            ref={ctaRef}
            className="reveal"
            style={{
              background:
                "linear-gradient(135deg, rgba(36,99,235,0.18) 0%, rgba(124,58,237,0.15) 100%)",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: "24px",
              padding: "72px 48px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background decoration */}
            <div
              style={{
                position: "absolute",
                top: "-60px",
                right: "-60px",
                width: 240,
                height: 240,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                left: "-40px",
                width: 180,
                height: 180,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  borderRadius: "999px",
                  padding: "5px 14px",
                  marginBottom: "24px",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "15px", color: "#f59e0b" }}
                >
                  bolt
                </span>
                <span
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#fbbf24",
                  }}
                >
                  Get started in 30 minutes
                </span>
              </div>

              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#f1f5f9",
                  marginBottom: "16px",
                  lineHeight: 1.2,
                }}
              >
                Ready to run your next event
                <br />
                like a command centre?
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "1rem",
                  color: "#64748b",
                  marginBottom: "36px",
                  maxWidth: "500px",
                  margin: "0 auto 36px",
                  lineHeight: 1.7,
                }}
              >
                Join 500+ operations teams who've eliminated guest-list chaos,
                missed requests, and coordination failures.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button
                    className="btn-primary btn-glow"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "14px 32px",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "1rem",
                      fontWeight: 700,
                      fontFamily: "'DM Sans',sans-serif",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "20px" }}
                    >
                      rocket_launch
                    </span>
                    Create Free Account
                  </button>
                </Link>
                <button
                  className="btn-outline"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 24px",
                    borderRadius: "12px",
                    color: "#cbd5e1",
                    fontSize: "1rem",
                    fontWeight: 600,
                    fontFamily: "'DM Sans',sans-serif",
                    cursor: "pointer",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "20px", color: "#60a5fa" }}
                  >
                    mail
                  </span>
                  Talk to Sales
                </button>
              </div>

              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.8rem",
                  color: "#334155",
                  marginTop: "20px",
                }}
              >
                No credit card required · Cancel anytime · HTTPS encrypted
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "64px 24px 40px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: "48px",
              marginBottom: "56px",
            }}
          >
            {/* Brand */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    background: "linear-gradient(135deg,#2463eb,#7c3aed)",
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "17px", color: "#fff" }}
                  >
                    event_seat
                  </span>
                </div>
                <span
                  className="font-display"
                  style={{
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: "#e8eaf0",
                  }}
                >
                  EventOps
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.88rem",
                  color: "#475569",
                  lineHeight: 1.7,
                  maxWidth: "280px",
                  marginBottom: "20px",
                }}
              >
                The operations platform for event hospitality teams who demand
                precision at scale.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                {["lan", "link", "language"].map((ic) => (
                  <div
                    key={ic}
                    className="glass"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "9px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "17px", color: "#475569" }}
                    >
                      {ic}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4
                className="font-display"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#e8eaf0",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                Product
              </h4>
              {["Features", "Pricing", "Changelog", "Roadmap", "Security"].map(
                (l) => (
                  <a
                    key={l}
                    href="#"
                    style={{
                      display: "block",
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.88rem",
                      color: "#475569",
                      textDecoration: "none",
                      marginBottom: "10px",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#94a3b8")}
                    onMouseLeave={(e) => (e.target.style.color = "#475569")}
                  >
                    {l}
                  </a>
                ),
              )}
            </div>

            {/* Company */}
            <div>
              <h4
                className="font-display"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#e8eaf0",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                Company
              </h4>
              {["About", "Blog", "Careers", "Press", "Partners"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    display: "block",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.88rem",
                    color: "#475569",
                    textDecoration: "none",
                    marginBottom: "10px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#94a3b8")}
                  onMouseLeave={(e) => (e.target.style.color = "#475569")}
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Support */}
            <div>
              <h4
                className="font-display"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#e8eaf0",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "18px",
                }}
              >
                Support
              </h4>
              {[
                "Documentation",
                "API Reference",
                "Status Page",
                "Contact Us",
                "Community",
              ].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    display: "block",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: "0.88rem",
                    color: "#475569",
                    textDecoration: "none",
                    marginBottom: "10px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#94a3b8")}
                  onMouseLeave={(e) => (e.target.style.color = "#475569")}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div className="hr-glow" style={{ marginBottom: "28px" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <p
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.82rem",
                color: "#334155",
              }}
            >
              © 2026 EventOps Hospitality SaaS. All rights reserved.
              <span style={{ margin: "0 8px" }}>•</span>
              <a
                href="https://kushdeveloper.me"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#475569",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
                onMouseEnter={(e) => (e.target.style.color = "#94a3b8")}
                onMouseLeave={(e) => (e.target.style.color = "#475569")}
              >
                Made by Kush Developer
              </a>
            </p>
            <div style={{ display: "flex", gap: "24px" }}>
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (l) => (
                  <a
                    key={l}
                    href="#"
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.82rem",
                      color: "#334155",
                      textDecoration: "none",
                    }}
                  >
                    {l}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
