<script setup lang="ts">
export interface DescriptionItem {
  term: string;
  value: string | number | null | undefined;
  mono?: boolean;
  href?: string;
}

withDefaults(defineProps<{ items: readonly DescriptionItem[]; columns?: 1 | 2 | 3 }>(), { columns: 2 });
</script>

<template>
  <dl data-testid="mx-description-list" class="mx-description-list" :class="`mx-description-list--${columns}`">
    <template v-for="item in items" :key="item.term">
      <div v-if="item.value !== null && item.value !== undefined && item.value !== ''" data-testid="mx-description-list-item" class="mx-description-list__item">
        <dt class="mx-description-list__term">{{ item.term }}</dt>
        <dd class="mx-description-list__value" :class="{ 'mx-description-list__value--mono': item.mono }">
          <a v-if="item.href" data-testid="mx-description-list-link" :href="item.href" target="_blank" rel="noopener noreferrer">{{ item.value }}</a>
          <template v-else>{{ item.value }}</template>
        </dd>
      </div>
    </template>
  </dl>
</template>

<style scoped>
.mx-description-list {
  display: grid;
  gap: 14px 24px;
  margin: 0;
}

.mx-description-list--2 { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); }
.mx-description-list--3 { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }

.mx-description-list__item {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.mx-description-list__term {
  font-size: var(--mx-text-overline);
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mx-on-surface-muted);
}

.mx-description-list__value {
  margin: 0;
  font-weight: 650;
  overflow-wrap: anywhere;
}

.mx-description-list__value--mono {
  font-family: var(--mx-font-mono);
  font-size: 0.9375rem;
}

.mx-description-list__value a {
  color: var(--mx-link);
}
</style>
