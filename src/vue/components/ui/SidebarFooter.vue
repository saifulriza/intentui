<script setup lang="ts">
import { computed, inject } from "vue"

const sidebar = inject<{ intent?: { value?: string } }>("intent-sidebar", {})
const classes = computed(() => [
  "mt-auto border-t p-2",
  sidebar.intent?.value === "inset" ? "px-4 py-3" : "",
])
</script>

<template>
  <div data-slot="sidebar-footer" :class="classes">
    <slot />
  </div>
</template>
