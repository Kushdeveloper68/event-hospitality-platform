// EventCure guest-journey model: the story of one guest, from landing to the flight home.
// Pure functions only: no DOM, no randomness. journey(τ) returns where every actor is.
// τ is "story time": the integer part is the stage (0..6), the fraction is progress through it.

export const STAGES = [
  { id: "land", label: "Land", icon: "flight_land" },
  { id: "transfer", label: "Transfer", icon: "local_taxi" },
  { id: "checkin", label: "Check-in", icon: "concierge" },
  { id: "room", label: "Room", icon: "key" },
  { id: "service", label: "Service", icon: "room_service" },
  { id: "checkout", label: "Checkout", icon: "logout" },
  { id: "return", label: "Departure", icon: "flight_takeoff" },
];
export const STAGE_COUNT = STAGES.length;
export const LOOP_SECONDS = 42;

// Sample data. It mirrors the live feed on the landing page.
export const GUEST = { name: "Eleanor Vance", tag: "VIP", room: 402, flight: "EC 402" };
export const TRIP = { etaMinutes: 24 };
export const SERVICE = { item: "Extra towels", slaMinutes: 15, resolvedMinutes: 6 };

// Places in world units. x runs along the road, y runs from the back of the plate to the front, z is up.
// The hotel is one storey: lobby and reception in front, the guest room behind them, a gate between.
export const PLACE = {
  planeRest: { x: -172, y: -30 },
  floor1: 1.2,
  doorTop: { x: -163.4, y: -48, z: 9.2 },
  stairsFoot: { x: -148, y: -48, z: 0.6 },
  terminalDoor: { x: -85, y: -19, z: 1.2 },
  curb: { x: -100, y: -8, z: 1.2 },
  carCurb: -100,
  carHotel: 75,
  roadY: 5,
  hotelWalk: { x: 75, y: -8, z: 1.2 },
  hotelIn: { x: 100, y: -22, z: 1.2 },
  desk: { x: 107, y: -31, z: 1.2 },
  gateOut: { x: 139, y: -48, z: 1.2 },
  gateIn: { x: 139, y: -62, z: 2.6 },
  roomDesk: { x: 112, y: -66, z: 2.6 },
  staffDoor: { x: 133, y: -78, z: 2.6 },
  staffStop: { x: 123, y: -68, z: 2.6 },
};

const smooth = (t) => {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
};

// Keyframes → value. Between two keyframes the value eases in and out; equal values hold.
export function track(table) {
  return (tau) => {
    if (tau <= table[0][0]) return table[0][1];
    for (let i = 1; i < table.length; i += 1) {
      const [t1, v1] = table[i];
      if (tau <= t1) {
        const [t0, v0] = table[i - 1];
        return v0 + (v1 - v0) * smooth((tau - t0) / (t1 - t0));
      }
    }
    return table[table.length - 1][1];
  };
}

const P = PLACE;
const END = STAGE_COUNT;

// The car waits at the arrivals curb, drives to the hotel, waits, and drives back.
const carX = track([[0, P.carCurb], [1.38, P.carCurb], [1.98, P.carHotel], [6.2, P.carHotel], [6.8, P.carCurb], [END, P.carCurb]]);

// The plane lands from the front edge, waits at the gate, then rolls out toward the back and lifts off.
// After τ=2.8 it is invisible and is put back at the start of the runway.
const planeRoll = track([[0, 96], [0.5, 0], [1.9, 0], [2.7, -112]]);
const planeZ = track([[0, 24], [0.4, 0], [2.1, 0], [2.7, 44]]);
const planeOpacity = track([[0, 0], [0.12, 1], [2.3, 1], [2.7, 0], [END, 0]]);
const planeY = (tau) => (tau < 2.8 ? planeRoll(tau) : 96);

// The guest on foot. Each row: [τ, x, y, z]. While the car drives, the guest rides inside it.
const G = [
  [0.0, P.doorTop.x, P.doorTop.y, P.doorTop.z],
  [0.64, P.doorTop.x, P.doorTop.y, P.doorTop.z],
  [0.84, P.stairsFoot.x, P.stairsFoot.y, P.stairsFoot.z],
  [0.96, P.stairsFoot.x, P.curb.y - 5, 1.2],
  [1.1, P.curb.x + 2, P.curb.y, 1.2],
  [1.24, P.carCurb + 2, P.roadY, 4.4],
  [2.06, P.carHotel + 2, P.roadY, 4.4],
  [2.22, P.hotelWalk.x, P.hotelWalk.y, 1.2],
  [2.4, P.hotelIn.x, P.hotelIn.y, 1.2],
  [2.56, P.desk.x, P.desk.y, 1.2],
  [3.28, P.desk.x, P.desk.y, 1.2], // check-in, key issued
  [3.5, P.gateOut.x, P.gateOut.y, 1.2],
  [3.7, P.gateOut.x, P.gateOut.y, 1.2], // taps the key at the gate
  [3.8, P.gateIn.x, P.gateIn.y, P.gateIn.z],
  [3.98, P.roomDesk.x, P.roomDesk.y, P.roomDesk.z],
  [5.0, P.roomDesk.x, P.roomDesk.y, P.roomDesk.z], // bell, towels
  [5.14, P.gateIn.x, P.gateIn.y, P.gateIn.z],
  [5.26, P.gateOut.x, P.gateOut.y, 1.2],
  [5.5, P.desk.x, P.desk.y, 1.2],
  [5.9, P.desk.x, P.desk.y, 1.2], // checkout
  [6.0, P.hotelIn.x, P.hotelIn.y, 1.2],
  [6.1, P.hotelWalk.x, P.hotelWalk.y, 1.2],
  [6.2, P.carHotel + 2, P.roadY, 4.4],
  [6.8, P.carCurb + 2, P.roadY, 4.4],
  [6.9, P.curb.x + 2, P.curb.y, 1.2],
  [END, P.terminalDoor.x, P.terminalDoor.y, 1.2],
];
const col = (i) => track(G.map((row) => [row[0], row[i]]));
const gx = col(1);
const gy = col(2);
const gz = col(3);
const guestOpacity = track([[0, 0], [0.6, 0], [0.68, 1], [6.9, 1], [END, 0]]);

export const RIDING = [[1.24, 2.06], [6.2, 6.8]];
const riding = (tau) => RIDING.some(([a, b]) => tau >= a && tau <= b);

// Staff come through the back door of the room when the bell rings, bring towels and leave.
const staffX = track([[0, P.staffDoor.x], [4.2, P.staffDoor.x], [4.5, P.staffStop.x], [4.74, P.staffStop.x], [4.96, P.staffDoor.x], [END, P.staffDoor.x]]);
const staffY = track([[0, P.staffDoor.y], [4.2, P.staffDoor.y], [4.5, P.staffStop.y], [4.74, P.staffStop.y], [4.96, P.staffDoor.y], [END, P.staffDoor.y]]);
const staffOpacity = track([[0, 0], [4.16, 0], [4.22, 1], [4.92, 1], [4.98, 0], [END, 0]]);

// Gates, key, folio and the small things that light up.
const gateSlide = track([[0, 0], [3.6, 0], [3.68, 1], [3.86, 1], [3.94, 0], [5.06, 0], [5.14, 1], [5.3, 1], [5.38, 0], [END, 0]]);
const staffDoorSlide = track([[0, 0], [4.1, 0], [4.18, 1], [4.95, 1], [5.02, 0], [END, 0]]);
const rackLamp = track([[0, 0], [2.7, 0], [2.85, 1], [3.1, 1], [3.2, 0], [5.52, 0], [5.58, 1], [5.7, 1], [5.8, 0], [END, 0]]);
const keyOpacity = track([[0, 0], [3.0, 0], [3.1, 1], [5.7, 1], [5.78, 0], [END, 0]]);
const readerLamp = track([[0, 0], [3.62, 0], [3.66, 1], [3.9, 1], [3.96, 0], [5.08, 0], [5.12, 1], [5.3, 1], [5.36, 0], [END, 0]]);
const bellPress = track([[0, 0], [4.02, 0], [4.06, 1], [4.14, 0], [END, 0]]);
const serviceLamp = track([[0, 0], [4.08, 0], [4.14, 1], [4.8, 1], [4.9, 0], [END, 0]]);
const towels = track([[0, 0], [4.56, 0], [4.64, 1], [4.9, 1], [4.96, 0], [END, 0]]);
const folio = track([[0, 0], [5.52, 0], [5.64, 1], [5.78, 1], [5.9, 0], [END, 0]]);
const scanLamp = track([[0, 0], [2.6, 0], [2.68, 1], [2.9, 1], [2.96, 0], [END, 0]]);

const lerp = (a, b, t) => a + (b - a) * t;
const KEY_DESK = { x: 92, y: -42.5, z: 12.9 };
function keyPosition(tau, g) {
  const hand = { x: g.x + 4.4, y: g.y + 1, z: g.z + 11.5 };
  let h = 0;
  if (tau >= 3.28 && tau < 5.5) h = smooth((tau - 3.28) / 0.14);
  else if (tau >= 5.5 && tau < 5.62) h = 1 - smooth((tau - 5.5) / 0.1);
  return { x: lerp(KEY_DESK.x, hand.x, h), y: lerp(KEY_DESK.y, hand.y, h), z: lerp(KEY_DESK.z, hand.z, h) };
}

export const wrap = (tau) => ((tau % END) + END) % END;

const SLA_FROM = 4.14;
const SLA_TO = 4.7;

export function journey(rawTau) {
  const tau = wrap(rawTau);
  const stage = Math.min(STAGE_COUNT - 1, Math.floor(tau));
  const cx = carX(tau);
  const ride = riding(tau);
  const gpos = ride ? { x: cx + 2, y: P.roadY, z: 4.4 } : { x: gx(tau), y: gy(tau), z: gz(tau) };
  const raw = (cx - P.carCurb) / (P.carHotel - P.carCurb);
  const carProgress = Math.min(1, Math.max(0, tau < 4 ? raw : 1 - raw));
  const slaUsed = tau < SLA_FROM ? 0 : tau < SLA_TO ? ((tau - SLA_FROM) / (SLA_TO - SLA_FROM)) * SERVICE.resolvedMinutes : SERVICE.resolvedMinutes;
  return {
    tau, stage, riding: ride,
    guest: { ...gpos, o: guestOpacity(tau) },
    car: { x: cx, y: P.roadY, z: 0 },
    plane: { x: 0, y: planeY(tau), z: planeZ(tau), o: planeOpacity(tau) },
    staff: { x: staffX(tau), y: staffY(tau), z: P.staffDoor.z, o: staffOpacity(tau) },
    gate: { x: 16 * gateSlide(tau), y: 0, z: 0 },
    staffDoor: { x: 10 * staffDoorSlide(tau), y: 0, z: 0 },
    rack: { o: rackLamp(tau) },
    key: { ...keyPosition(tau, gpos), o: keyOpacity(tau) },
    reader: { o: readerLamp(tau) },
    bell: { x: 0, y: 0, z: -1.1 * bellPress(tau) },
    serviceLamp: { o: serviceLamp(tau) },
    towels: { o: towels(tau) },
    folio: { x: 0, y: 0, z: 13 * folio(tau) },
    scan: { o: scanLamp(tau) },
    slaUsed,
    etaMinutes: Math.round(TRIP.etaMinutes * (1 - carProgress)),
  };
}

const pad2 = (n) => String(Math.round(n)).padStart(2, "0");

// The words. Everything shown is computed from the same state the figure moves with.
export function readout(state) {
  const n = `${pad2(state.stage + 1)}/${pad2(STAGE_COUNT)}`;
  const t = state.tau;
  switch (state.stage) {
    case 0:
      return t < 0.62 ? `${n} Flight ${GUEST.flight} landing` : `${n} Landed · ${GUEST.name} · ${GUEST.tag}`;
    case 1:
      return t < 1.38 ? `${n} Car waiting at arrivals` : `${n} Transfer to the hotel · ETA ${pad2(state.etaMinutes)} min`;
    case 2:
      return t < 2.56 ? `${n} Arrived at the hotel` : t < 2.92 ? `${n} Check-in · QR scanned` : `${n} Check-in · confirmed`;
    case 3:
      return t < 3.3 ? `${n} Room ${GUEST.room} assigned · key issued` : t < 3.66 ? `${n} Walking to room ${GUEST.room}` : `${n} Room ${GUEST.room} · gate unlocked`;
    case 4:
      return t < SLA_FROM ? `${n} In the room · calling service` : t < SLA_TO ? `${n} ${SERVICE.item} · on the way` : `${n} ${SERVICE.item} · SLA ${pad2(state.slaUsed)}:00 of ${pad2(SERVICE.slaMinutes)}:00`;
    case 5:
      return t < 5.5 ? `${n} Checkout · heading to the desk` : `${n} Checkout · folio closed · room ${GUEST.room} released`;
    default:
      return t < 6.2 ? `${n} Car ready for the airport` : t < 6.85 ? `${n} To the airport · ETA ${pad2(state.etaMinutes)} min` : `${n} Departures · see you again`;
  }
}

export const ariaText = (state) => `${STAGES[state.stage].label}. ${readout(state)}`;
