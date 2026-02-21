<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string
    size?: number
    rounded?: "sm" | "md" | "lg" | "full"
  }>(),
  {
    color: "transparent",
    size: 36,
    rounded: "md",
  },
)
</script>

<template>
  <div
    data-slot="color-swatch"
    class="inline-block shrink-0 inset-ring-1 inset-ring-current/20"
    :class="{
      'rounded-sm': rounded === 'sm',
      'rounded-md': rounded === 'md',
      'rounded-lg': rounded === 'lg',
      'rounded-full': rounded === 'full',
    }"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
    }"
  >
    <slot />
  </div>
</template>
