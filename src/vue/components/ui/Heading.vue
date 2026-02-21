<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    level?: 1 | 2 | 3 | 4
  }>(),
  {
    level: 1,
  },
)

const element = computed(() => `h${props.level}` as "h1" | "h2" | "h3" | "h4")
const classes = computed(() =>
  [
    "font-sans font-semibold text-fg tracking-tight",
    props.level === 1 && "text-xl/8 sm:text-2xl/8",
    props.level === 2 && "text-lg/6 sm:text-xl/8",
    props.level === 3 && "text-base/6 sm:text-lg/6",
    props.level === 4 && "text-base/6",
  ]
    .filter(Boolean)
    .join(" "),
)
</script>

<template>
  <component :is="element" :class="classes">
    <slot />
  </component>
</template>
