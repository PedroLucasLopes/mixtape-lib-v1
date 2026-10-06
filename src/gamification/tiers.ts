import type { MetalName } from '../theme/tokens';

export type DiscTier = 'DEMO' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';

export const DISC_TIER_ORDER: readonly DiscTier[] = ['DEMO', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'];

export const DISC_TIER_METAL: Readonly<Record<DiscTier, MetalName>> = {
  DEMO: 'demo',
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond',
};

export const BADGE_TIER_METAL: Readonly<Record<number, MetalName>> = {
  0: 'demo',
  1: 'bronze',
  2: 'silver',
  3: 'gold',
  4: 'platinum',
};

export const isDiscTier = (value: string): value is DiscTier => (DISC_TIER_ORDER as readonly string[]).includes(value);

export const metalForTier = (tier: string | null | undefined): MetalName =>
  tier && isDiscTier(tier) ? DISC_TIER_METAL[tier] : 'demo';
