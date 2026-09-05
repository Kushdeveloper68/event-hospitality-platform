import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const headlineStyle = { fontFamily: "'Manrope', sans-serif" };
const bodyStyle = { fontFamily: "'DM Sans', sans-serif" };
const monoStyle = { fontFamily: "'IBM Plex Mono', monospace" };

const textStyles = {
  display: "text-[46px] leading-[0.98] tracking-[-0.045em] font-extrabold md:text-[72px]",
  h2: "text-[34px] leading-[1.05] tracking-[-0.035em] font-extrabold md:text-[48px]",
  h3: "text-[20px] leading-7 font-bold",
  body: "text-[16px] leading-7",
};

const navItems = [
  ["Product", "/#product"],
  ["How it works", "/#how-it-works"],
  ["Use cases", "/#use-cases"],
  ["FAQ", "/#faq"],
];

const liveEvents = [
  { type: "CHECK-IN", title: "Eleanor Vance checked in", meta: "VIP · Room 402", icon: "how_to_reg" },
  { type: "TRANSPORT", title: "Van-03 departed airport", meta: "ETA 14:22 · 12 guests", icon: "directions_car" },
  { type: "SERVICE", title: "Extra towels request assigned", meta: "High priority · SLA 15m", icon: "room_service" },
  { type: "ROOM", title: "Room 514 assigned", meta: "Marcus Thorne · King", icon: "bed" },
];

const liveMarquee = [
  "482 arrivals",
  "89 checked-in",
  "12 rooms available",
  "5 active requests",
  "Van-03 · ETA 14:22",
  "3 high-priority tasks",
  "45 staff on duty",
  "Avg. check-in 2.4m",
];

const productModules = [
  {
    key: "guests",
    icon: "group",
    label: "Guests",
    title: "A live guest picture.",
    copy: "Profiles, arrival status, VIP requirements, itineraries and preferences without hunting through spreadsheets.",
    metric: "482",
    metricLabel: "arrivals today",
    accent: "green",
  },
  {
    key: "transport",
    icon: "directions_car",
    label: "Transport",
    title: "Know where every vehicle is.",
    copy: "Track routes, ETAs, dispatch changes and guest movement from one operational view.",
    metric: "14:22",
    metricLabel: "next ETA",
    accent: "orange",
  },
  {
    key: "services",
    icon: "support_agent",
    label: "Services",
    title: "Turn requests into action.",
    copy: "Every request gets an owner, priority and SLA so nothing disappears inside a group chat.",
    metric: "05",
    metricLabel: "active requests",
    accent: "green",
  },
  {
    key: "rooms",
    icon: "bed",
    label: "Rooms",
    title: "Keep accommodation moving.",
    copy: "Room blocks, assignments and availability stay connected to the guest journey.",
    metric: "12",
    metricLabel: "rooms available",
    accent: "orange",
  },
];

const flow = [
  ["flight_land", "Arrival"],
  ["qr_code_scanner", "Check-in"],
  ["bed", "Room"],
  ["airport_shuttle", "Transport"],
  ["room_service", "Service"],
  ["task_alt", "Resolution"],
];

const modules = [
  ["group", "Guests", "G-102 · VIP · Arriving 14:30"],
  ["bed", "Rooms", "Block A · 12 available · 88 assigned"],
  ["directions_car", "Transport", "Van-03 · Airport → Hotel"],
  ["support_agent", "Services", "Extra Towels · High · SLA 15m"],
  ["groups", "Team", "On duty · 45 · Shift B"],
  ["analytics", "Analytics", "Avg check-in · 2.4m"],
];

const audiences = [
  ["Event Directors", "CONTROL", "See the whole operation and act before small issues become event-wide problems.", "visibility"],
  ["Ops Managers", "LOGISTICS", "Coordinate resources, rooms, transport and service workflows from one place.", "tune"],
  ["Floor Staff", "MOBILE", "Get the context and next action without calling the office.", "smartphone"],
  ["Logistics Teams", "FLEET", "Track vehicles, deliveries and changes while the event is moving.", "local_shipping"],
];

const faqs = [
  ["What makes EventCure different from event management software?", "EventCure is the operational layer. It does not try to replace ticketing or registration. It connects the work that happens around arrivals, rooms, transport, services and team execution."],
  ["Does EventCure replace registration software?", "No. Your registration system can remain the source for attendee data. EventCure is built to turn that information into an operational workflow."],
  ["Is EventCure suitable for smaller events?", "Yes, but the strongest fit is complex events with meaningful guest, accommodation, transport, staffing or service coordination."],
  ["How does the Beta program work?", "Request access, use EventCure on a real workflow, and share feedback directly with the team. Beta teams help determine what gets built next."],
];

export default function Landingpage() {
  const location = useLocation();
  const [activeModule, setActiveModule] = useState("guests");
  const [activityIndex, setActivityIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [dashboardTime, setDashboardTime] = useState("14:18");

  const active = useMemo(
    () => productModules.find((item) => item.key === activeModule) || productModules[0],
    [activeModule]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActivityIndex((value) => (value + 1) % liveEvents.length);
      setDashboardTime((value) => {
        const [h, m] = value.split(":").map(Number);
        const total = h * 60 + m + 1;
        return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
      });
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }, [location.hash]);

  return (
    <div className="ec-site" style={bodyStyle}>
      <div className="ec-grid-bg" aria-hidden="true" />

      <nav className={`ec-nav ${scrolled ? "ec-nav-scrolled" : ""}`}>
        <div className="ec-container ec-nav-inner">
          <Link to="/" className="ec-brand">
            <img src="/event-logo-with-icon-dark-bg-removebg-preview.png" alt="EventCure" />
            <span style={headlineStyle}>EventCure</span>
          </Link>

          <div className="ec-nav-links">
            {navItems.map(([label, href]) => (
              <Link key={label} to={href}>{label}</Link>
            ))}
          </div>

          <div className="ec-nav-actions">
            <Link to="/dashboard" className="ec-btn ec-btn-ghost">
              Dashboard
            </Link>
            <Link to="/login" className="ec-signin">Sign in</Link>
            <Link to="/login" className="ec-btn ec-btn-dark ec-btn-small">
              Request Beta <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO */}
        <section className="ec-hero">
          <div className="ec-container ec-hero-grid">
            <div className="ec-hero-copy">
              <div className="ec-live-badge">
                <span className="ec-live-dot" />
                <span>Event operations platform</span>
                <b>Beta</b>
              </div>

              <h1 style={headlineStyle}>
                Run the event.
                <span>Not the chaos.</span>
              </h1>

              <p>
                One live workspace for guest arrivals, rooms, transport, service requests and the people keeping the event moving.
              </p>

              <div className="ec-hero-actions">
                <Link to="/login" className="ec-btn ec-btn-dark">
                  Request Beta Access
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link to="/#product" className="ec-btn ec-btn-ghost">
                  Explore the product
                  <span className="material-symbols-outlined">play_arrow</span>
                </Link>
              </div>

              <div className="ec-trust-row">
                <span><i className="material-symbols-outlined">check_circle</i> Built for operations</span>
                <span><i className="material-symbols-outlined">bolt</i> Live workflow</span>
                <span><i className="material-symbols-outlined">lock</i> Secure by design</span>
              </div>
            </div>

            {/* LIVE PRODUCT WINDOW */}
            <div className="ec-product-window-wrap">
              <div className="ec-orbit ec-orbit-one" />
              <div className="ec-orbit ec-orbit-two" />

              <div className="ec-product-window">
                <div className="ec-window-top">
                  <div className="ec-window-brand">
                    <div className="ec-window-logo">E</div>
                    <div>
                      <strong>Summit 2026</strong>
                      <small>Operations workspace</small>
                    </div>
                  </div>
                  <div className="ec-window-status">
                    <span className="ec-live-dot" /> LIVE
                    <span className="ec-window-time">{dashboardTime}</span>
                  </div>
                </div>

                <div className="ec-window-body">
                  <aside className="ec-window-sidebar">
                    {[
                      ["dashboard", "Overview"],
                      ["group", "Guests"],
                      ["bed", "Rooms"],
                      ["directions_car", "Transport"],
                      ["support_agent", "Services"],
                    ].map(([icon, label], i) => (
                      <div key={label} className={`ec-side-item ${i === 0 ? "active" : ""}`}>
                        <span className="material-symbols-outlined">{icon}</span>
                        <span>{label}</span>
                      </div>
                    ))}
                  </aside>

                  <div className="ec-dashboard">
                    <div className="ec-dashboard-head">
                      <div>
                        <span className="ec-kicker">TODAY · OPERATIONS</span>
                        <h3 style={headlineStyle}>Good afternoon, team.</h3>
                      </div>
                      <div className="ec-team-stack">
                        <span>+45</span>
                        <div className="ec-avatar">K</div>
                        <div className="ec-avatar avatar-two">M</div>
                        <div className="ec-avatar avatar-three">S</div>
                      </div>
                    </div>

                    <div className="ec-stat-grid">
                      <div className="ec-stat-card featured">
                        <span>ARRIVALS</span>
                        <strong>482</strong>
                        <small><i className="material-symbols-outlined">trending_up</i> 18 pending</small>
                        <div className="ec-sparkline"><i /><i /><i /><i /><i /><i /><i /></div>
                      </div>
                      <div className="ec-stat-card">
                        <span>CHECKED-IN</span>
                        <strong>89</strong>
                        <small>18.5% of arrivals</small>
                      </div>
                      <div className="ec-stat-card">
                        <span>REQUESTS</span>
                        <strong>05</strong>
                        <small className="orange-text">2 high priority</small>
                      </div>
                    </div>

                    <div className="ec-dashboard-grid">
                      <div className="ec-panel ec-arrivals">
                        <div className="ec-panel-head">
                          <div>
                            <span className="ec-kicker">GUEST FLOW</span>
                            <h4 style={headlineStyle}>Arriving today</h4>
                          </div>
                          <span className="ec-live-chip"><span className="ec-live-dot" /> Live</span>
                        </div>

                        {[
                          ["Eleanor Vance", "14:30 · AA102", "In Transit"],
                          ["Marcus Thorne", "15:15 · Car", "Expected"],
                          ["Sofia Bennett", "15:40 · BA210", "Confirmed"],
                        ].map(([name, meta, status]) => (
                          <div className="ec-guest-row" key={name}>
                            <div className="ec-mini-avatar">{name[0]}</div>
                            <div>
                              <strong>{name}</strong>
                              <small>{meta}</small>
                            </div>
                            <span className={`ec-status ${status === "In Transit" ? "green" : status === "Expected" ? "muted" : "warm"}`}>{status}</span>
                          </div>
                        ))}
                      </div>

                      <div className="ec-panel ec-activity">
                        <div className="ec-panel-head">
                          <div>
                            <span className="ec-kicker">ACTIVITY</span>
                            <h4 style={headlineStyle}>Live feed</h4>
                          </div>
                          <span className="ec-pulse-icon material-symbols-outlined">sensors</span>
                        </div>

                        <div className="ec-live-feed">
                          <div className="ec-feed-line" />
                          {liveEvents.map((event, index) => (
                            <div className={`ec-feed-item ${index === activityIndex ? "is-new" : ""}`} key={event.title}>
                              <div className="ec-feed-icon"><span className="material-symbols-outlined">{event.icon}</span></div>
                              <div>
                                <small>{event.type}</small>
                                <strong>{event.title}</strong>
                                <span>{event.meta}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ec-window-bottom">
                  <div><span className="ec-live-dot" /> All systems operational</div>
                  <div>Last sync <strong>{dashboardTime}</strong></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MOVING DATA MARQUEE */}
        <div className="ec-marquee" aria-label="EventCure live product metrics">
          <div className="ec-marquee-track">
            {[...liveMarquee, ...liveMarquee].map((item, index) => (
              <span key={`${item}-${index}`}>
                <i className="material-symbols-outlined">radio_button_checked</i>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* PROBLEM */}
        <section className="ec-section ec-problem">
          <div className="ec-container ec-two-col">
            <div>
              <span className="ec-eyebrow">THE OPERATIONAL GAP</span>
              <h2 style={headlineStyle}>Your event isn't the problem.<span>Fragmented operations are.</span></h2>
            </div>

            <div className="ec-fragmented">
              <div className="ec-tool-cloud">
                {[
                  ["chat", "WhatsApp"],
                  ["table_chart", "Excel"],
                  ["call", "Phone"],
                  ["confirmation_number", "Registration"],
                  ["mail", "Email"],
                ].map(([icon, label], i) => (
                  <div key={label} className={`ec-tool-pill tool-${i}`}>
                    <span className="material-symbols-outlined">{icon}</span>{label}
                  </div>
                ))}
              </div>
              <div className="ec-chaos-arrow"><span className="material-symbols-outlined">south</span></div>
              <div className="ec-unified-card">
                <div className="ec-unified-glow" />
                <div className="ec-unified-head">
                  <div className="ec-window-logo">E</div>
                  <div>
                    <strong style={headlineStyle}>EventCure</strong>
                    <small>One operational workspace</small>
                  </div>
                  <span className="ec-live-chip"><span className="ec-live-dot" /> Live</span>
                </div>
                <div className="ec-unified-items">
                  {["Guests", "Rooms", "Transport", "Services", "Team"].map((x) => <span key={x}>{x}</span>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT INTERACTIVE */}
        <section className="ec-section ec-product-section" id="product">
          <div className="ec-container">
            <div className="ec-section-heading">
              <span className="ec-eyebrow">THE PLATFORM</span>
              <h2 style={headlineStyle}>Everything moving. <span>One operational picture.</span></h2>
              <p>Stop switching between tools to understand what is happening. EventCure turns every operational layer into one live workspace.</p>
            </div>

            <div className="ec-interactive-product">
              <div className="ec-module-nav">
                {productModules.map((module) => (
                  <button
                    key={module.key}
                    onClick={() => setActiveModule(module.key)}
                    className={activeModule === module.key ? "active" : ""}
                  >
                    <span className="material-symbols-outlined">{module.icon}</span>
                    <span>{module.label}</span>
                    <span className="material-symbols-outlined arrow">chevron_right</span>
                  </button>
                ))}
              </div>

              <div className="ec-module-stage">
                <div className={`ec-stage-glow ${active.accent}`} />
                <div className="ec-stage-copy">
                  <span className="ec-module-tag">{active.label}</span>
                  <h3 style={headlineStyle}>{active.title}</h3>
                  <p>{active.copy}</p>
                  <div className="ec-stage-metric">
                    <strong style={headlineStyle}>{active.metric}</strong>
                    <span>{active.metricLabel}</span>
                  </div>
                </div>

                <div className="ec-module-demo">
                  {active.key === "guests" && (
                    <div className="ec-demo-guest">
                      <div className="ec-demo-toolbar"><span>Guest directory</span><span className="ec-search">⌕ Search guests</span></div>
                      {["Eleanor Vance · VIP", "Marcus Thorne · Speaker", "Sofia Bennett · Guest"].map((x, i) => (
                        <div className="ec-demo-row" key={x}>
                          <div className="ec-mini-avatar">{x[0]}</div>
                          <strong>{x}</strong>
                          <span>{i === 0 ? "Arrived" : i === 1 ? "Expected" : "Confirmed"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {active.key === "transport" && (
                    <div className="ec-demo-map">
                      <div className="ec-map-grid" />
                      <div className="ec-route route-a" />
                      <div className="ec-route route-b" />
                      <div className="ec-map-pin pin-a"><span className="material-symbols-outlined">flight</span></div>
                      <div className="ec-map-pin pin-b"><span className="material-symbols-outlined">hotel</span></div>
                      <div className="ec-vehicle"><span className="material-symbols-outlined">directions_car</span> Van-03</div>
                      <div className="ec-map-card"><b>Van-03</b><span>Airport → Hotel</span><strong>ETA 14:22</strong></div>
                    </div>
                  )}
                  {active.key === "services" && (
                    <div className="ec-demo-service">
                      <div className="ec-service-top"><span>Active requests</span><b>05</b></div>
                      {[
                        ["Extra Towels", "High", "15m"],
                        ["Airport Pickup", "Normal", "28m"],
                        ["Dietary Request", "High", "08m"],
                      ].map(([name, priority, sla]) => (
                        <div className="ec-service-row" key={name}>
                          <span className="ec-service-dot" />
                          <div><strong>{name}</strong><small>Assigned to Operations</small></div>
                          <b className={priority === "High" ? "priority" : ""}>{priority}</b>
                          <span>{sla}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {active.key === "rooms" && (
                    <div className="ec-demo-rooms">
                      <div className="ec-room-summary"><span>ROOM BLOCK A</span><strong>88 / 100</strong></div>
                      <div className="ec-room-grid">
                        {Array.from({ length: 30 }, (_, i) => <i key={i} className={i > 23 ? "free" : i % 7 === 0 ? "vip" : ""} />)}
                      </div>
                      <div className="ec-room-legend"><span><i className="occupied" /> Assigned</span><span><i className="free" /> Available</span><span><i className="vip" /> VIP</span></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="ec-section ec-workflow" id="how-it-works">
          <div className="ec-container">
            <div className="ec-section-heading centered">
              <span className="ec-eyebrow">HOW IT WORKS</span>
              <h2 style={headlineStyle}>From arrival <span>to resolution.</span></h2>
              <p>Every handoff becomes visible, actionable and recorded.</p>
            </div>

            <div className="ec-flow">
              {flow.map(([icon, label], i) => (
                <div className="ec-flow-step" key={label}>
                  <div className={`ec-flow-node ${i === 1 ? "active" : ""}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                    <small>0{i + 1}</small>
                  </div>
                  <strong>{label}</strong>
                  {i < flow.length - 1 && <div className="ec-flow-line"><i /></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MODULE GRID */}
        <section className="ec-section ec-modules">
          <div className="ec-container">
            <div className="ec-section-heading">
              <span className="ec-eyebrow">OPERATIONAL MODULES</span>
              <h2 style={headlineStyle}>Built around <span>the work teams actually do.</span></h2>
            </div>

            <div className="ec-module-grid">
              {modules.map(([icon, title, data], index) => (
                <div className="ec-feature-card" key={title} style={{ "--delay": `${index * 70}ms` }}>
                  <div className="ec-card-shine" />
                  <div className="ec-feature-top">
                    <div className="ec-feature-icon"><span className="material-symbols-outlined">{icon}</span></div>
                    <span>0{index + 1}</span>
                  </div>
                  <h3 style={headlineStyle}>{title}</h3>
                  <div className="ec-code-line" style={monoStyle}>{data}</div>
                  <div className="ec-feature-bottom"><span>Open module</span><span className="material-symbols-outlined">arrow_outward</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="ec-section ec-audience" id="use-cases">
          <div className="ec-container">
            <div className="ec-section-heading centered">
              <span className="ec-eyebrow">BUILT FOR THE OPERATION</span>
              <h2 style={headlineStyle}>Everyone sees the same event.<span>Everyone knows what to do next.</span></h2>
            </div>

            <div className="ec-audience-grid">
              {audiences.map(([title, tag, copy, icon]) => (
                <div className="ec-audience-card" key={title}>
                  <div className="ec-audience-icon"><span className="material-symbols-outlined">{icon}</span></div>
                  <span className="ec-audience-tag">{tag}</span>
                  <h3 style={headlineStyle}>{title}</h3>
                  <p>{copy}</p>
                  <span className="ec-card-arrow material-symbols-outlined">arrow_forward</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASE MARQUEE */}
        <div className="ec-dark-marquee">
          <div className="ec-dark-marquee-track">
            {["Corporate Summits", "Global Conferences", "Luxury Weddings", "VIP Retreats", "Multi-day Events", "Hospitality Operations", "Corporate Summits", "Global Conferences", "Luxury Weddings", "VIP Retreats"].map((x, i) => (
              <span key={`${x}-${i}`}>{x}<b>✦</b></span>
            ))}
          </div>
        </div>

        {/* BETA */}
        <section className="ec-section ec-beta" id="beta">
          <div className="ec-container ec-beta-inner">
            <div>
              <span className="ec-eyebrow">EARLY ACCESS</span>
              <h2 style={headlineStyle}>Get EventCure into <span>your next event.</span></h2>
              <p>We're building with event teams, not guessing from the sidelines. Use the product on a real workflow and help shape what comes next.</p>
              <Link to="/login" className="ec-btn ec-btn-dark">
                Request Beta Access <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

            <div className="ec-next-card">
              <div className="ec-next-head"><span>WHAT HAPPENS NEXT?</span><span className="ec-live-dot" /></div>
              {[
                ["01", "Request access", "Tell us about your event operation."],
                ["02", "Run a workflow", "Use EventCure on a real operation."],
                ["03", "Shape the product", "Send feedback directly to the team."],
              ].map(([n, title, copy]) => (
                <div className="ec-next-row" key={n}>
                  <b>{n}</b><div><strong>{title}</strong><span>{copy}</span></div>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="ec-section ec-faq" id="faq">
          <div className="ec-container ec-faq-layout">
            <div>
              <span className="ec-eyebrow">FAQ</span>
              <h2 style={headlineStyle}>Before you <span>join the beta.</span></h2>
              <p>Still evaluating the fit? Here's the operational distinction that matters.</p>
            </div>
            <div className="ec-faq-list">
              {faqs.map(([q, a], i) => {
                const open = openFaq === i;
                return (
                  <div className={`ec-faq-item ${open ? "open" : ""}`} key={q}>
                    <button onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}>
                      <span>{q}</span><span className="material-symbols-outlined">{open ? "remove" : "add"}</span>
                    </button>
                    <div className="ec-faq-answer"><p>{a}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="ec-final">
          <div className="ec-final-noise" />
          <div className="ec-container ec-final-inner">
            <span className="ec-eyebrow light">READY FOR THE NEXT EVENT?</span>
            <h2 style={headlineStyle}>Give your operations desk<br /><span>a better system.</span></h2>
            <p>Bring guests, rooms, transport, services and team execution into one live operational workspace.</p>
            <Link to="/login" className="ec-btn ec-btn-light">
              Request Beta Access <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="ec-footer">
        <div className="ec-container ec-footer-grid">
          <div>
            <img src="/event-logo-with-icon-and-name-with-dark-bg.png" alt="EventCure" className="ec-footer-logo" />
            <p>Event operations, organised.</p>
            <small>© 2026 EventCure. All rights reserved.</small>
          </div>
          <div className="ec-founder">
            <span>FOUNDER & CEO</span>
            <a href="https://kushdeveloper.me" target="_blank" rel="noopener noreferrer">Kush Developer ↗</a>
            <small>Built with precision.</small>
          </div>
          <div className="ec-footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/manual">Support</Link>
            <Link to="/privacy">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}