/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CONTENT HUB – everything shown on the website comes from here.  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 *  Easiest way to edit:  `yarn cms`  → visual editor in the browser (see docs/CMS_GUIDE.md)
 *
 *  Where things live
 *  ─────────────────────────────────────────────────────────────────
 *  data/*.json         The content itself (edited by the editor or by hand)
 *  schema.ts           Content models: shape, rules, editor labels (Zod)
 *  collections.ts      Which JSON file holds which model + editor settings
 *  validate.ts         Cross-checks (unique ids, references, images exist)
 *  ../assets/content/  Images referenced from the JSON ("gallery/foo.webp")
 *  navigation.ts       Menu entries / URLs (developer-owned)
 *  ui.ts               Button labels, a11y texts (developer-owned)
 *
 *  The JSON is validated by tests in CI – broken content never reaches the live site.
 */
import coursesJson from './data/courses.json';
import eventsJson from './data/events.json';
import galleryJson from './data/gallery.json';
import homeJson from './data/home.json';
import imprintJson from './data/imprint.json';
import pagesJson from './data/pages.json';
import pricesJson from './data/prices.json';
import privacyJson from './data/privacy.json';
import qualityJson from './data/quality.json';
import aboutJson from './data/about.json';
import faqJson from './data/faq.json';
import performanceJson from './data/performance.json';
import pointeJson from './data/pointe.json';
import scheduleJson from './data/schedule.json';
import siteJson from './data/site.json';
import teamJson from './data/team.json';
import { resolveImage } from './images';
import type {
  Course,
  EventItem,
  GalleryItem,
  HomeContent,
  LegalPage,
  PagesContent,
  PricesContent,
  FaqContent,
  StoryPage,
  ScheduleEntry,
  SiteInfo,
  TeamMember,
} from './types';

export * from './types';
export { legalNav, mainNav, navigation, pathFor, redirects } from './navigation';
export { ui } from './ui';

// JSON is typed loosely by TypeScript; the exact shape is guaranteed by the schema tests.
const siteRaw = siteJson as SiteInfo;
export const site: SiteInfo = { ...siteRaw, logo: resolveImage(siteRaw.logo) };
export const pages = pagesJson as PagesContent;

const home = homeJson as unknown as HomeContent;
export const homeHero = home.hero;
export const homeKeywords = home.keywords;
export const homeHighlights = home.highlights;
export const homePhilosophy = { ...home.philosophy, visual: { ...home.philosophy.visual, image: resolveImage(home.philosophy.visual.image) } };
export const homeSections = home.sections;

export const courses = (coursesJson as unknown as Course[]).map((c) => ({ ...c, image: resolveImage(c.image) }));
export const schedule = scheduleJson as unknown as ScheduleEntry[];

const prices = pricesJson as unknown as PricesContent;
export const pricePlans = prices.plans;
export const priceNotes = prices.notes;

export const team = (teamJson as unknown as TeamMember[]).map((m) => ({
  ...m,
  photo: resolveImage(m.photo),
  actionPhoto: resolveImage(m.actionPhoto),
}));

const story = (json: unknown): StoryPage => {
  const page = json as StoryPage;
  return { ...page, blocks: page.blocks.map((b) => ({ ...b, visual: { ...b.visual, image: resolveImage(b.visual.image) } })) };
};
export const aboutPage = story(aboutJson);
export const qualityPage = story(qualityJson);
export const pointePage = story(pointeJson);
export const performancePage = story(performanceJson);
export const faq = faqJson as unknown as FaqContent;
export const events = (eventsJson as unknown as EventItem[]).map((e) => ({ ...e, image: resolveImage(e.image) }));
export const gallery = (galleryJson as unknown as GalleryItem[]).map((g) => ({ ...g, image: resolveImage(g.image) }));
export const imprint = imprintJson as unknown as LegalPage;
export const privacy = privacyJson as unknown as LegalPage;
