import './styles/base.css';

export {
  blobColors,
  blur,
  brand,
  breakpoints,
  darkColors,
  DUOTONE_NAMES,
  duotones,
  elevation,
  layout,
  lightColors,
  metals,
  motion,
  radius,
  spacing,
  typography,
  zIndex,
  type BrandColorName,
  type Duotone,
  type DuotoneName,
  type MetalName,
  type ThemeColors,
} from './theme/tokens';

export {
  createMixtapeVuetify,
  cssVariables,
  darkTheme,
  lightTheme,
  THEME_DARK,
  THEME_LIGHT,
  vuetifyOptions,
} from './theme/vuetify';

export {
  applyThemeVariables,
  bindVuetifyTheme,
  initialThemeIsDark,
  THEME_STORAGE_KEY,
  useThemePreference,
  type ThemeMode,
} from './theme/useTheme';

export { createIconSet, MIXTAPE_ICON_SET, mixtapeIcons, type IconPaths, type IconShape } from './icons/iconSet';
export { MIXTAPE_ICON_PATHS } from './icons/icons.generated';

export { createMixtapeLocale } from './i18n/createMixtapeLocale';
export { useLanguages, type Language } from './i18n/useLanguages';
export {
  languageName,
  languageRegion,
  LOCALE_STORAGE_KEY,
  matchLocale,
  preferredLocale,
  storeLocale,
} from './i18n/languages';
export { formatMessage, type MessageParams } from './i18n/format';

export {
  duotoneFor,
  formatCompactNumber,
  formatDate,
  formatDuration,
  formatLongDuration,
  formatNumber,
  formatPartialDate,
  formatRatingValue,
  hashString,
  initials,
  relativeTime,
  yearOf,
} from './format';

export { isExternalHref, MIXTAPE_LINK_KEY, type LinkTarget } from './links/links';

export { prefersCoarsePointer, prefersReducedMotion, usePrefersReducedMotion } from './motion/reducedMotion';
export { vReveal, type RevealOptions, type RevealVariant } from './motion/vReveal';
export { vTilt, type TiltOptions } from './motion/vTilt';
export { useCountUp } from './motion/useCountUp';
export { useInView } from './motion/useInView';
export { useScrollState } from './motion/useScrollState';
export { startViewTransition, supportsViewTransitions, viewTransitionName } from './motion/viewTransition';

export {
  BADGE_TIER_METAL,
  DISC_TIER_METAL,
  DISC_TIER_ORDER,
  isDiscTier,
  metalForTier,
  type DiscTier,
} from './gamification/tiers';

export { BRANDS, isBrandName, type Brand, type BrandName } from './components/brands';

export { default as MxLink } from './components/MxLink.vue';
export { default as MxButton } from './components/MxButton.vue';
export { default as MxIconButton } from './components/MxIconButton.vue';
export { default as MxGlass } from './components/MxGlass.vue';
export { default as MxChip } from './components/MxChip.vue';
export { default as MxBrandIcon } from './components/MxBrandIcon.vue';
export { default as MxFlag } from './components/MxFlag.vue';
export { default as MxVinyl } from './components/MxVinyl.vue';
export { default as MxBlobField } from './components/MxBlobField.vue';
export { default as MxBlob } from './components/MxBlob.vue';
export { default as MxStarburst } from './components/MxStarburst.vue';
export { default as MxMarquee } from './components/MxMarquee.vue';
export { default as MxCover } from './components/MxCover.vue';
export { default as MxAvatar } from './components/MxAvatar.vue';
export { default as MxImageCredit } from './components/MxImageCredit.vue';
export { default as MxMosaic } from './components/MxMosaic.vue';
export { default as MxRating } from './components/MxRating.vue';
export { default as MxRatingInput } from './components/MxRatingInput.vue';
export { default as MxRatingHistogram } from './components/MxRatingHistogram.vue';
export { default as MxStat } from './components/MxStat.vue';
export { default as MxDiscTier } from './components/MxDiscTier.vue';
export { default as MxDiscProgress } from './components/MxDiscProgress.vue';
export { default as MxBadge } from './components/MxBadge.vue';
export { default as MxPodium } from './components/MxPodium.vue';
export { default as MxSplitBar } from './components/MxSplitBar.vue';
export { default as MxRankRow } from './components/MxRankRow.vue';
export { default as MxBarList } from './components/MxBarList.vue';
export { default as MxTimeAgo } from './components/MxTimeAgo.vue';
export { default as MxDescriptionList } from './components/MxDescriptionList.vue';
export { default as MxItemCard } from './components/MxItemCard.vue';
export { default as MxTrackList } from './components/MxTrackList.vue';
export { default as MxLikeButton } from './components/MxLikeButton.vue';
export { default as MxReviewCard } from './components/MxReviewCard.vue';
export { default as MxGroupReviewCard } from './components/MxGroupReviewCard.vue';
export { default as MxStreamingLinks } from './components/MxStreamingLinks.vue';
export { default as MxSection } from './components/MxSection.vue';
export { default as MxRail } from './components/MxRail.vue';
export { default as MxGrid } from './components/MxGrid.vue';
export { default as MxPagedGrid } from './components/MxPagedGrid.vue';
export { default as MxRotator } from './components/MxRotator.vue';
export { default as MxCrate } from './components/MxCrate.vue';
export { default as MxPageHero } from './components/MxPageHero.vue';
export { default as MxStoryCard } from './components/MxStoryCard.vue';
export { default as MxSegmented } from './components/MxSegmented.vue';
export { default as MxSearchField } from './components/MxSearchField.vue';
export { default as MxStepper } from './components/MxStepper.vue';
export { default as MxTopBar } from './components/MxTopBar.vue';
export { default as MxTabBar } from './components/MxTabBar.vue';
export { default as MxUserMenu } from './components/MxUserMenu.vue';
export { default as MxProgressBar } from './components/MxProgressBar.vue';
export { default as MxAppShell } from './components/MxAppShell.vue';
export { default as MxFooter } from './components/MxFooter.vue';
export { default as MxSkeleton } from './components/MxSkeleton.vue';
export { default as MxLoader } from './components/MxLoader.vue';
export { default as MxEmptyState } from './components/MxEmptyState.vue';
export { default as MxErrorState } from './components/MxErrorState.vue';
export { default as MxLoadMore } from './components/MxLoadMore.vue';
export { default as MxDialog } from './components/MxDialog.vue';
export { default as MxConfirmDialog } from './components/MxConfirmDialog.vue';
export { default as MxTextField } from './components/MxTextField.vue';
export { default as MxTextarea } from './components/MxTextarea.vue';
export { default as MxPasswordField } from './components/MxPasswordField.vue';
export { default as MxBalloonPicker } from './components/MxBalloonPicker.vue';
export { default as MxQrCode } from './components/MxQrCode.vue';
export { default as MxShareSheet } from './components/MxShareSheet.vue';
export { default as MxConsentBanner } from './components/MxConsentBanner.vue';
export { default as MxAdFrame } from './components/MxAdFrame.vue';

export { default as MxToastHost } from './feedback/MxToastHost.vue';
export { dismissToast, toast, useToasts, type Toast, type ToastAction, type ToastKind, type ToastOptions } from './feedback/useToast';

export type { ButtonSize, ButtonVariant } from './components/MxButton.vue';
export type { CoverSources } from './components/MxCover.vue';
export type { RatingBucket } from './components/MxRatingHistogram.vue';
export type { StatFormat } from './components/MxStat.vue';
export type { NextDisc } from './components/MxDiscProgress.vue';
export type { BadgeNextTier } from './components/MxBadge.vue';
export type { PodiumEntry } from './components/MxPodium.vue';
export type { SplitSegment } from './components/MxSplitBar.vue';
export type { BarListItem } from './components/MxBarList.vue';
export type { DescriptionItem } from './components/MxDescriptionList.vue';
export type { ItemKind } from './components/MxItemCard.vue';
export type { CrateRecord } from './components/MxCrate.vue';
export type { TrackListEntry } from './components/MxTrackList.vue';
export type { ReviewAuthor, ReviewGroupTag, ReviewSubject, ReviewVisibility } from './components/MxReviewCard.vue';
export type { GroupReviewEntry } from './components/MxGroupReviewCard.vue';
export type { SegmentedOption } from './components/MxSegmented.vue';
export type { StepperStep } from './components/MxStepper.vue';
export type { BalloonOption } from './components/MxBalloonPicker.vue';
export type { TabBarItem } from './components/MxTabBar.vue';
export type { UserMenuItem } from './components/MxUserMenu.vue';
export type { FooterColumn, FooterLink } from './components/MxFooter.vue';
export type { PasswordRule } from './components/MxPasswordField.vue';
export type { SharePayload, ShareQrCode, ShareTarget } from './components/MxShareSheet.vue';
