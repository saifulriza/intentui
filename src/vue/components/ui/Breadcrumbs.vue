<script setup lang="ts">
import { computed, provide, toRef } from "vue"

const props = withDefaults(
  defineProps<{
    separator?: "chevron" | "slash" | boolean
    ariaLabel?: string
  }>(),
  {
    separator: "chevron",
    ariaLabel: "Breadcrumb",
  },
)

provide("intent-breadcrumbs", {
  separator: toRef(props, "separator"),
})

const listClass = computed(() => ["flex items-center gap-2"])
</script>

<template>
  <nav data-slot="breadcrumbs-nav" :aria-label="ariaLabel">
    <ol data-slot="breadcrumbs" :class="listClass">
      <slot />
    </ol>
  </nav>
</template>
