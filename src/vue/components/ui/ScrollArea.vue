<script setup lang="ts">
type ScrollAreaOrientation = "vertical" | "horizontal" | "both"

withDefaults(
  defineProps<{
    orientation?: ScrollAreaOrientation
    scrollFade?: boolean
    scrollbarGutter?: boolean
  }>(),
  {
    orientation: "both",
    scrollFade: false,
    scrollbarGutter: false,
  },
)
</script>

<template>
  <div data-slot="scroll-area" class="size-full min-h-0">
    <div
      data-slot="scroll-area-viewport"
      class="h-full rounded-[inherit] outline-none"
      :class="[
        orientation === 'vertical'
          ? 'overflow-y-auto overflow-x-hidden'
          : orientation === 'horizontal'
            ? 'overflow-x-auto overflow-y-hidden'
            : 'overflow-auto',
        scrollFade ? 'mask-b-from-90% mask-t-from-90%' : '',
        scrollbarGutter ? 'pe-2.5 pb-2.5' : '',
      ]"
    >
      <slot />
    </div>
  </div>
</template>
