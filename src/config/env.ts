/** Preview deployment (sample content allowed, not indexed by search engines). */
export const isPreview = import.meta.env.VITE_PREVIEW === 'true';

/** Show "Beispielinhalt" badges locally and on preview deployments – never on the real live site. */
export const showPlaceholderBadges = import.meta.env.DEV || isPreview;
