// Builds the static art of the EventCure guest-journey diorama.
// Run:  node scripts/build-guest-journey.mjs   (or: npm run journey:build)
// Output: src/components/journey/journey.art.js  (SVG string + camera + label anchors, shipped to the page)
//
// The scene: an airport on the left (runway, plane with built-in stairs, terminal, tower), a road along the front,
// and a hotel on the right drawn as a dollhouse (lobby on the ground floor, a guest room on the upper floor, a lift).
// One guest walks the whole story; a car, a plane and a housekeeper move too. Parts only ever translate or fade.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../src/components/journey/iso-kit.mjs";
import * as G from "../src/components/journey/lathe.mjs";
import { PLACE as PL } from "../src/components/journey/journey.model.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "../src/components/journey/journey.art.js");

const WIDTH = 940;
const HEIGHT = 560;

// ── World ───────────────────────────────────────────────────────────────
const PLATE = { x: -210, y: -122, w: 416, d: 186, r: 14 };
const PLATE_H = 9;
const FOOT_H = 5;
const F1 = PL.floor1; // lobby floor / sidewalk top
const FR = PL.gateIn.z; // raised floor of the guest room
const ROAD_Z = 0.6;
const HOTEL = { x: 50, y: -84, w: 126, d: 70 }; // footprint: lobby in front, guest room behind
const WALL_TOP = F1 + 37;
const PART_Y = -57.2; // partition between lobby and room (2.4 thick)
const PART_FRONT = PART_Y + 2.4;
const GATE = { x0: 130, x1: 148 };

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [100, -84, 52],
    [176, -84, 44],
    [-34, -54, 44],
    [-172, -72, 28],
    [-172, 12, 28],
  ],
  WIDTH,
  HEIGHT,
  { pad: 28, azimuth: 36, elevation: 33 },
);

const at = (point) => k.iso(point, P);
const part = (name, children, extra = "") => `<g data-part="${name}"${extra}>${children}</g>`;
const slot = (name, children = "") => `<g data-slot="${name}">${children}</g>`;
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const wrapClass = (cls, children) => `<g class="${cls}">${children}</g>`;

const slab = (plan, z, h, tone = "mid", opts = {}) => {
  const { steps = 4, bevel = 0.5, ...style } = opts;
  return S(k.slabOf({ r: Math.min(1.2, plan.w / 3, plan.d / 3), ...plan }, z, h, P, steps, bevel), { tone, ...style });
};
const box = (x, y, w, d, z, h, tone = "mid", opts = {}) => slab({ x, y, w, d }, z, h, tone, opts);
const post = (x, y, w, z, h, tone = "mid", opts = {}) => slab({ x: x - w / 2, y: y - w / 2, w, d: w, r: Math.min(1, w / 3) }, z, h, tone, opts);
const cyl = (x, y, r, z, h, tone = "mid", opts = {}) => {
  const { steps = 28, bevel = 0.4, ...style } = opts;
  return S(k.cylinder(x, y, r, z, h, P, steps, bevel), { tone, ...style });
};
// A rectangle drawn in the plane of a +y face (a window, a door, a panel). x in world, z is height.
const faceMatrix = (y) => k.sideMatrix([0, y], 0, P, "left");
const faceRect = (cls, x, z, w, h, rx = 1) => `<rect class="${cls}" x="${x}" y="${-(z + h)}" width="${w}" height="${h}" rx="${rx}"/>`;
const faceLine = (x1, z1, x2, z2, tone = "faint") => `<path class="iso-line" data-tone="${tone}" d="M${x1} ${-z1}L${x2} ${-z2}"/>`;

// ── People ─────────────────────────────────────────────────────────────
// A human, built around (x, y) with feet at z0. About 21 units tall.
// outfit: a colour class for the torso and arms ("ecj-guest" is the brand orange; others are uniforms).
function human(x, y, z0, { outfit = "ecj-uniform", lit = false, hair = "ecj-hair", suitcase = false } = {}) {
  const o = [];
  const legs = [
    cyl(x - 1.8, y, 1.5, z0, 7.4, "hi", { steps: 14, bevel: 0.2, crease: "none" }),
    cyl(x + 1.8, y, 1.5, z0, 7.4, "hi", { steps: 14, bevel: 0.2, crease: "none" }),
    cyl(x - 1.8, y + 0.4, 1.9, z0, 1.2, "hi", { steps: 14, bevel: 0.2 }),
    cyl(x + 1.8, y + 0.4, 1.9, z0, 1.2, "hi", { steps: 14, bevel: 0.2 }),
  ].join("");
  o.push(wrapClass("ecj-trousers", legs));
  const body = [
    cyl(x - 4.5, y, 1.1, z0 + 8.2, 7.2, "hi", { steps: 12, bevel: 0.2, crease: "none", lit }),
    cyl(x, y, 3.7, z0 + 7.4, 9.4, "hi", { steps: 22, bevel: 0.7, lit }),
    cyl(x + 4.5, y, 1.1, z0 + 8.2, 7.2, "hi", { steps: 12, bevel: 0.2, crease: "none", lit }),
  ].join("");
  o.push(wrapClass(outfit, body));
  o.push(wrapClass("ecj-skin", cyl(x, y, 1.2, z0 + 16.6, 1.2, "mid", { steps: 12, bevel: 0.1 }) + cyl(x, y, 2.9, z0 + 17.4, 4, "mid", { steps: 20, bevel: 1.3 })));
  o.push(wrapClass(hair, cyl(x, y - 0.3, 3, z0 + 20, 1.6, "hi", { steps: 20, bevel: 0.6 })));
  if (suitcase) {
    o.push(wrapClass("ecj-case", slab({ x: x + 6, y: y - 1.5, w: 3.4, d: 7, r: 0.7 }, z0 + 0.2, 6.6, "hi", { steps: 3, bevel: 0.3 }) + L(k.lineOnTop([x + 7, y - 0.8], [x + 7, y + 4.4], z0 + 6.8, P), { tone: "faint" })));
  }
  return o.join("");
}

// ── Base: plate on feet, grass, edge line, screws ─────────────────────
function base() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  for (const [x, y] of byDepth(k.corners(PLATE, 30))) {
    out.push(cyl(x, y, 9, -PLATE_H - FOOT_H, 1.8, "lo"));
    out.push(cyl(x, y, 7, -PLATE_H - FOOT_H + 1.8, FOOT_H - 1.8, "mid"));
  }
  const grass = [S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 10, 1.6), { tone: "lo" })];
  grass.push(L(k.planOutline(k.insetPlan(PLATE, 6), 0, P, 10), { tone: "faint" }));
  out.push(wrapClass("ecj-grass", grass.join("")));
  const screws = k.corners(PLATE, 12);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.6, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.55 }));
  return out.join("");
}

// ── Road, sidewalks, runway ───────────────────────────────────────────
function ground() {
  const road = [];
  const R = { x: -142, y: -6, w: 346, d: 22, r: 0.4 };
  road.push(S(k.slabOf(R, 0, ROAD_Z, P, 2, 0), { tone: "lo", crease: "none" }));
  const dashes = [];
  for (let x = -130; x < 184; x += 16) dashes.push(k.lineOnTop([x, 5], [x + 8, 5], ROAD_Z, P));
  road.push(L(dashes.join(""), { tone: "lo" }));
  road.push(L(k.lineOnTop([R.x + 2, -4.6], [R.x + R.w - 2, -4.6], ROAD_Z, P) + k.lineOnTop([R.x + 2, 14.6], [R.x + R.w - 2, 14.6], ROAD_Z, P), { tone: "faint" }));
  // runway along y, with a centre line and threshold stripes
  const run = { x: -198, y: -118, w: 52, d: 160, r: 1 };
  road.push(S(k.slabOf(run, 0, 0.5, P, 3, 0), { tone: "lo", crease: "none" }));
  const rd = [];
  for (let y = -112; y < 36; y += 14) rd.push(k.lineOnTop([-172, y], [-172, y + 7], 0.5, P));
  road.push(L(rd.join(""), { tone: "mid" }));
  road.push(L(k.lineOnTop([-196, -116], [-196, 40], 0.5, P) + k.lineOnTop([-148, -116], [-148, 40], 0.5, P), { tone: "faint" }));
  const walk = [];
  const sidewalks = [
    { x: -142, y: -18, w: 106, d: 12 }, // terminal curb
    { x: 44, y: -14, w: 134, d: 8 }, // hotel
  ];
  for (const sw of sidewalks) {
    walk.push(S(k.slabOf({ r: 0.6, ...sw }, 0, F1, P, 3, 0.2), { tone: "lo", crease: "faint" }));
  }
  return wrapClass("ecj-road", road.join("")) + walk.join("");
}

// ── Plane (built at rest, nose toward -y, away from the viewer; moves by translation) ──
// Local coordinate l runs from the tail (-42) to the nose (+42); world y = YC - l.
const YC = -30;
function plane() {
  const cx = PL.planeRest.x;
  const Y = (l) => YC - l;
  const zA = 10.5;
  const out = [];
  const Fb = G.frameAlong([cx, Y(-42), zA], [0, -1, 0]);
  const gear = (x, l) => {
    const o = [post(x, Y(l), 1.4, 2.4, 4.4, "mid")];
    const Fw = G.frameAlong([x - 1.8, Y(l), 2.2], [1, 0, 0]);
    o.push(S(G.disc(0, 3.6, 2.2, Fw, P), { tone: "hi", crease: "faint" }));
    return o.join("");
  };
  const wing = (sign) => {
    const px = (v) => cx + sign * v;
    const poly = [[px(5), Y(14)], [px(5), Y(-7)], [px(31), Y(-13)], [px(31), Y(0)]];
    const F = G.frameOf([0, 0, 7.4], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
    return S(G.prismOf(F, poly, 0, 1.5, P), { tone: "mid", crease: "faint" });
  };
  const engine = (sign) => {
    const Fe = G.frameAlong([cx + sign * 14, Y(-12), 6.2], [0, -1, 0]);
    return S(G.disc(0, 10, 2.6, Fe, P), { tone: "hi", crease: "faint" });
  };
  const stab = (sign) => {
    const px = (v) => cx + sign * v;
    const poly = [[px(3), Y(-32)], [px(3), Y(-39)], [px(13), Y(-42)], [px(13), Y(-37)]];
    const F = G.frameOf([0, 0, 11.4], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
    return S(G.prismOf(F, poly, 0, 1.2, P), { tone: "mid", crease: "faint" });
  };
  // far side first, then the fuselage, then the near side
  out.push(wing(-1), engine(-1), stab(-1), gear(cx - 6, -4));
  const finF = G.frameOf([cx - 0.7, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  out.push(S(G.prismOf(finF, [[Y(-42), 13], [Y(-29), 13], [Y(-34.5), 28], [Y(-42.6), 28]], 0, 1.4, P), { tone: "hi", crease: "faint", lit: true }));
  out.push(S(G.lathe([[0, 0.9], [4, 1.9], [12, 4.2], [22, 5.9], [32, 6.4], [62, 6.4], [72, 6], [79, 4.6], [83, 2.2], [84.4, 0]], Fb, P, { bevel: 0.5 }), { tone: "mid", crease: "faint" }));
  out.push(gear(cx, 34), gear(cx + 6, -4));
  out.push(stab(1), wing(1), engine(1));
  const wins = [];
  for (let l = -34; l <= 34; l += 5.2) if (Math.abs(l - 18) > 4) wins.push(at([cx + 6.35, Y(l), zA + 1.3]));
  out.push(D(wins, { size: 0.5, tone: "lo" }));
  out.push(D([at([cx + 4.4, Y(39.5), zA + 1.4]), at([cx + 2.2, Y(40.4), zA + 1.4])], { size: 0.8, tone: "hi" }));
  // built-in airstairs at the door (l = 18): platform, then four steps down to the apron
  const dy = Y(18);
  out.push(box(cx + 6, dy - 3, 4.2, 6, 8.4, 0.8, "mid", { steps: 3, bevel: 0.2 }));
  out.push(post(cx + 6.4, dy - 3, 0.9, 9.2, 5, "hi", { crease: "none" }), post(cx + 6.4, dy + 3, 0.9, 9.2, 5, "hi", { crease: "none" }));
  [7.2, 5.1, 3.1, 1.3].forEach((top, i) => out.push(box(cx + 10.2 + i * 4, dy - 3, 4, 6, 0.5, top - 0.5, "mid", { steps: 3, bevel: 0.2 })));
  return out.join("");
}

// ── Terminal, tower, canopy ───────────────────────────────────────────
function terminal() {
  const T = { x: -116, y: -62, w: 90, d: 44 };
  const out = [];
  out.push(S(k.slabOf({ r: 1.4, ...T }, F1 - 0.2, 24, P, 4, 0.6), { tone: "mid" }));
  out.push(wrapClass("ecj-roof", slab({ x: T.x - 3, y: T.y - 3, w: T.w + 6, d: T.d + 6, r: 2.4 }, 24, 3, "hi", { steps: 5, bevel: 0.7 })));
  // windows and the entrance, drawn on the front face
  const fy = T.y + T.d;
  const wins = [];
  for (let i = 0; i < 8; i += 1) {
    const x = T.x + 5 + i * 10.6;
    if (x > -96 && x < -78) continue;
    wins.push(faceRect("ecj-glass", x, 7, 8.4, 11, 1));
  }
  wins.push(faceRect("ecj-door", -91, 1.2, 12, 14, 1.2));
  wins.push(faceLine(-85, 1.2, -85, 15.2, "lo"));
  out.push(`<g transform="${faceMatrix(fy)}">${wins.join("")}</g>`);
  // canopy over the curb
  out.push(post(-102, -13, 1.8, F1, 14.4, "mid"), post(-68, -13, 1.8, F1, 14.4, "mid"));
  out.push(slab({ x: -106, y: -20, w: 42, d: 9, r: 1.4 }, 15.6, 2.2, "hi", { steps: 4, bevel: 0.5 }));
  // control tower
  out.push(cyl(-34, -54, 4.4, 0, 30, "mid", { steps: 28, bevel: 0.3 }));
  out.push(cyl(-34, -54, 7.6, 30, 6.4, "hi", { steps: 32, bevel: 1 }));
  out.push(cyl(-34, -54, 6, 36.4, 1.6, "mid", { steps: 28, bevel: 0.4 }));
  out.push(L(k.ring(-34, -54, 5.2, 36.4, P, 28), { tone: "lo" }));
  return out.join("");
}

// ── Trees ─────────────────────────────────────────────────────────────
function tree(x, y, s = 1) {
  const o = [cyl(x, y, 1.3 * s, 0, 5 * s, "mid", { steps: 12, bevel: 0.1 })];
  o.push(cyl(x, y, 5.6 * s, 4 * s, 7 * s, "mid", { steps: 22, bevel: 2.2 * s }));
  o.push(cyl(x, y, 3.6 * s, 10.4 * s, 4.6 * s, "mid", { steps: 20, bevel: 1.6 * s }));
  return o.join("");
}
const trees = (list) => wrapClass("ecj-tree", list.map(([x, y, s]) => tree(x, y, s)).join(""));

// ── Car (built at the origin: moves by translation along the road) ────
function car() {
  const far = [];
  const near = [];
  const zG = ROAD_Z;
  const zA = zG + 3.6;
  const wheel = (x, side) => {
    const F = G.frameAlong([x, 0, zA], [0, 1, 0]);
    const s0 = side > 0 ? 9.6 : -12.4;
    const s1 = side > 0 ? 12.4 : -9.6;
    const hub = at([x, side > 0 ? 12.4 : -12.4, zA]);
    return S(G.disc(s0, s1, 3.6, F, P), { tone: "hi", crease: "faint" }) + D([hub], { size: 0.7, tone: "mid" });
  };
  far.push(wheel(-14.5, -1), wheel(14.5, -1));
  far.push(box(-24, -10, 48, 20, zG + 2.2, 1.6, "mid", { steps: 5, bevel: 0.3, r: 4 })); // floor / chassis
  far.push(box(-24, -10, 10, 20, zG + 3.8, 4.6, "mid", { steps: 5, bevel: 0.5, r: 3 })); // boot
  far.push(box(-24, -10, 48, 2, zG + 3.8, 5, "mid", { steps: 3, bevel: 0.3, r: 1 })); // far side wall
  far.push(box(-9, -8, 2.6, 16, zG + 5.4, 6, "mid", { steps: 3, bevel: 0.3, r: 1 })); // seat back
  near.push(box(-24, 8, 48, 2, zG + 3.8, 5, "mid", { steps: 3, bevel: 0.3, r: 1 })); // near side wall
  near.push(box(11, -10, 13, 20, zG + 3.8, 4.8, "mid", { steps: 5, bevel: 0.5, r: 3 })); // bonnet
  near.push(box(8.4, -8.6, 3.6, 17.2, zG + 5.4, 3.6, "mid", { steps: 3, bevel: 0.3, r: 0.8 })); // dashboard
  near.push(post(9.6, -8.6, 1.4, zG + 9, 6.6, "hi", { crease: "none" }), post(9.6, 8.6, 1.4, zG + 9, 6.6, "hi", { crease: "none" }));
  near.push(box(9, -8.8, 1.6, 17.6, zG + 15.4, 1.2, "hi", { steps: 3, bevel: 0.2, r: 0.5 })); // windscreen rail
  near.push(wheel(-14.5, 1), wheel(14.5, 1));
  near.push(D([at([24, -6, zG + 6.6]), at([24, 6, zG + 6.6])], { size: 0.8, tone: "hi" }));
  near.push(L(k.lineOnTop([12, 0], [22, 0], zG + 8.6, P), { tone: "faint" }));
  return `<g data-part="car"><g data-part="carFar">${far.join("")}</g>${slot("car")}<g data-part="carNear">${near.join("")}</g></g>`;
}

// ── Hotel (one storey, open from above): lobby and reception in front, the guest room behind, a gate between ──
function hotelShell() {
  const H = HOTEL;
  const out = [];
  out.push(wrapClass("ecj-tile", slab({ x: H.x - 2, y: H.y - 2, w: H.w + 4, d: H.d + 4, r: 2 }, 0, F1, "lo", { steps: 4, bevel: 0.3 })));
  // the room's raised wooden floor
  out.push(wrapClass("ecj-wood", slab({ x: H.x + 2.4, y: H.y + 2.4, w: H.w - 2.4, d: PART_Y - (H.y + 2.4), r: 0.6 }, F1, FR - F1, "mid", { steps: 3, bevel: 0.3 })));
  // back wall and west wall: their inner faces are the interior you look at
  out.push(wrapClass("ecj-hotel", S(k.slabOf({ r: 0.4, x: H.x, y: H.y, w: H.w, d: 2.4 }, F1, WALL_TOP - F1, P, 3, 0.3), { tone: "mid" }) + S(k.slabOf({ r: 0.4, x: H.x, y: H.y, w: 2.4, d: H.d }, F1, WALL_TOP - F1, P, 3, 0.3), { tone: "mid" })));
  const fy = H.y + 2.4;
  const wall = [];
  wall.push(faceRect("ecj-glass", 100, FR + 15, 22, 15, 1)); // room window above the desk
  wall.push(faceLine(111, FR + 15, 111, FR + 30, "lo"), faceLine(100, FR + 22.5, 122, FR + 22.5, "lo"));
  wall.push(faceRect("ecj-glass", 152, FR + 18, 18, 14, 1)); // window above the bed
  wall.push(faceLine(161, FR + 18, 161, FR + 32, "lo"));
  wall.push(faceRect("ecj-door", 128, FR, 10, 19.6, 1)); // staff door
  out.push(`<g transform="${faceMatrix(fy)}">${wall.join("")}</g>`);
  return out.join("");
}

// The guest room, behind the partition: bed, desk with the service bell, lamp, towels
function room() {
  const out = [];
  out.push(box(148, -81.6, 26, 22, FR, 4, "mid", { steps: 4, bevel: 0.5, r: 1.6 }));
  out.push(box(148, -81.6, 26, 2, FR, 14, "hi", { steps: 3, bevel: 0.4, r: 0.6 }));
  out.push(box(149, -79.6, 24, 20, FR + 4, 3.4, "hi", { steps: 4, bevel: 0.8, r: 2 }));
  out.push(box(151, -79.6, 8, 6, FR + 7.4, 2, "mid", { steps: 3, bevel: 0.7, r: 1.4 }), box(163, -79.6, 8, 6, FR + 7.4, 2, "mid", { steps: 3, bevel: 0.7, r: 1.4 }));
  out.push(L(k.lineOnTop([149.6, -64], [172.4, -64], FR + 7.4, P), { tone: "lo" }));
  out.push(wrapClass("ecj-wood", S(k.slabOf({ x: 100, y: -81.6, w: 22, d: 9.6, r: 1.2 }, FR, 9.4, P, 4, 0.5), { tone: "mid" })));
  out.push(L(k.planOutline(k.insetPlan({ x: 100, y: -81.6, w: 22, d: 9.6, r: 1.2 }, 1.6), FR + 9.4, P, 4), { tone: "faint" }));
  out.push(cyl(113, -76.8, 4.4, FR + 9.4, 1.4, "mid"), cyl(113, -76.8, 3.4, FR + 10.8, 2.2, "hi", { bevel: 0.5 }));
  out.push(part("bell", cyl(113, -76.8, 1.1, FR + 13, 1.8, "hi", { steps: 14, bevel: 0.3, lit: true }), ` transform="translate(0 0)"`));
  out.push(cyl(104, -76.8, 3, FR + 9.4, 1, "hi"), cyl(104, -76.8, 0.7, FR + 10.4, 7, "mid", { steps: 10 }), cyl(104, -76.8, 3.4, FR + 17.4, 3.6, "lo", { steps: 18, bevel: 1.2 }));
  out.push(`<g data-part="towels" style="opacity:0">${box(116, -80, 7, 5, FR + 9.4, 1.8, "hi", { steps: 3, bevel: 0.3, r: 0.8 })}${box(116.4, -79.6, 6.2, 4.2, FR + 11.2, 1.8, "hi", { steps: 3, bevel: 0.3, r: 0.8 })}</g>`);
  out.push(wrapClass("ecj-tree", cyl(94, -64, 3, FR, 3.6, "lo", { steps: 16, bevel: 0.4 }) + cyl(94, -64, 4.6, FR + 3.6, 7, "mid", { steps: 18, bevel: 2 })));
  return out.join("");
}

function staffDoorLeaf() {
  return part("staffDoor", box(128.4, -81.4, 9.2, 1.4, FR + 0.2, 19.6, "hi", { steps: 3, bevel: 0.3, r: 0.4 }), ` transform="translate(0 0)"`);
}

// The partition: a low wall with a tall key board at the west end, and a gate with a sliding leaf and a key reader
function partition() {
  const out = [];
  const seg = (x0, x1, h) => S(k.slabOf({ r: 0.4, x: x0, y: PART_Y, w: x1 - x0, d: 2.4 }, F1, h, P, 3, 0.3), { tone: "mid" });
  out.push(wrapClass("ecj-hotel", seg(HOTEL.x + 2.4, 86, 30) + seg(86, GATE.x0, 6) + seg(GATE.x1, HOTEL.x + HOTEL.w, 6)));
  // key board on the front face of the tall section
  const face = [faceRect("ecj-panel", 57, F1 + 11, 24, 17, 1.4)];
  for (let r = 0; r < 2; r += 1) {
    for (let c = 0; c < 5; c += 1) {
      const hx = 60 + c * 4.6;
      const hz = F1 + 16.4 + r * 6.8;
      face.push(`<circle class="ecj-hook" cx="${hx}" cy="${-hz}" r="0.7"/>`);
      face.push(faceRect("ecj-tag", hx - 1.1, hz - 4.4, 2.2, 3.6, 0.5));
    }
  }
  face.push(`<g data-part="rack" style="opacity:0">${faceRect("ecj-tag-lit", 60 + 4.6 * 2 - 1.5, F1 + 16.4 + 6.8 - 4.9, 3, 4.6, 0.6)}</g>`);
  out.push(`<g transform="${faceMatrix(PART_FRONT)}">${face.join("")}</g>`);
  // gate
  const posts = [post(GATE.x0, PART_Y + 1.2, 2.6, F1, 24, "mid", { crease: "none" }), post(GATE.x1, PART_Y + 1.2, 2.6, F1, 24, "mid", { crease: "none" })];
  const leaf = part("gate", box(GATE.x0 + 1.3, PART_FRONT - 0.2, GATE.x1 - GATE.x0 - 2.6, 1.4, F1 + 0.2, 22.4, "hi", { steps: 3, bevel: 0.3, r: 0.5 }), ` transform="translate(0 0)"`);
  const top = [
    box(GATE.x0 - 1.6, PART_Y - 0.4, GATE.x1 - GATE.x0 + 3.2, 3.2, F1 + 24, 3, "hi", { steps: 3, bevel: 0.4, r: 0.8 }),
    `<g data-part="reader" style="opacity:0">${box(GATE.x1 - 0.6, PART_FRONT + 0.4, 1.6, 1.8, F1 + 8.4, 3.4, "hi", { steps: 2, bevel: 0, lit: true, crease: "none" })}</g>`,
    box(GATE.x1 - 1, PART_FRONT - 0.2, 2, 2.4, F1 + 8, 4, "mid", { steps: 2, bevel: 0.1, r: 0.4 }),
    `<g data-part="serviceLamp" style="opacity:0">${cyl((GATE.x0 + GATE.x1) / 2, PART_Y + 1.2, 1.8, F1 + 27, 1.8, "hi", { steps: 14, bevel: 0.2, lit: true })}</g>`,
  ];
  return { body: out.join(""), posts: posts.join(""), leaf, top: top.join("") };
}

function lobby() {
  const out = [];
  // sofa along the west wall, a coffee table, plants
  out.push(wrapClass("ecj-tree", box(52.4, -46, 3, 24, F1, 9, "mid", { steps: 3, bevel: 0.4 }) + box(52.4, -46, 11, 24, F1, 5, "mid", { steps: 4, bevel: 0.6, r: 2 }) + box(55.4, -45, 6.4, 10.4, F1 + 5, 2, "hi", { steps: 3, bevel: 0.5, r: 1.2 }) + box(55.4, -33, 6.4, 10.4, F1 + 5, 2, "hi", { steps: 3, bevel: 0.5, r: 1.2 })));
  out.push(box(68, -40, 10, 16, F1, 5, "lo", { steps: 3, bevel: 0.4, r: 1.4 }));
  out.push(L(k.planOutline(k.insetPlan({ x: 68, y: -40, w: 10, d: 16, r: 1.4 }, 1.4), F1 + 5, P, 3), { tone: "faint" }));
  const plant = (x, y) => wrapClass("ecj-tree", cyl(x, y, 3, F1, 3.6, "lo", { steps: 16, bevel: 0.4 }) + cyl(x, y, 4.6, F1 + 3.6, 7, "mid", { steps: 18, bevel: 2 }));
  out.push(plant(172, -20), plant(172, -48), plant(58, -20));
  return out.join("");
}

function receptionist() {
  return human(107, -52, F1, { outfit: "ecj-suit" });
}

function reception() {
  const out = [];
  const desk = { x: 88, y: -47, w: 38, d: 9, r: 1.4 };
  out.push(wrapClass("ecj-wood", S(k.slabOf(desk, F1, 11, P, 5, 0.6), { tone: "mid" })));
  out.push(L(k.planOutline(k.insetPlan(desk, 1.8), F1 + 11, P, 5), { tone: "faint" }));
  const top = F1 + 11;
  out.push(box(98, -45, 8, 5, top, 1.2, "hi", { steps: 3, bevel: 0.3, r: 0.8 }));
  out.push(`<g data-part="scan" style="opacity:0">${box(98.8, -44.4, 6.4, 3.8, top + 1.2, 0.4, "hi", { steps: 2, bevel: 0, lit: true, crease: "none" })}</g>`);
  out.push(D(k.dotGrid(110, -45, 3, 2, 2.4, top, P), { size: 0.4, tone: "lo" }));
  const pr = { x: 117, y: -46, w: 8, d: 6, r: 1 };
  out.push(S(k.slabOf(pr, top, 3.2, P, 3, 0.4), { tone: "mid" }));
  out.push(L(k.lineOnTop([118.4, -43.8], [123.6, -43.8], top + 3.2, P), { tone: "lo" }));
  return out.join("");
}

function folioPart() {
  const top = F1 + 11 + 3.2;
  const card = box(118.6, -43.6, 4.8, 0.8, top - 0.6, 7, "hi", { steps: 2, bevel: 0.1, r: 0.3, crease: "none" });
  const poly = [];
  for (const y of [-44.2, -42.4]) poly.push(at([117.8, y, top]), at([124.2, y, top]), at([117.8, y, top + 22]), at([124.2, y, top + 22]));
  const clip = `<clipPath id="ecj-folio-clip"><path d="${hullPath(poly)}"/></clipPath>`;
  return { clip, svg: `<g clip-path="url(#ecj-folio-clip)">${part("folio", card)}</g>` };
}
function hullPath(points) {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (const p of [...pts].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  const h = [...lower.slice(0, -1), ...upper.slice(0, -1)];
  return `${h.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join("")}Z`;
}

// A hotel has no roof here: only a cap along the two walls you see from inside, and the sign on top.
function hotelCaps() {
  const H = HOTEL;
  const out = [];
  out.push(slab({ x: H.x - 1.8, y: H.y - 1.8, w: H.w + 3.6, d: 5.4, r: 1 }, WALL_TOP, 2.8, "hi", { steps: 4, bevel: 0.5 }));
  out.push(slab({ x: H.x - 1.8, y: H.y - 1.8, w: 5.4, d: H.d + 3.6, r: 1 }, WALL_TOP, 2.8, "hi", { steps: 4, bevel: 0.5 }));
  out.push(box(96, -84.4, 56, 4.4, WALL_TOP + 2.8, 11, "hi", { steps: 4, bevel: 0.6, r: 1.4 }));
  out.push(D([at([101, -80, WALL_TOP + 13.8]), at([147, -80, WALL_TOP + 13.8])], { size: 0.5, tone: "lo" }));
  return out.join("");
}

// ── Little movers built at the origin ─────────────────────────────────
const keyCard = () => part("key", box(-2.6, -1.5, 5.2, 3, 0, 0.8, "hi", { steps: 2, bevel: 0.1, r: 0.5, lit: true, crease: "none" }), ` style="opacity:0"`);
const staffWithCart = () => {
  const o = [human(0, 0, 0, { outfit: "ecj-uniform", hair: "ecj-hair-light" })];
  o.push(box(5, -4, 11, 8, 2.4, 1.2, "mid", { steps: 3, bevel: 0.3, r: 1 }));
  o.push(box(5, -4, 11, 8, 3.6, 5, "lo", { steps: 3, bevel: 0.4, r: 1 }));
  o.push(box(6, -3, 9, 6, 8.6, 1.8, "hi", { steps: 3, bevel: 0.3, r: 0.8 }), box(6.4, -2.6, 8.2, 5.2, 10.4, 1.8, "hi", { steps: 3, bevel: 0.3, r: 0.8 }));
  o.push(cyl(6.4, -3, 1.2, 0.6, 1.8, "hi", { steps: 10, bevel: 0.1 }), cyl(14.4, 3, 1.2, 0.6, 1.8, "hi", { steps: 10, bevel: 0.1 }));
  return part("staff", o.join(""), ` transform="translate(0 0)" style="opacity:0"`);
};

// ── Label anchors (HTML pins are placed over the figure) ──────────────
const PINS = [
  { id: "plane", n: 1, text: "Plane lands", at: [-172, -30, 30], to: [-128, -6], stages: [0] },
  { id: "pickup", n: 2, text: "Car pick-up", at: [-100, 5, 24], to: [-64, 52], stages: [1] },
  { id: "hotel", n: 3, text: "Hotel arrival", at: [84, -14, 26], to: [-110, 40], stages: [2] },
  { id: "checkin", n: 4, text: "Check-in", at: [104, -42, 20], to: [-30, 92], stages: [2] },
  { id: "key", n: 5, text: "Room key", at: [70, -55, 30], to: [-150, -50], stages: [3] },
  { id: "room", n: 6, text: "Your room", at: [160, -70, 24], to: [112, -66], stages: [3] },
  { id: "service", n: 7, text: "Service request", at: [113, -77, 20], to: [30, -92], stages: [4] },
  { id: "checkout", n: 8, text: "Checkout", at: [121, -42, 16], to: [92, 64], stages: [5] },
  { id: "airport", n: 9, text: "Back to the airport", at: [-85, -19, 32], to: [96, -78], stages: [6] },
];
const pins = PINS.map((p) => {
  const [ax, ay] = at(p.at);
  return { id: p.id, n: p.n, text: p.text, stages: p.stages, ax: +ax.toFixed(1), ay: +ay.toFixed(1), lx: +(ax + p.to[0]).toFixed(1), ly: +(ay + p.to[1]).toFixed(1) };
});

// ── Assemble, back to front ───────────────────────────────────────────
const fo = folioPart();
const gt = partition();

const body = [
  base(),
  ground(),
  trees([[-30, -102, 1], [-4, -108, 1.15], [22, -100, 0.95], [-62, -108, 0.9], [-116, -102, 0.9], [-120, -100, 0.85], [66, -104, 1], [116, -108, 1.1], [160, -102, 0.95]]),
  part("plane", plane(), ` transform="translate(0 0)" style="opacity:0"`),
  terminal(),
  hotelShell(),
  room(),
  staffDoorLeaf(),
  gt.body,
  gt.posts,
  gt.leaf,
  gt.top,
  lobby(),
  `<defs>${fo.clip}</defs>`,
  receptionist(),
  reception(),
  fo.svg,
  hotelCaps(),
  `<g data-actors="true">${car()}${part("guest", human(0, 0, 0, { outfit: "ecj-guest", lit: true, suitcase: true }), ` transform="translate(0 0)" style="opacity:0"`)}${staffWithCart()}${keyCard()}</g>`,
  trees([[-160, 38, 1], [-122, 48, 1.1], [-60, 44, 1], [-6, 40, 0.9], [112, 46, 1.1], [150, 38, 1], [188, 46, 1.05], [30, 50, 0.85]]),
];

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label:
    "An isometric diorama of one guest's trip. A plane lands at an airport on the left, the guest takes a car along the road to a hotel on the right, checks in at the lobby desk, takes a key and a lift to a room on the upper floor, calls for service, checks out, and rides the car back to the airport.",
  body,
  className: "ecj-svg",
});

const world = {
  P,
  VIEW: { width: WIDTH, height: HEIGHT },
  AXES: { x: k.axisVector(P, [1, 0, 0]), y: k.axisVector(P, [0, 1, 0]), z: k.axisVector(P, [0, 0, 1]) },
  PINS: pins,
};

const source = `// GENERATED by scripts/build-guest-journey.mjs. Do not edit by hand.
export const ART_SVG = ${JSON.stringify(svg)};
export const WORLD = ${JSON.stringify(world)};
`;
writeFileSync(OUT, source);
const solids = (svg.match(/class="iso-solid/g) || []).length;
console.log(`journey.art.js written: ${(source.length / 1024).toFixed(1)} KB, ${solids} solids, ${(svg.match(/<path/g) || []).length} paths, NaN: ${(svg.match(/NaN/g) || []).length}`);
