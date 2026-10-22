import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import "./iso.css";
import "./journey.css";
import { ART_SVG, WORLD } from "./journey.art.js";
import { iso } from "./iso-kit.mjs";
import { STAGES, STAGE_COUNT, LOOP_SECONDS, journey, readout, ariaText } from "./journey.model.js";

const { P, AXES, VIEW, PINS } = WORLD;

const HOLD_MS = 7000; // after a touch, autoplay waits this long
const SEEK_TARGET = 0.9; // a stage chip shows the stage with its action under way
const REST_TAU = 2.8; // pose shown for reduced motion
const FOLLOW_ZOOM = 2.1; // phone camera zoom

// A world translation as a screen translation (the camera is linear).
const mv = (dx, dy, dz) =>
  `translate(${(dx * AXES.x[0] + dy * AXES.y[0] + dz * AXES.z[0]).toFixed(2)} ${(dx * AXES.x[1] + dy * AXES.y[1] + dz * AXES.z[1]).toFixed(2)})`;

const MOVERS = ["plane", "car", "guest", "staff", "key", "gate", "staffDoor", "bell", "folio"];
const FADERS = ["plane", "guest", "staff", "key", "rack", "reader", "serviceLamp", "towels", "scan"];

// While the car drives, the guest sits inside it (between the car's far and near layers).
const guestSlotOf = (s) => (s.riding ? "car" : "actors");

export default function GuestJourney() {
  const stageRef = useRef(null);
  const innerRef = useRef(null);
  const readoutRef = useRef(null);
  const scrubRef = useRef(null);
  const chipRefs = useRef([]);
  const pinRefs = useRef([]);
  const leaderRefs = useRef([]);
  const ctl = useRef(null);
  const reduced = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const [playing, setPlaying] = useState(!reduced);
  const markup = useMemo(() => ({ __html: ART_SVG }), []);

  useLayoutEffect(() => {
    const svg = stageRef.current?.querySelector("svg");
    if (!svg) return undefined;
    const part = (name) => svg.querySelector(`[data-part="${name}"]`);
    const el = Object.fromEntries([...new Set([...MOVERS, ...FADERS])].map((n) => [n, part(n)]));
    const slots = { car: svg.querySelector('[data-slot="car"]'), actors: svg.querySelector("[data-actors]") };
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 700px)");

    let tau = reduced ? REST_TAU : 0;
    let seekTo = null;
    let holdUntil = 0;
    let userPaused = reduced;
    let inView = false;
    let raf = 0;
    let last = 0;
    let drawn = -1;
    let lastStage = -1;
    let lastText = "";
    let lastOrder = "";
    const cam = { x: 0, y: 0, s: 1 };

    const draw = () => {
      const s = journey(tau);

      // moving parts: translate and fade
      MOVERS.forEach((name) => {
        const p = s[name];
        if (!el[name] || !p) return;
        // a guest inside the car is a child of the car's group, so the car's own movement is already applied to them
        if (name === "guest" && s.riding) el[name].setAttribute("transform", mv(p.x - s.car.x, p.y - s.car.y, p.z));
        else el[name].setAttribute("transform", mv(p.x || 0, p.y || 0, p.z || 0));
      });
      FADERS.forEach((name) => {
        const p = s[name];
        if (el[name] && p && p.o !== undefined) el[name].style.opacity = p.o < 0.01 ? "0" : p.o.toFixed(3);
      });

      // the guest moves between layers; the actors in the open are sorted by depth
      const where = guestSlotOf(s);
      const target = slots[where];
      if (target && el.guest.parentNode !== target) target.appendChild(el.guest);
      const actors = [
        [el.car, s.car.x + s.car.y],
        [el.staff, s.staff.x + s.staff.y],
      ];
      if (where === "actors") actors.push([el.guest, s.guest.x + s.guest.y]);
      actors.push([el.key, s.key.x + s.key.y + 0.6]);
      actors.sort((a, b) => a[1] - b[1]);
      const order = `${where}:${actors.map(([node]) => node.getAttribute("data-part")).join(",")}`;
      if (order !== lastOrder) {
        lastOrder = order;
        actors.forEach(([node]) => slots.actors.appendChild(node));
      }

      const text = readout(s);
      if (text !== lastText && readoutRef.current) {
        readoutRef.current.textContent = text;
        lastText = text;
      }
      if (s.stage !== lastStage) {
        lastStage = s.stage;
        chipRefs.current.forEach((chip, index) => {
          if (!chip) return;
          if (index === s.stage) chip.setAttribute("aria-current", "step");
          else chip.removeAttribute("aria-current");
        });
        PINS.forEach((pin, index) => {
          const on = pin.stages.includes(s.stage);
          [pinRefs.current[index], leaderRefs.current[index]].forEach((node) => {
            if (!node) return;
            if (on) node.setAttribute("data-active", "");
            else node.removeAttribute("data-active");
          });
        });
        scrubRef.current?.setAttribute("aria-valuetext", ariaText(s));
      }
      if (scrubRef.current) {
        scrubRef.current.value = String(s.tau);
        scrubRef.current.style.setProperty("--fill", `${((s.tau / STAGE_COUNT) * 100).toFixed(2)}%`);
      }
      return s;
    };

    // On a phone the whole diorama is too small to read, so the camera follows the guest.
    const follow = (s, dt) => {
      const inner = innerRef.current;
      const box = stageRef.current;
      if (!inner || !box) return;
      if (!narrow.matches) {
        if (inner.style.transform) inner.style.transform = "";
        return;
      }
      const cw = box.clientWidth;
      const ch = box.clientHeight;
      const sh = inner.offsetHeight; // the art keeps its own aspect ratio; the window is taller on a phone
      const [gx, gy] = iso([s.guest.x, s.guest.y, s.guest.z + 10], P);
      const px = (gx / VIEW.width) * cw;
      const py = (gy / VIEW.height) * sh;
      const sc = FOLLOW_ZOOM;
      const tx = Math.min(0, Math.max(cw - cw * sc, cw / 2 - sc * px));
      const ty = Math.min(0, Math.max(ch - sh * sc, ch * 0.55 - sc * py));
      const k = 1 - Math.exp(-dt / 0.25);
      cam.x += (tx - cam.x) * k;
      cam.y += (ty - cam.y) * k;
      cam.s = sc;
      inner.style.transform = `translate(${cam.x.toFixed(1)}px, ${cam.y.toFixed(1)}px) scale(${sc})`;
    };

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (seekTo !== null) {
        const diff = seekTo - tau;
        if (mq.matches || Math.abs(diff) < 0.003) {
          tau = seekTo;
          seekTo = null;
        } else {
          const step = diff * (1 - Math.exp(-dt / 0.16));
          const cap = 4 * dt;
          tau += Math.max(-cap, Math.min(cap, step));
        }
      } else if (!userPaused && !mq.matches && now > holdUntil) {
        tau = (tau + (dt * STAGE_COUNT) / LOOP_SECONDS) % STAGE_COUNT;
      }
      if (tau !== drawn) {
        drawn = tau;
        follow(draw(), dt);
      } else if (narrow.matches) {
        follow(journey(tau), dt);
      }
    };

    const start = () => {
      if (raf || !inView || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) start();
        else stop();
      },
      { threshold: 0.12 },
    );
    observer.observe(stageRef.current);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    ctl.current = {
      seek(stage) {
        seekTo = (((stage % STAGE_COUNT) + STAGE_COUNT) % STAGE_COUNT) + SEEK_TARGET;
        holdUntil = performance.now() + HOLD_MS;
        if (mq.matches) {
          tau = seekTo;
          seekTo = null;
          follow(draw(), 1);
        }
      },
      scrub(value) {
        tau = Math.min(STAGE_COUNT - 0.0001, Math.max(0, value));
        seekTo = null;
        holdUntil = performance.now() + HOLD_MS;
        drawn = tau;
        follow(draw(), 1);
      },
      toggle() {
        userPaused = !userPaused;
        holdUntil = 0;
        return !userPaused;
      },
      stage: () => journey(tau).stage,
    };

    follow(draw(), 1);
    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      ctl.current = null;
    };
  }, [reduced]);

  const onKey = useCallback((event) => {
    const c = ctl.current;
    if (!c) return;
    const now = c.stage();
    const go = { ArrowRight: now + 1, ArrowUp: now + 1, ArrowLeft: now - 1, ArrowDown: now - 1, Home: 0, End: STAGE_COUNT - 1 }[event.key];
    if (go === undefined) return;
    event.preventDefault();
    c.seek(go);
  }, []);

  return (
    <figure className="ecj" aria-label="Interactive figure: a guest's trip from landing to the flight home, through the hotel">
      <div className="ecj-plate">
        <span className="ecj-corner" data-corner="fig" aria-hidden="true">Fig 1</span>
        <span className="ecj-corner" data-corner="title" aria-hidden="true">One guest, one trip</span>
        <span className="ecj-corner" data-corner="hint" aria-hidden="true">Pick a stage · drag the timeline</span>
        <span className="ecj-corner" data-corner="readout" ref={readoutRef} aria-hidden="true" />
        <div className="ecj-stage" ref={stageRef}>
          <div className="ecj-inner" ref={innerRef}>
            <div className="ecj-art" dangerouslySetInnerHTML={markup} />
            <svg className="ecj-leaders" viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} preserveAspectRatio="none" aria-hidden="true">
              {PINS.map((pin, index) => (
                <g
                  key={pin.id}
                  ref={(node) => {
                    leaderRefs.current[index] = node;
                  }}
                >
                  <line x1={pin.ax} y1={pin.ay} x2={pin.lx} y2={pin.ly} />
                  <circle cx={pin.ax} cy={pin.ay} r="2.4" />
                </g>
              ))}
            </svg>
            <div className="ecj-pins" aria-hidden="true">
              {PINS.map((pin, index) => (
                <span
                  key={pin.id}
                  className="ecj-pin"
                  ref={(node) => {
                    pinRefs.current[index] = node;
                  }}
                  style={{ left: `${(pin.lx / VIEW.width) * 100}%`, top: `${(pin.ly / VIEW.height) * 100}%` }}
                >
                  <b>{pin.n}</b>
                  <i>{pin.text}</i>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ecj-controls">
        <div className="ecj-chips" role="group" aria-label="Journey stages">
          {STAGES.map((stage, index) => (
            <button
              key={stage.id}
              type="button"
              className="ecj-chip"
              ref={(node) => {
                chipRefs.current[index] = node;
              }}
              onClick={() => ctl.current?.seek(index)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">{stage.icon}</span>
              {stage.label}
              <small>0{index + 1}</small>
            </button>
          ))}
        </div>
        <div className="ecj-rail">
          <button
            type="button"
            className="ecj-play"
            aria-label={playing ? "Pause the journey" : "Play the journey"}
            onClick={() => setPlaying(Boolean(ctl.current?.toggle()))}
          >
            <span className="material-symbols-outlined" aria-hidden="true">{playing ? "pause" : "play_arrow"}</span>
          </button>
          <input
            ref={scrubRef}
            className="ecj-scrub"
            type="range"
            min="0"
            max={STAGE_COUNT}
            step="any"
            defaultValue="0"
            aria-label="Guest journey timeline"
            onInput={(event) => ctl.current?.scrub(Number(event.currentTarget.value))}
            onKeyDown={onKey}
          />
        </div>
      </div>
      <figcaption className="ecj-caption">
        One guest, start to finish: the flight lands, a car takes them to the hotel, they check in, get a key, walk to the room, ask for service and check out, then ride back to the airport. Sample guest and numbers; your events show real ones.
      </figcaption>
    </figure>
  );
}
