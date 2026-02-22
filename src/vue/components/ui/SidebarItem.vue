<script setup lang="ts">
import { computed, inject } from "vue"

const props = withDefaults(
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

const sidebar = inject<{ isCollapsed?: { value?: boolean } }>("intent-sidebar", {})

const classes = computed(() => [
  "rounded-lg text-sm/5 font-medium transition-colors hover:bg-sidebar-accent",
  props.current ? "bg-sidebar-primary text-sidebar-primary-fg hover:bg-sidebar-primary/90" : "",
  props.disabled ? "pointer-events-none opacity-50" : "",
  sidebar.isCollapsed?.value ? "px-2 py-2 text-center" : "px-2 py-2",
])
</script>

<template>
  <a
    data-slot="sidebar-item"
    :href="href || undefined"
    :aria-current="current ? 'page' : undefined"
    :aria-disabled="disabled ? true : undefined"
    :class="classes"
  >
    <slot />
  </a>
</template>
