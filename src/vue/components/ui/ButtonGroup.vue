<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical"
  }>(),
  {
    orientation: "horizontal",
  },
)
</script>

<template>
  <div
    role="group"
    data-slot="button-group"
    :data-orientation="orientation"
    class="flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-e-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1"
    :class="
      orientation === 'horizontal'
        ? '[&>*:not(:first-child)]:rounded-s-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-e-none'
        : 'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none'
    "
  >
    <slot />
  </div>
</template>
