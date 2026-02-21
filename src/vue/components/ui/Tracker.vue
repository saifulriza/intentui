<script setup lang="ts">
type TrackerBlock = {
  key?: string | number
  color?: string
  tooltip?: string
  backgroundColor?: string
}

const props = withDefaults(
  defineProps<{
    data?: TrackerBlock[]
    disabledTooltip?: boolean
    defaultBackgroundColor?: string
  }>(),
  {
    data: () => [],
    disabledTooltip: false,
    defaultBackgroundColor: "bg-secondary",
  },
)

const blockClasses =
  "size-full overflow-hidden px-[0.5px] transition first:rounded-s-sm first:ps-0 last:rounded-e-sm last:pe-0 sm:px-px"
</script>

<template>
  <div data-slot="tracker" class="group flex h-8 w-full items-center">
    <div
      v-for="(item, index) in data"
      :key="item.key ?? index"
      :class="blockClasses"
      :title="disabledTooltip ? undefined : item.tooltip"
    >
      <div
        class="size-full rounded-[1px] hover:opacity-50"
        :class="item.color ?? item.backgroundColor ?? defaultBackgroundColor"
      />
    </div>
  </div>
</template>
