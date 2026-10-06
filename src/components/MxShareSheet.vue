<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import { BRANDS, type BrandName, isBrandName } from './brands';
import MxBrandIcon from './MxBrandIcon.vue';
import MxDialog from './MxDialog.vue';
import MxQrCode from './MxQrCode.vue';

export interface ShareTarget {
  network: string;
  label: string;
  method: 'LINK' | 'WEB_SHARE_API';
  url: string | null;
}

export interface SharePayload {
  url: string;
  title: string;
  text: string;
  imageUrl?: string | null;
  targets: readonly ShareTarget[];
}

export interface ShareQrCode {
  png: string;
  svg?: string | null;
  alt: string;
  downloadName?: string;
}

const open = defineModel<boolean>({ default: false });

const props = withDefaults(
  defineProps<{
    title: string;
    payload: SharePayload | null;
    loading?: boolean;
    qr?: ShareQrCode | null;
  }>(),
  { loading: false, qr: null },
);

const emit = defineEmits<{ shared: [network: string]; copied: [] }>();

const { t } = useMixtapeText();
const copied = ref(false);
const hint = ref<string | null>(null);

const canNativeShare = computed(() => typeof navigator !== 'undefined' && typeof navigator.share === 'function');

const brandOf = (network: string): BrandName | null => {
  if (network === 'x') return 'x';
  return isBrandName(network) ? network : null;
};

const targets = computed(() =>
  (props.payload?.targets ?? []).map((target) => {
    const brand = brandOf(target.network);
    return { ...target, brand, color: brand ? BRANDS[brand].color : null };
  }),
);

const copyLink = async () => {
  if (!props.payload) return;
  try {
    await navigator.clipboard.writeText(props.payload.url);
  } catch {
    const field = document.createElement('textarea');
    field.value = props.payload.url;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    document.execCommand('copy');
    field.remove();
  }
  copied.value = true;
  emit('copied');
  setTimeout(() => {
    copied.value = false;
  }, 2400);
};

const nativeShare = async (network = 'native') => {
  if (!props.payload) return;
  if (!canNativeShare.value) {
    await copyLink();
    hint.value = t('share.instagramHint');
    return;
  }
  try {
    await navigator.share({ title: props.payload.title, text: props.payload.text, url: props.payload.url });
    emit('shared', network);
  } catch {
    return;
  }
};
</script>

<template>
  <MxDialog v-model="open" :title="title" :width="520">
    <div class="mx-share">
      <div v-if="loading || !payload" class="mx-share__loading" role="status">
        <span class="mx-share__spinner" aria-hidden="true" />
        <span class="mx-sr-only">{{ t('common.loading') }}</span>
      </div>
      <template v-else>
        <p class="mx-share__text">{{ payload.text }}</p>
        <ul class="mx-share__targets">
          <li v-for="(target, index) in targets" :key="target.network" :style="{ animationDelay: `${index * 45}ms` }">
            <a
              v-if="target.method === 'LINK' && target.url"
              class="mx-share__target"
              :href="target.url"
              target="_blank"
              rel="noopener noreferrer"
              @click="emit('shared', target.network)"
            >
              <span class="mx-share__bubble" :style="target.color ? { background: target.color } : undefined">
                <MxBrandIcon v-if="target.brand" :name="target.brand" :size="26" />
                <VIcon v-else icon="mdi-share-variant" aria-hidden="true" />
              </span>
              <span class="mx-share__label">{{ target.label }}</span>
              <span class="mx-sr-only">{{ t('common.newTab') }}</span>
            </a>
            <button v-else type="button" class="mx-share__target" @click="nativeShare(target.network)">
              <span class="mx-share__bubble mx-share__bubble--gradient">
                <MxBrandIcon v-if="target.brand" :name="target.brand" :size="26" />
                <VIcon v-else icon="mdi-share-variant" aria-hidden="true" />
              </span>
              <span class="mx-share__label">{{ target.label }}</span>
            </button>
          </li>
        </ul>

        <div class="mx-share__link">
          <input class="mx-share__url" :value="payload.url" readonly :aria-label="t('share.link')" @focus="($event.target as HTMLInputElement).select()" />
          <button type="button" class="mx-share__copy" :class="{ 'mx-share__copy--done': copied }" @click="copyLink">
            <VIcon :icon="copied ? 'mdi-check-bold' : 'mdi-content-copy'" size="18" aria-hidden="true" />
            {{ copied ? t('share.linkCopied') : t('share.copyLink') }}
          </button>
        </div>
        <p class="mx-sr-only" aria-live="polite">{{ copied ? t('share.linkCopied') : '' }}</p>
        <p v-if="hint" class="mx-share__hint" role="status">{{ hint }}</p>

        <button v-if="canNativeShare" type="button" class="mx-share__more" @click="nativeShare()">
          <VIcon icon="mdi-export-variant" size="18" aria-hidden="true" />
          {{ t('share.nativeShare') }}
        </button>

        <div v-if="qr" class="mx-share__qr">
          <p class="mx-share__qr-title">{{ t('share.qr') }}</p>
          <MxQrCode :png="qr.png" :svg="qr.svg" :alt="qr.alt" :download-name="qr.downloadName" :size="168" />
        </div>
      </template>
    </div>
  </MxDialog>
</template>

<style scoped>
.mx-share {
  display: grid;
  gap: 18px;
}

.mx-share__loading {
  display: grid;
  place-items: center;
  min-height: 160px;
}

.mx-share__spinner {
  width: 36px;
  height: 36px;
  border: 4px solid var(--mx-cta);
  border-right-color: transparent;
  border-radius: 50%;
  animation: mx-spin 700ms linear infinite;
}

.mx-share__text {
  margin: 0;
  font-weight: 600;
  line-height: 1.5;
  color: var(--mx-on-surface-muted);
}

.mx-share__targets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.mx-share__targets > li {
  animation: mx-pop-in var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy) both;
}

.mx-share__target {
  display: grid;
  justify-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 0;
  font: inherit;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: 0;
  border-radius: var(--mx-radius-md);
}

.mx-share__target:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-share__bubble {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  color: #ffffff;
  background: var(--mx-surface-raised);
  border-radius: 50%;
  box-shadow: 0 12px 26px -14px var(--mx-shadow);
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-share__bubble--gradient {
  background: linear-gradient(45deg, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5);
}

.mx-share__target:hover .mx-share__bubble {
  transform: translateY(-4px) rotate(-8deg) scale(1.06);
}

.mx-share__label {
  font-size: 0.8125rem;
  font-weight: 750;
  text-align: center;
}

.mx-share__link {
  display: flex;
  gap: 8px;
  padding: 6px;
  background: var(--mx-surface-variant);
  border-radius: var(--mx-radius-pill);
}

.mx-share__url {
  flex: 1;
  min-width: 0;
  padding: 0 12px;
  font: inherit;
  font-size: 0.875rem;
  color: var(--mx-on-surface-muted);
  background: transparent;
  border: 0;
  outline: none;
}

.mx-share__copy,
.mx-share__more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 16px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  border: 0;
  border-radius: var(--mx-radius-pill);
}

.mx-share__copy {
  color: var(--mx-on-cta);
  background: var(--mx-cta);
  transition: transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-share__copy--done {
  animation: mx-pop-in var(--mx-spring-pop-duration) var(--mx-spring-pop);
}

.mx-share__more {
  justify-self: center;
  color: var(--mx-on-surface);
  background: transparent;
  border: 2px solid var(--mx-outline-strong);
}

.mx-share__copy:focus-visible,
.mx-share__more:focus-visible {
  outline: 3px solid var(--mx-focus);
  outline-offset: 2px;
}

.mx-share__hint {
  margin: -6px 0 0;
  font-size: 0.875rem;
  color: var(--mx-on-surface-muted);
}

.mx-share__qr {
  display: grid;
  justify-items: center;
  gap: 4px;
  padding-top: 12px;
  border-top: 1px solid var(--mx-outline);
}

.mx-share__qr-title {
  margin: 0;
  font-size: var(--mx-text-overline);
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--mx-on-surface-muted);
}

@media (prefers-reduced-motion: reduce) {
  .mx-share__targets > li,
  .mx-share__copy--done,
  .mx-share__spinner {
    animation: none;
  }

  .mx-share__bubble,
  .mx-share__copy {
    transition: none;
  }

  .mx-share__target:hover .mx-share__bubble {
    transform: none;
  }
}
</style>
