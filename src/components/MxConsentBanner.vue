<script setup lang="ts">
import { useId } from 'vue';
import { useMixtapeText } from '../i18n/useMixtapeText';
import type { LinkTarget } from '../links/links';
import MxButton from './MxButton.vue';
import MxLink from './MxLink.vue';

withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    description: string;
    policyTo?: LinkTarget;
    acceptLabel?: string;
    rejectLabel?: string;
  }>(),
  {},
);

const emit = defineEmits<{ accept: []; reject: [] }>();

const { t } = useMixtapeText();
const titleId = useId();
const descriptionId = useId();
</script>

<template>
  <Transition name="mx-consent" appear>
    <section
      v-if="open"
      class="mx-consent mx-glass"
      role="region"
      :aria-labelledby="titleId"
      :aria-describedby="descriptionId"
    >
      <div class="mx-consent__icon" aria-hidden="true">
        <VIcon icon="mdi-cookie-outline" />
      </div>
      <div class="mx-consent__text">
        <h2 :id="titleId" class="mx-consent__title">{{ title }}</h2>
        <p :id="descriptionId" class="mx-consent__description">
          {{ description }}
          <MxLink v-if="policyTo !== undefined" :to="policyTo" class="mx-consent__policy">{{ t('consent.policy') }}</MxLink>
        </p>
      </div>
      <div class="mx-consent__actions">
        <MxButton variant="outline" size="sm" :label="rejectLabel ?? t('consent.reject')" @click="emit('reject')" />
        <MxButton variant="cta" size="sm" :label="acceptLabel ?? t('consent.accept')" @click="emit('accept')" />
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.mx-consent {
  position: fixed;
  right: 12px;
  bottom: calc(var(--mx-tab-bar-height) + 20px + env(safe-area-inset-bottom));
  left: 12px;
  z-index: var(--mx-z-overlay);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px 14px;
  max-width: 560px;
  padding: 16px 18px;
  color: var(--mx-on-surface);
  border-radius: var(--mx-radius-lg);
}

@media (min-width: 840px) {
  .mx-consent {
    right: auto;
    bottom: 24px;
    left: 24px;
  }
}

.mx-consent__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  font-size: 24px;
  color: var(--mx-on-cta);
  background: var(--mx-cta);
  border-radius: 50%;
  animation: mx-wiggle 1.2s var(--mx-ease-out) 600ms 2;
}

.mx-consent__title {
  margin: 0 0 4px;
  font-family: var(--mx-font-display);
  font-size: 1.125rem;
  font-weight: 800;
}

.mx-consent__description {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--mx-on-surface-muted);
}

.mx-consent__policy {
  font-weight: 800;
  color: var(--mx-link);
}

.mx-consent__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  grid-column: 1 / -1;
}

.mx-consent-enter-active {
  transition:
    opacity var(--mx-duration-normal) var(--mx-ease-out),
    transform var(--mx-spring-bouncy-duration) var(--mx-spring-bouncy);
}

.mx-consent-leave-active {
  transition:
    opacity var(--mx-duration-fast) var(--mx-ease-in),
    transform var(--mx-duration-fast) var(--mx-ease-in);
}

.mx-consent-enter-from,
.mx-consent-leave-to {
  opacity: 0;
  transform: translateY(32px);
}

@media (prefers-reduced-motion: reduce) {
  .mx-consent__icon {
    animation: none;
  }

  .mx-consent-enter-active,
  .mx-consent-leave-active {
    transition: opacity 1ms linear;
  }

  .mx-consent-enter-from,
  .mx-consent-leave-to {
    transform: none;
  }
}
</style>
