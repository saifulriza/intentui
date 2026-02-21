<script setup lang="ts">
import { provide, toRef } from "vue"

const props = withDefaults(
  defineProps<{
    separator?: "chevron" | "slash" | boolean
  }>(),
  {
    separator: "chevron",
  },
)

provide("intent-breadcrumbs", {
  separator: toRef(props, "separator"),
})
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol data-slot="breadcrumbs" class="flex items-center gap-2">
      <slot />
    </ol>
  </nav>
</template>
