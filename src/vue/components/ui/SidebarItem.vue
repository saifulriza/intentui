<script setup lang="ts">
withDefaults(
  defineProps<{
    href?: string
    current?: boolean
    disabled?: boolean
  }>(),
  {
    current: false,
    disabled: false,
  },
)
</script>

<template>
  <a
    data-slot="sidebar-item"
    :href="href || undefined"
    :aria-current="current ? 'page' : undefined"
    :aria-disabled="disabled ? true : undefined"
    class="rounded-lg px-2 py-2 text-sm/5 font-medium transition-colors hover:bg-sidebar-accent"
    :class="[
      current ? 'bg-sidebar-primary text-sidebar-primary-fg hover:bg-sidebar-primary/90' : '',
      disabled ? 'pointer-events-none opacity-50' : '',
    ]"
  >
    <slot />
  </a>
</template>
