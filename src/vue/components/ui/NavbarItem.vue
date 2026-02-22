<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    current?: boolean
  }>(),
  {
    current: false,
  },
)
</script>

<template>
  <a
    data-slot="navbar-item"
    :href="href || undefined"
    :aria-current="current ? 'page' : undefined"
    class="rounded-lg px-3 py-1.5 font-medium text-sm/5 transition-colors hover:bg-secondary"
    :class="current ? 'bg-secondary text-fg' : 'text-muted-fg hover:text-secondary-fg'"
  >
    <slot />
  </a>
</template>
