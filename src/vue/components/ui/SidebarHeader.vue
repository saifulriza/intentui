<script setup lang="ts">
import { computed, inject } from "vue"

const sidebar = inject<{ isCollapsed?: { value?: boolean }; intent?: { value?: string } }>(
  "intent-sidebar",
  {},
)

const classes = computed(() => [
  "flex items-center gap-2",
  sidebar.isCollapsed?.value ? "p-2.5" : "p-4",
  sidebar.intent?.value === "inset" ? "px-4" : "",
])
</script>

<template>
  <div data-slot="sidebar-header" :class="classes">
    <slot />
  </div>
</template>
