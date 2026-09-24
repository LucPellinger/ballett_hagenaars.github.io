/**
 * Content model – every piece of text, image and link on the site is described by
 * these types. TypeScript will refuse to build if a content file is missing a field.
 *
 * Conventions
 * - `Localized` = { de: '…', en?: '…' }. German is required, English optional (falls back to German).
 * - `status: 'placeholder'` marks sample content that must be replaced before going live.
 *   `yarn content:check` lists them; the production deploy refuses to publish while any remain.
 * - IDs are lowercase-kebab-case and must be unique (checked by src/content/content.test.ts).
 */
import type { Localized } from '@/i18n';

export type { Localized };

export type ContentStatus = 'published' | 'placeholder';

export interface ImageAsset {
  /** Imported image (`import img from '@/assets/images/…'`) or absolute URL. */
  src: string;
  /** Describe what is visible – required for accessibility. Use '' only for purely decorative images. */
  alt: Localized;
  width?: number;
  height?: number;
}

export interface LinkItem {
  label: Localized;
  href: string;
  external?: boolean;
}

/* ---------- Site-wide ---------- */

export type PageId =
  | 'home'
  | 'courses'
  | 'schedule'
  | 'prices'
  | 'school'
  | 'events'
  | 'gallery'
  | 'contact'
  | 'imprint'
  | 'privacy';

export interface NavItem {
  page: PageId;
  path: string;
  label: Localized;
  /** Show in main header navigation. */
  header: boolean;
  /** Show in the footer link list. */
  footer: boolean;
}

export interface OpeningHours {
  days: Localized;
  hours: string;
}

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'youtube' | 'tiktok';
  href: string;
  label: string;
}

export interface SiteInfo {
  name: string;
  shortName: string;
  tagline: Localized;
  owner: { name: string; title: Localized };
  address: { street: string; zip: string; city: string; country: Localized };
  phone: { display: string; href: string };
  email: string;
  taxId: string;
  memberships: Localized[];
  openingHours: OpeningHours[];
  socials: SocialLink[];
  mapUrl: string;
  foundedYear?: number;
}

/* ---------- Page chrome ---------- */

export interface PageMeta {
  title: Localized;
  description: Localized;
}

export interface PageHeaderContent {
  eyebrow?: Localized;
  title: Localized;
  lead?: Localized;
}

export interface HeroContent {
  /** Each array entry is rendered on its own line in poster type. */
  headline: Localized<string[]>;
  /** Small meta block, bottom-right on the poster (e.g. "Seit 1990 / Haßloch"). */
  meta: Localized<string[]>;
  lead: Localized;
  image?: ImageAsset;
  primaryCta: LinkItem;
  secondaryCta?: LinkItem;
}

/* ---------- Domain content ---------- */

export type AudienceId = 'kids' | 'teens' | 'adults' | 'family';

export interface Course {
  id: string;
  title: Localized;
  audience: AudienceId[];
  ageGroup: Localized;
  summary: Localized;
  description: Localized<string[]>;
  image?: ImageAsset;
  status?: ContentStatus;
}

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface ScheduleEntry {
  id: string;
  day: Weekday;
  /** 24h "HH:MM" */
  start: string;
  end: string;
  /** Must match a `Course.id`. */
  courseId: string;
  level?: Localized;
  /** Must match a `TeamMember.id`. */
  teacherId?: string;
  status?: ContentStatus;
}

export interface PricePlan {
  id: string;
  title: Localized;
  details: Localized;
  /** Price in EUR. `null` shows "on request". */
  amount: number | null;
  period: Localized;
  highlight?: boolean;
  status?: ContentStatus;
}

export interface TeamMember {
  id: string;
  name: string;
  role: Localized;
  bio: Localized;
  teaches: Localized<string[]>;
  photo?: ImageAsset;
  status?: ContentStatus;
}

export interface EventItem {
  id: string;
  title: Localized;
  /** ISO date YYYY-MM-DD */
  startDate: string;
  endDate?: string;
  location: string;
  description: Localized;
  image?: ImageAsset;
  link?: LinkItem;
  status?: ContentStatus;
}

export interface GalleryItem {
  id: string;
  image: ImageAsset;
  caption?: Localized;
  status?: ContentStatus;
}

export interface LegalSection {
  heading: Localized;
  paragraphs: Localized<string[]>;
}

export interface LegalPage {
  sections: LegalSection[];
  status?: ContentStatus;
}
