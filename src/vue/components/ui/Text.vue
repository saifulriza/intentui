<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    as?: "p" | "span" | "div"
    muted?: boolean
  }>(),
  {
    as: "p",
    muted: true,
  },
)

const classes = computed(() => ["text-base/6 sm:text-sm/6", props.muted ? "text-muted-fg" : "text-fg"])
</script>

<template>
  <component :is="as" data-slot="text" :class="classes">
    <slot />
  </component>
</template>
