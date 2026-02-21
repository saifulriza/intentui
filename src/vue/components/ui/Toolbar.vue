<script setup lang="ts">
import { provide, toRef } from "vue"

const props = withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical"
    isCircle?: boolean
  }>(),
  {
    orientation: "horizontal",
    isCircle: false,
  },
)

provide("intent-toolbar", {
  orientation: toRef(props, "orientation"),
  isCircle: toRef(props, "isCircle"),
})
</script>

<template>
  <div
    data-slot="toolbar"
    role="toolbar"
    class="group inset-ring inset-ring-border inline-flex gap-1.5 bg-overlay p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    :class="[
      isCircle ? 'rounded-full' : 'rounded-lg',
      orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col items-start',
    ]"
  >
    <slot />
  </div>
</template>
