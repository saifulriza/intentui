<script setup lang="ts">
import { computed, inject } from "vue"

const sidebar = inject<{ isCollapsed?: { value?: boolean } }>("intent-sidebar", {})
const classes = computed(() => [
  "flex min-h-0 flex-1 flex-col gap-1 overflow-auto",
  sidebar.isCollapsed?.value ? "items-center p-2" : "p-4",
])
</script>

<template>
  <div data-slot="sidebar-content" :class="classes">
    <slot />
  </div>
</template>
