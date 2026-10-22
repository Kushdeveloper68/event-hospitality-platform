// Picks a cover photo for an event.
//
// The Event model has no "type" field, so the category is guessed from the
// event's name / description / venue. Order matters: the more specific
// keywords (reception, sangeet) are checked before the generic ones (wedding).
//
// Photos live in /public/images/events/<category>.webp — see IMAGES-GUIDE.md.
// If a photo is missing, the UI silently falls back to its gradient, so the
// app never shows a broken image.

const CATEGORY_RULES = [
  ['reception', /reception/i],
  ['sangeet', /sangeet|mehndi|mehendi|haldi|cocktail night/i],
  ['wedding', /wedding|shaadi|shadi|vivah|marriage|baraat|engagement|nikah|bride|groom/i],
  ['conference', /conference|summit|seminar|symposium|convention|expo|conclave|workshop|congress|forum/i],
  ['corporate', /corporate|off-?site|retreat|annual meet|\bteam\b|\bcompany\b|\blaunch\b|dinner|training/i],
  ['festival', /festival|fest\b|navratri|garba|diwali|holi|concert|gala|carnival|celebration/i],
];

export const EVENT_CATEGORY_LABELS = {
  wedding: 'Wedding',
  reception: 'Reception',
  sangeet: 'Sangeet & Mehendi',
  conference: 'Conference',
  corporate: 'Corporate',
  festival: 'Festival & Gala',
  default: 'Event',
};

export function getEventCategory(event) {
  const text = [event?.name, event?.description, event?.venue].filter(Boolean).join(' ');
  for (const [category, pattern] of CATEGORY_RULES) {
    if (pattern.test(text)) return category;
  }
  return 'default';
}

// `coverImage` isn't stored yet; once users can upload their own cover it will
// take priority automatically.
export function getEventCoverSrc(event) {
  if (event?.coverImage) return event.coverImage;
  return `/images/events/${getEventCategory(event)}.webp`;
}
