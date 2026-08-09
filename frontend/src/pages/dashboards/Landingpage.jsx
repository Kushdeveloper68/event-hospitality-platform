import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const headlineStyle = { fontFamily: "Manrope, sans-serif" };
const bodyStyle = { fontFamily: "Inter, sans-serif" };

const textStyles = {
  displayLg: "text-[48px] leading-[56px] tracking-[-0.02em] font-bold",
  headlineLg: "text-[32px] leading-[40px] tracking-[-0.01em] font-bold",
  headlineMd: "text-[24px] leading-[32px] font-semibold",
  headlineSm: "text-[18px] leading-[24px] font-semibold",
  bodyLg: "text-[18px] leading-[28px] font-normal",
  bodyMd: "text-[16px] leading-[24px] font-normal",
  bodySm: "text-[14px] leading-[20px] font-normal",
  labelMd: "text-[14px] leading-[16px] tracking-[0.01em] font-medium",
  labelSm: "text-[12px] leading-[16px] font-semibold",
};

const productCards = [
  {
    icon: "group",
    title: "Guest Management",
    description: "Centralised profiles, preferences, and itineraries.",
  },
  {
    icon: "qr_code_scanner",
    title: "Rapid Check-in",
    description: "Keep lines moving with QR scanning and instant badge printing.",
  },
  {
    icon: "directions_car",
    title: "Transport Logistics",
    description: "Track arrivals, manage fleets, and resolve delays instantly.",
  },
  {
    icon: "bed",
    title: "Room Allocation",
    description: "Visualise inventory, manage blocks, and handle upgrades.",
  },
];

const flowSteps = [
  { icon: "flight_land", label: "Guest arrives", active: false },
  { icon: "how_to_reg", label: "Check-in", active: true },
  { icon: "bed", label: "Room assigned", active: false },
  { icon: "airport_shuttle", label: "Transport updated", active: false },
  { icon: "room_service", label: "Service requested", active: false },
  { icon: "engineering", label: "Team resolves", active: false },
  { icon: "history", label: "Activity recorded", active: false },
];

const modules = [
  {
    icon: "group",
    title: "Guests",
    code: '{ "id": "G-102", "status": "Arrived", "type": "VIP" }',
    description: "Detailed profiles, dietary requirements, and dynamic itineraries.",
  },
  {
    icon: "bed",
    title: "Rooms",
    code: "Block: A | Available: 12 | Assigned: 88",
    description: "Live inventory management, room blocking, and allocation tracking.",
  },
  {
    icon: "directions_car",
    title: "Transport",
    code: "Vehicle: Van-3 | Route: Airport -> Hotel",
    description: "Fleet assignments, arrival tracking, and dispatch coordination.",
  },
  {
    icon: "support_agent",
    title: "Services",
    code: "Req: Extra Towels | Priority: High | SLA: 15m",
    description: "Track guest requests, assign tasks, and monitor resolution times.",
  },
  {
    icon: "groups",
    title: "Team",
    code: "Staff On-Duty: 45 | Shifts Active: 3",
    description: "Staff scheduling, role assignments, and team communications.",
  },
  {
    icon: "analytics",
    title: "Analytics",
    code: "Avg Check-in: 2.4m | Peak Arrival: 14:00",
    description: "Real-time operational dashboards and post-event reporting.",
  },
];

const audience = [
  {
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLtcxHL1lDXida13rJjxzHwjEpGQfoQMqgkfwThNCtzDaQHopo_o6Bwkzh_TorVFlGQIw7n0yTHh8NPw73DyEBYpAHQ4JZkWYvuimVtfMw50hX1_VeR1XXZjgaACtmesa0b-8JUV-bcFJv0rwFe2zMQZtTQWnBpOhGOOaAOFnLfbMVaWKbjq4jJfLjQvwOdadhrFlrOtLBP6rp3BLg1S-y5RUthlEpkpWs0B55ggrTI-zuOPb3On1OWh2PQ",
    tint: "#F7EAE0",
    tag: "Control",
    title: "Event Directors",
    description: "High-level oversight and real-time operational control.",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvTKl3nfQoOnSyJXEBTGMjRsNJ0DTvN14zWhXK4UFzwW5AsP5gqXg6Y5ht6TRl4c3ZsyUKWxk-IMn_6WwkeKLKYYzDGVUtBqp7hl0j5y9gtISj6_gLSqX8cNwfD7smwhQbrLDQsw7zySPogr1bzmbiLcGs0KhHXShZMr2t7L8dTL5zBdL8jJuVwQZf2uGtBoTOjtJ6_aCfMvCFR3Dcrw4fj1PvO6aj8mDU-2herwaAI6jSGvnXGy-Xc_Gc",
    tint: "#ecf6ef",
    tag: "Logistics",
    title: "Ops Managers",
    description: "Detailed coordination of logistics, schedules, and resources.",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLvN8G0V41eDnx8hgBQaJD8OrEGYU4MSoyDUHDaMlwA2-2uLjYe7Glk299oQgeQoIhqAwqlBvHy3ZgCyQSj42RbfqpPJsr6nM09Hlh339FG4c3H4r30MluBW71fN1Qzu3hYppVxlLplAWLGkxYFxwLkDMxdeFW2ANWOG9qzzbxd9TJF9pdnu2TKm73w2AqZ7vCdPsjM4oxgpIHrG2Kol1x9CfKYU_Fk6QENjHgJy5owQ5-e0o-zsdbUNTLI",
    tint: "#F7EAE0",
    tag: "Mobile",
    title: "Floor Staff",
    description: "Mobile-friendly access to tasks, guest info, and updates.",
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida/AP1WRLsuSi6CW-tHxkv0djpI1JVD3d26-jBjn_TmpyhaTn4Ed8AlzVkEifZavAh2_UU2qg7Ip6DXtsj8HQPHAcJEVfmwm2fsBzMkAKrQjQlCIu4JStETN5sTuNWIkZz8BdhnbtaagHVrnGThqlr53Xy3dFmlXMkf-_5s3dEJGBjJ_xacBzG0fF3xbhaZpl-YgUrdKrHjsVWPuFQquxufjMdOhHmjaxz5k7X4Bm-VnrqdFFxRYzzTg3zy0WM8mQE",
    tint: "#ecf6ef",
    tag: "Fleet",
    title: "Logistics Teams",
    description: "Streamlined tracking of transport, deliveries, and inventory.",
  },
];

const roadmapColumns = [
  {
    title: "Available Now",
    titleClass: "text-[#032f1e] border-[#032f1e]",
    items: [
      "Core Guest Management",
      "Room Allocation",
      "Basic Reporting",
    ],
    icon: "check_circle",
    iconClass: "text-[#032f1e]",
  },
  {
    title: "Planned (Q3)",
    titleClass: "text-[#9a4523] border-[#9a4523]",
    items: [
      "Advanced Transport Routing",
      "Custom Badge Designer",
      "API Integrations",
    ],
    icon: "schedule",
    iconClass: "text-[#717973]",
  },
  {
    title: "Exploring",
    titleClass: "text-[#717973] border-[#717973]",
    items: [
      "AI Schedule Conflict Detection",
      "Automated Supplier Comms",
    ],
    icon: "lightbulb",
    iconClass: "text-[#717973]",
  },
];

const faqItems = [
  {
    question: "Is EventCure suitable for small events?",
    answer:
      "While EventCure can handle small gatherings, it is primarily designed for complex, multi-day operations with significant logistical moving parts.",
  },
  {
    question: "Does it replace my registration software?",
    answer:
      "No. EventCure is designed for operations. You can import your guest lists from registration platforms and manage their journey from arrival onwards.",
  },
  {
    question: "How does the Beta program work?",
    answer:
      "Beta access is currently invitation-only. You can request access, and if your event profile matches our current testing phase, we'll onboard you personally.",
  },
];

export default function Landingpage() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1);
    const element = document.getElementById(id);

    if (!element) return;

    window.requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  return (
    <div className="landing-shell min-h-screen bg-[#FFFDFC] text-[#141d1a]" style={bodyStyle}>
      <style>{`html { scroll-behavior: smooth; }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes lpFadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes lpFloat {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(0, -10px, 0) scale(1.02); }
}

.lp-animate { animation: lpFadeUp 0.75s ease-out both; }
.lp-animate-delay-1 { animation: lpFadeUp 0.85s ease-out 0.08s both; }
.lp-animate-delay-2 { animation: lpFadeUp 0.95s ease-out 0.16s both; }
.lp-float { animation: lpFloat 10s ease-in-out infinite; }

.lp-card { transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease, background-color 240ms ease; will-change: transform; }
.lp-card:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(23, 32, 28, 0.12); }

.lp-surface { box-shadow: 0 18px 48px rgba(23, 32, 28, 0.08); }
.lp-button { transition: transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease, border-color 220ms ease, color 220ms ease; }
.lp-button:hover { transform: translateY(-1px); box-shadow: 0 14px 28px rgba(3, 47, 30, 0.16); }
.lp-pill { transition: transform 220ms ease, background-color 220ms ease, border-color 220ms ease, color 220ms ease, box-shadow 220ms ease; }
.lp-pill:hover { transform: translateY(-1px); }
.lp-section { position: relative; overflow: hidden; }

@media (prefers-reduced-motion: reduce) {
  .lp-animate,
  .lp-animate-delay-1,
  .lp-animate-delay-2,
  .lp-float,
  .lp-card,
  .lp-button,
  .lp-pill {
    animation: none !important;
    transition: none !important;
  }
}
`}</style>

      <nav
        className={`fixed top-0 z-50 w-full border-b border-[#c1c8c24d] bg-[#f2fcf5d9] backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "shadow-[0_10px_30px_rgba(23,32,28,0.08)]" : ""
        }`}
      >
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
          <Link className="lp-animate text-2xl leading-8 font-semibold text-[#032f1e]" to="/" style={headlineStyle}>
            EventCure
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link className="lp-pill rounded-full px-3 py-2 text-sm leading-4 font-medium text-[#414844] transition-colors duration-200 hover:bg-[#ecf6ef] hover:text-[#032f1e]" to="/#product">Product</Link>
            <Link className="lp-pill rounded-full px-3 py-2 text-sm leading-4 font-medium text-[#414844] transition-colors duration-200 hover:bg-[#ecf6ef] hover:text-[#032f1e]" to="/manual">How it works</Link>
            <Link className="lp-pill rounded-full px-3 py-2 text-sm leading-4 font-medium text-[#414844] transition-colors duration-200 hover:bg-[#ecf6ef] hover:text-[#032f1e]" to="/#use-cases">Use cases</Link>
            <Link className="lp-pill rounded-full px-3 py-2 text-sm leading-4 font-medium text-[#414844] transition-colors duration-200 hover:bg-[#ecf6ef] hover:text-[#032f1e]" to="/#roadmap">Roadmap</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link className="lp-pill hidden rounded-full px-4 py-2 text-sm leading-4 font-medium text-[#414844] transition-colors hover:bg-[#ecf6ef] hover:text-[#032f1e] md:inline-block" to="/login">Sign in</Link>
            <Link className="lp-button rounded-full bg-[#032f1e] px-6 py-3 text-sm leading-4 font-medium text-[#ffffff] shadow-[0_10px_24px_rgba(3,47,30,0.16)] hover:bg-[#1d4533]" to="/#beta">Join Beta</Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        <section className="lp-section mx-auto max-w-7xl px-6 py-12 md:py-24">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="lp-float absolute -left-24 top-6 h-72 w-72 rounded-full bg-[#ecf6ef] blur-3xl" />
            <div className="lp-float absolute right-0 top-10 h-80 w-80 rounded-full bg-[#f7eae0] blur-3xl" style={{ animationDelay: "-2.5s" }} />
          </div>
          <div className="grid grid-cols-12 items-center gap-6">
            <div className="relative col-span-12 mb-12 space-y-6 md:col-span-5 md:mb-0 md:space-y-8">
              <div className="lp-animate-delay-1 inline-flex items-center gap-2 rounded-full border border-[#dbe5de] bg-white/80 px-4 py-1.5 text-xs leading-4 font-semibold uppercase tracking-wider text-[#032f1e] shadow-[0_8px_24px_rgba(23,32,28,0.06)] backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#ff946c]" />
                EVENT OPERATIONS PLATFORM · BETA
              </div>
              <h1 className={`${textStyles.displayLg} lp-animate-delay-2 text-[#032f1e] md:text-[64px] md:leading-18`} style={headlineStyle}>
                Run the event.<br />
                Not the chaos.
              </h1>
              <p className={`${textStyles.bodyLg} lp-animate-delay-2 max-w-md text-[#414844]`} style={bodyStyle}>
                The comprehensive operational workspace designed for high-stakes events. From guest arrivals to real-time logistics, precision is built-in.
              </p>
              <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                <Link className="lp-button rounded-full bg-[#032f1e] px-8 py-4 text-sm leading-4 font-medium text-[#ffffff] shadow-[0_10px_24px_rgba(3,47,30,0.16)] hover:bg-[#1d4533]" to="/#beta">Join the Beta</Link>
                <Link className="lp-button rounded-full border border-[#c1c8c2] bg-white/80 px-8 py-4 text-sm leading-4 font-medium text-[#032f1e] backdrop-blur-sm hover:border-[#032f1e] hover:bg-[#ecf6ef]" to="/#product">Explore Platform</Link>
              </div>
            </div>

            <div className="relative col-span-12 z-10 md:col-span-7">
              <div className="lp-surface overflow-hidden rounded-[28px] border border-[#dbe5de] bg-[#ffffff] shadow-[0px_12px_48px_rgba(23,32,28,0.12)]">
                <div className="flex h-12 items-center justify-between border-b border-[#c1c8c2] bg-[#f2fcf5] px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-[#c1c8c280]" />
                      <div className="h-3 w-3 rounded-full bg-[#c1c8c280]" />
                      <div className="h-3 w-3 rounded-full bg-[#c1c8c280]" />
                    </div>
                    <span className="ml-4 rounded border bg-[#ffffff] px-2 py-0.5 text-xs leading-4 font-semibold text-[#414844] shadow-sm">Summit 2026</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="material-symbols-outlined text-[18px] text-[#717973]">search</span>
                    <span className="material-symbols-outlined text-[18px] text-[#717973]">notifications</span>
                  </div>
                </div>

                <div className="flex min-h-100 flex-col md:h-100 md:flex-row">
                  <div className="flex w-full flex-row gap-1 border-b border-[#c1c8c2] bg-[#f2fcf5] p-4 md:w-48 md:flex-col md:border-b-0 md:border-r">
                    <div className="flex flex-1 items-center gap-2 rounded-full bg-[#1d45331a] px-3 py-2 text-xs leading-4 font-semibold text-[#032f1e]"><span className="material-symbols-outlined text-[16px]">dashboard</span> Overview</div>
                    <div className="flex flex-1 items-center gap-2 rounded-full px-3 py-2 text-xs leading-4 font-semibold text-[#414844]"><span className="material-symbols-outlined text-[16px]">group</span> Guests</div>
                    <div className="flex flex-1 items-center gap-2 rounded-full px-3 py-2 text-xs leading-4 font-semibold text-[#414844]"><span className="material-symbols-outlined text-[16px]">bed</span> Rooms</div>
                    <div className="flex flex-1 items-center gap-2 rounded-full px-3 py-2 text-xs leading-4 font-semibold text-[#414844]"><span className="material-symbols-outlined text-[16px]">directions_car</span> Transport</div>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden bg-[#f2fcf5] p-4 md:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="lp-card rounded-[20px] border border-[#dbe5de] bg-[#ffffff] p-4">
                        <div className="mb-1 text-xs leading-4 font-semibold text-[#414844]">Total Arrivals</div>
                        <div className={`${textStyles.headlineMd} text-[#032f1e]`} style={headlineStyle}>482 <span className="text-xs font-normal text-[#717973]">/ 500</span></div>
                      </div>
                      <div className="lp-card rounded-[20px] border border-[#dbe5de] bg-[#ffffff] p-4">
                        <div className="mb-1 text-xs leading-4 font-semibold text-[#414844]">Pending Check-in</div>
                        <div className="text-2xl leading-8 font-semibold text-[#ff946c]" style={headlineStyle}>18</div>
                      </div>
                      <div className="lp-card rounded-[20px] border border-[#dbe5de] bg-[#ffffff] p-4">
                        <div className="mb-1 text-xs leading-4 font-semibold text-[#414844]">Active Requests</div>
                        <div className="text-2xl leading-8 font-semibold text-[#032f1e]" style={headlineStyle}>5</div>
                      </div>
                    </div>

                    <div className="lp-card flex flex-1 flex-col overflow-hidden rounded-3xl border border-[#dbe5de] bg-[#ffffff]">
                      <div className="border-b border-[#c1c8c2] px-4 py-3 text-sm leading-4 font-semibold text-[#032f1e]">Arriving Today</div>
                      <div className="flex justify-between border-b border-[#c1c8c2] px-4 py-2 text-xs leading-4 font-semibold text-[#717973]"><div className="w-1/3">Guest</div><div className="w-1/3">ETA</div><div className="w-1/3 text-right">Status</div></div>
                      <div className="flex items-center justify-between border-b border-[#c1c8c2] px-4 py-3">
                        <div className="w-1/3 text-sm leading-4 font-semibold text-[#141d1a]">Eleanor Vance</div>
                        <div className="w-1/3 text-xs leading-4 font-semibold text-[#414844]">14:30 (Flight AA102)</div>
                        <div className="w-1/3 text-right"><span className="rounded-full bg-[#3D7A581a] px-2 py-1 text-[10px] font-bold uppercase text-[#3D7A58]">In Transit</span></div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="w-1/3 text-sm leading-4 font-semibold text-[#141d1a]">Marcus Thorne</div>
                        <div className="w-1/3 text-xs leading-4 font-semibold text-[#414844]">15:15 (Car Service)</div>
                        <div className="w-1/3 text-right"><span className="rounded-full bg-[#dbe5de] px-2 py-1 text-[10px] font-bold uppercase text-[#414844]">Expected</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section overflow-hidden border-y border-[#c1c8c24d] bg-[#ffffff] py-12" id="product">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="lp-float absolute -right-16 top-16 h-64 w-64 rounded-full bg-[#ecf6ef] blur-3xl" />
          </div>
          <div className="mx-auto mb-12 max-w-7xl px-6 text-center">
            <h2 className={`${textStyles.headlineLg} text-[#032f1e]`} style={headlineStyle}>Everything around the event.<br />One operational workspace.</h2>
          </div>
          <div className="hide-scrollbar flex snap-x gap-6 overflow-x-auto px-6 pb-8" style={{ paddingLeft: "max(24px, calc((100vw - 1280px) / 2))", paddingRight: 24 }}>
            {productCards.map((card) => (
              <div key={card.title} className="lp-card min-w-75 snap-center rounded-3xl border border-[#dbe5de] bg-[#ffffff] p-6 md:min-w-100">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1d45331a] text-[#032f1e] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"><span className="material-symbols-outlined">{card.icon}</span></div>
                <h3 className={`${textStyles.headlineSm} mb-2 text-[#032f1e]`} style={headlineStyle}>{card.title}</h3>
                <p className={`${textStyles.bodySm} text-[#414844]`} style={bodyStyle}>{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="lp-section bg-[#ecf6ef] py-12" id="how-it-works">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="lp-float absolute left-0 top-8 h-56 w-56 rounded-full bg-white/50 blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-6">
            <h2 className={`${textStyles.headlineLg} mb-12 text-center text-[#032f1e]`} style={headlineStyle}>From arrival to resolution.</h2>
            <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-8">
              <div className="flex min-w-max items-center gap-4 px-4">
                {flowSteps.map((step, index) => (
                  <div key={step.label} className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`lp-card relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 ${step.active ? "border-[#032f1e] bg-[#032f1e] text-[#ffffff] shadow-md" : "border-[#c1c8c2] bg-[#dbe5de] text-[#414844]"}`}>
                        <span className="material-symbols-outlined">{step.icon}</span>
                      </div>
                      <span className={`text-xs leading-4 font-semibold ${step.active ? "text-[#032f1e]" : "text-[#414844]"}`}>{step.label}</span>
                    </div>
                    {index < flowSteps.length - 1 ? <div className="h-0.5 w-12 bg-[#c1c8c280]" /> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl border-b border-[#c1c8c24d] px-6 py-12">
          <div className="grid grid-cols-12 items-center gap-6">
            <div className="col-span-12 mb-12 md:col-span-7 md:mb-0">
              <div className="lp-card overflow-hidden rounded-[28px] border border-[#dbe5de] bg-[#ffffff] shadow-[0_16px_36px_rgba(23,32,28,0.08)]">
                <div className="flex flex-col gap-4 bg-[#ffffff] p-6">
                  <h4 className={`${textStyles.headlineSm} border-b border-[#c1c8c2] pb-2 text-[#032f1e]`} style={headlineStyle}>Check-in Desk</h4>
                  <div className="flex items-center justify-between rounded-md border border-[#c1c8c2] bg-[#ecf6ef] p-3"><div className="text-sm leading-4 font-medium text-[#141d1a]">Arriving Today</div><div className="text-lg leading-6 font-semibold text-[#032f1e]" style={headlineStyle}>124</div></div>
                  <div className="flex items-center justify-between rounded-md border border-[#a5d0b8] bg-[#c0edd333] p-3"><div className="text-sm leading-4 font-medium text-[#141d1a]">Checked-In</div><div className="text-lg leading-6 font-semibold text-[#032f1e]" style={headlineStyle}>89</div></div>
                  <div className="flex items-center justify-between rounded-md border border-[#ffb59a] bg-[#ffdbcf33] p-3"><div className="text-sm leading-4 font-medium text-[#141d1a]">Pending</div><div className="text-lg leading-6 font-semibold text-[#ff946c]" style={headlineStyle}>35</div></div>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 md:pl-12">
              <h2 className={`${textStyles.displayLg} mb-4 text-[#032f1e]`} style={headlineStyle}>Keep arrivals moving.</h2>
              <p className={`${textStyles.bodyLg} text-[#414844]`} style={bodyStyle}>Process guests efficiently with dedicated check-in flows, instant badge printing, and real-time status updates across your team.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl border-b border-[#c1c8c24d] px-6 py-12">
          <div className="grid grid-cols-12 items-center gap-6">
            <div className="col-span-12 order-2 mb-12 md:order-1 md:col-span-5 md:mb-0 md:pr-12">
              <h2 className={`${textStyles.displayLg} mb-4 text-[#032f1e]`} style={headlineStyle}>See the whole event.</h2>
              <p className={`${textStyles.bodyLg} text-[#414844]`} style={bodyStyle}>Monitor simultaneous workstreams on a unified timeline. Spot conflicts before they happen and keep every team aligned.</p>
            </div>
            <div className="col-span-12 order-1 md:order-2 md:col-span-7">
              <div className="lp-card overflow-hidden rounded-[28px] border border-[#dbe5de] bg-[#ffffff] p-6 shadow-[0_16px_36px_rgba(23,32,28,0.08)]">
                <div className="flex flex-col gap-4">
                  <h4 className={`${textStyles.headlineSm} mb-2 text-[#032f1e]`} style={headlineStyle}>Event Schedule</h4>
                  <div className="relative border-l-2 border-[#c1c8c280] pb-6 pl-8"><div className="absolute top-1 -left-1.75 h-3 w-3 rounded-full bg-[#032f1e]" /><div className="mb-1 text-sm leading-4 font-medium text-[#717973]">09:00 AM</div><div className="rounded border border-[#c1c8c2] bg-[#ecf6ef] p-3"><div className="text-xs leading-4 font-semibold text-[#032f1e]">Main Sessions</div><div className="text-sm leading-5 font-normal text-[#414844]">Opening Keynote</div></div></div>
                  <div className="relative border-l-2 border-[#c1c8c280] pb-6 pl-8"><div className="absolute top-1 -left-1.75 h-3 w-3 rounded-full bg-[#ff946c]" /><div className="mb-1 text-sm leading-4 font-medium text-[#717973]">10:30 AM</div><div className="rounded border border-[#c1c8c2] bg-[#ecf6ef] p-3"><div className="text-xs leading-4 font-semibold text-[#ff946c]">Transport</div><div className="text-sm leading-5 font-normal text-[#414844]">VIP Shuttle Departures</div></div></div>
                  <div className="relative border-l-2 border-[#c1c8c280] pl-8"><div className="absolute top-1 -left-1.75 h-3 w-3 rounded-full bg-[#2d2620]" /><div className="mb-1 text-sm leading-4 font-medium text-[#717973]">12:00 PM</div><div className="rounded border border-[#c1c8c2] bg-[#ecf6ef] p-3"><div className="text-xs leading-4 font-semibold text-[#2d2620]">Catering</div><div className="text-sm leading-5 font-normal text-[#414844]">Lunch Service Commences</div></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lp-section bg-[#f2fcf5] py-12">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="lp-float absolute right-0 top-0 h-72 w-72 rounded-full bg-[#ffffff] blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-6">
            <h2 className={`${textStyles.headlineLg} mb-12 text-center text-[#032f1e]`} style={headlineStyle}>Built for every operational need.</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => (
                <div key={module.title} className="lp-card rounded-3xl border border-[#dbe5de] bg-[#ffffff] p-6 shadow-[0_14px_34px_rgba(23,32,28,0.06)]">
                  <div className="mb-4 flex items-center gap-3"><span className="material-symbols-outlined text-[#032f1e]">{module.icon}</span><h3 className={`${textStyles.headlineSm} text-[#032f1e]`} style={headlineStyle}>{module.title}</h3></div>
                  <div className="mb-4 rounded border border-[#c1c8c280] bg-[#e6f0e9] p-3 font-mono text-sm text-[#414844]">{module.code}</div>
                  <p className={`${textStyles.bodySm} text-[#414844]`} style={bodyStyle}>{module.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section border-y border-[#c1c8c24d] bg-[#ecf6ef] py-12">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className={`${textStyles.headlineLg} mb-12 text-center text-[#032f1e]`} style={headlineStyle}>Designed for the whole team.</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {audience.map((person) => (
                <div key={person.title} className="lp-card flex flex-col items-center rounded-3xl border border-[#dbe5de] bg-[#ffffff] p-8 text-center shadow-[0_14px_34px_rgba(23,32,28,0.06)]">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-[0_10px_24px_rgba(23,32,28,0.08)]" style={{ backgroundColor: person.tint }}><img alt={`${person.title} Icon`} className="h-10 w-10" src={person.image} /></div>
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#717973]">{person.tag}</div>
                  <div className={`${textStyles.headlineSm} mb-3 text-[#032f1e]`} style={headlineStyle}>{person.title}</div>
                  <p className={`${textStyles.bodySm} text-[#414844]`} style={bodyStyle}>{person.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FFFDFC] py-12" id="use-cases">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className={`${textStyles.headlineLg} mb-8 text-[#032f1e]`} style={headlineStyle}>Adaptable to any format.</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="lp-pill rounded-full border border-[#032f1e] bg-[#c0edd333] px-6 py-3 text-sm leading-4 font-medium text-[#032f1e] shadow-[0_10px_24px_rgba(23,32,28,0.06)] hover:bg-[#c0edd366]">Corporate Summits</button>
              <button className="lp-pill rounded-full border border-[#c1c8c2] px-6 py-3 text-sm leading-4 font-medium text-[#414844] hover:bg-[#ecf6ef] hover:border-[#032f1e]">Global Conferences</button>
              <button className="lp-pill rounded-full border border-[#c1c8c2] px-6 py-3 text-sm leading-4 font-medium text-[#414844] hover:bg-[#ecf6ef] hover:border-[#032f1e]">Luxury Weddings</button>
              <button className="lp-pill rounded-full border border-[#c1c8c2] px-6 py-3 text-sm leading-4 font-medium text-[#414844] hover:bg-[#ecf6ef] hover:border-[#032f1e]">VIP Retreats</button>
            </div>
          </div>
        </section>

        <section className="lp-section border-y border-[#c1c8c24d] bg-[#Fdfbf7] py-12" id="beta">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="lp-float absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#f7eae0] blur-3xl" />
          </div>
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className={`${textStyles.displayLg} mb-6 text-[#032f1e]`} style={headlineStyle}>We're still building EventCure.</h2>
            <p className={`${textStyles.bodyLg} mb-12 text-[#414844]`} style={bodyStyle}>Join our early access program to help shape the future of event operations.</p>
            <div className="mb-12 flex flex-col justify-center gap-8 md:flex-row">
              {[["1", "Try it", "Use it on your next event."], ["2", "Tell us", "Share your feedback directly."], ["3", "Shape it", "Influence our product roadmap."]].map(([step, title, description]) => (
                <div key={title} className="flex flex-col items-center">
                  <div className="lp-card mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1d45331a] text-[14px] font-bold text-[#032f1e]">{step}</div>
                  <div className="text-sm leading-4 font-bold text-[#141d1a]">{title}</div>
                  <div className="text-xs leading-4 font-semibold text-[#414844]">{description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FFFDFC] py-12" id="roadmap">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className={`${textStyles.headlineLg} mb-12 text-[#032f1e]`} style={headlineStyle}>What's coming next.</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {roadmapColumns.map((column) => (
                <div key={column.title}>
                  <h3 className={`border-b-2 pb-2 mb-4 ${textStyles.headlineSm} ${column.titleClass}`} style={headlineStyle}>{column.title}</h3>
                  <ul className="space-y-3 text-[#414844]">
                    {column.items.map((item) => (
                      <li key={item} className={`${textStyles.bodySm} flex items-center gap-2`} style={bodyStyle}><span className={`material-symbols-outlined text-[16px] ${column.iconClass}`}>{column.icon}</span>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#032f1e] py-12 text-[#ffffff]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6">
            <div className="text-lg leading-6 font-semibold opacity-80" style={headlineStyle}>Looking ahead:</div>
            <div className="hide-scrollbar flex gap-8 overflow-x-auto whitespace-nowrap text-sm leading-4 font-medium opacity-90">
              <span>WhatsApp Integration</span><span>·</span><span>Native Mobile Apps</span><span>·</span><span>Workflow Automation</span><span>·</span><span>RFID Tracking</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-12">
          <h2 className={`${textStyles.headlineLg} mb-12 text-center text-[#032f1e]`} style={headlineStyle}>Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.question} className="overflow-hidden rounded-lg border border-[#c1c8c2] bg-[#ffffff]">
                  <button aria-expanded={isOpen} className="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none" onClick={() => setOpenFaq(isOpen ? null : index)}>
                    <span className={`${textStyles.headlineSm} text-[#032f1e]`} style={headlineStyle}>{item.question}</span>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>expand_more</span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden bg-[#ffffff] px-6"><div className="border-t border-[#c1c8c24d] py-4 text-sm leading-5 font-normal text-[#414844]" style={bodyStyle}>{item.answer}</div></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="lp-section border-t border-[#c1c8c24d] bg-[#F7EAE0] py-32 text-center">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className={`${textStyles.displayLg} mb-6 text-[#032f1e]`} style={headlineStyle}>Your next event deserves a better operations desk.</h2>
            <p className={`${textStyles.bodyLg} mb-10 text-[#414844]`} style={bodyStyle}>Stop relying on messy spreadsheets and disjointed tools. Bring precision to your event logistics.</p>
            <Link className="lp-button inline-block rounded-full bg-[#032f1e] px-10 py-5 text-lg leading-7 font-medium text-[#ffffff] shadow-[0_10px_24px_rgba(3,47,30,0.16)] hover:bg-[#1d4533]" to="/#beta">Request Beta Access</Link>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-[#c1c8c24d] bg-[#f2fcf5] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row md:items-center">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className={`${textStyles.headlineSm} font-bold text-[#032f1e]`} style={headlineStyle}>EventCure</div>
            <div className={`${textStyles.bodySm} text-[#414844]`} style={bodyStyle}>Event operations, organised.</div>
            <div className="mt-4 text-xs leading-4 font-semibold text-[#414844]">© 2024 EventCure. All rights reserved. Precision in every detail.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <Link className="text-xs leading-4 font-semibold text-[#414844] transition-colors hover:text-[#9a4523]" to="/privacy">Privacy Policy</Link>
            <Link className="text-xs leading-4 font-semibold text-[#414844] transition-colors hover:text-[#9a4523]" to="/terms">Terms of Service</Link>
            <Link className="text-xs leading-4 font-semibold text-[#414844] transition-colors hover:text-[#9a4523]" to="/manual">Contact Support</Link>
            <Link className="text-xs leading-4 font-semibold text-[#414844] transition-colors hover:text-[#9a4523]" to="/privacy">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
