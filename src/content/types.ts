/**
 * Content types used by the website components.
 * They are generated from the content models in ./schema.ts – change the model there,
 * never duplicate the shape here.
 */
import type { Localized } from '@/i18n';
import type { PageId } from './schema';

export type { Localized };
export type {
  AudienceId,
  ContentStatus,
  Course,
  EventItem,
  GalleryItem,
  HeroContent,
  HomeContent,
  ImageAsset,
  LegalPage,
  LinkItem,
  PageHeaderContent,
  PageId,
  PageMeta,
  PagesContent,
  PricePlan,
  PricesContent,
  BrushVisual,
  EventCategory,
  FaqContent,
  Keyword,
  PaletteColor,
  StoryBlock,
  StoryPage,
  ScheduleEntry,
  SiteInfo,
  TeamMember,
  TextSize,
  Weekday,
} from './schema';

export interface NavItem {
  page: PageId;
  path: string;
  label: Localized;
  /** Sub-pages shown in a dropdown. */
  children?: NavItem[];
}
