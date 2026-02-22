<script setup lang="ts">
import { inject } from "vue"

const sidebar = inject<{ toggleSidebar?: () => void }>("intent-sidebar", {})
</script>

<template>
  <button
    type="button"
    data-slot="sidebar-trigger"
    aria-label="Toggle Sidebar"
    class="inline-flex items-center justify-center rounded-md p-2 hover:bg-secondary"
    @click="sidebar.toggleSidebar?.()"
  >
    <slot>☰</slot>
  </button>
</template>
