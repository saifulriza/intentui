<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    soft?: boolean
  }>(),
  {
    soft: false,
  },
)
</script>

<template>
  <div data-slot="skeleton" class="shrink-0 animate-pulse rounded-lg" :class="soft ? 'bg-muted-fg/20' : 'bg-muted-fg/40'">
    <slot />
  </div>
</template>
