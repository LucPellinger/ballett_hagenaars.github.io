/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CONTENT HUB – everything shown on the website comes from here.  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 *  What you want to change            → file
 *  ─────────────────────────────────────────────────────────────────
 *  Address, phone, email, socials     → site.ts
 *  Menu entries / page URLs           → navigation.ts
 *  Page titles, SEO, home page texts  → pages.ts
 *  Classes                            → courses.ts
 *  Timetable                          → schedule.ts
 *  Fees                               → prices.ts
 *  Team + quality statement           → team.ts
 *  Workshops / events                 → events.ts
 *  Gallery photos                     → gallery.ts
 *  Imprint / privacy policy           → legal.ts
 *  Buttons, labels, a11y texts        → ui.ts
 *
 *  Rules: German (`de`) is required, English (`en`) optional.
 *  Run `yarn check` after editing – it validates types, references and alt texts.
 */
export * from './types';
export { site } from './site';
export { navigation, pathFor } from './navigation';
export { pages, homeHero, homeHighlights, homeSections } from './pages';
export { courses } from './courses';
export { schedule } from './schedule';
export { pricePlans, priceNotes } from './prices';
export { team, qualityStatement } from './team';
export { events } from './events';
export { gallery } from './gallery';
export { imprint, privacy } from './legal';
export { ui } from './ui';
