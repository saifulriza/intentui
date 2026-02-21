<script setup lang="ts">
withDefaults(
  defineProps<{
    x?: number
    y?: number
    color?: string
    disabled?: boolean
  }>(),
  {
    x: 50,
    y: 50,
    color: "transparent",
    disabled: false,
  },
)
</script>

<template>
  <span
    data-slot="color-thumb"
    class="pointer-events-none absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white [box-shadow:0_0_0_1px_black,inset_0_0_0_1px_black]"
    :class="{ 'opacity-50': disabled }"
    :style="{
      left: `${x}%`,
      top: `${y}%`,
      backgroundColor: color,
    }"
  >
    <slot />
  </span>
</template>
