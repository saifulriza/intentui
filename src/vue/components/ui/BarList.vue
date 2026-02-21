<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed } from "vue"
import Link from "./Link.vue"

type Bar = T & {
  key?: string
  href?: string
  value: number
  name: string
}

const props = withDefaults(
  defineProps<{
    data?: Bar[]
    sortOrder?: "ascending" | "descending" | "none"
    valueFormatter?: (value: number) => string
    clickable?: boolean
    minBarWidthPercentage?: number
  }>(),
  {
    data: () => [],
    sortOrder: "descending",
    valueFormatter: (value: number) => value.toString(),
    clickable: false,
    minBarWidthPercentage: 2,
  },
)

const emit = defineEmits<{
  valueChange: [payload: Bar]
}>()

const sortedData = computed(() => {
  if (props.sortOrder === "none") return props.data
  return [...props.data].sort((a, b) =>
    props.sortOrder === "ascending" ? a.value - b.value : b.value - a.value,
  )
})

const widths = computed(() => {
  const maxValue = Math.max(...sortedData.value.map((item) => item.value), 0)
  if (maxValue === 0) return sortedData.value.map(() => 0)
  return sortedData.value.map((item) =>
    item.value === 0 ? 0 : Math.max((item.value / maxValue) * 100, props.minBarWidthPercentage),
  )
})
</script>

<template>
  <div class="flex justify-between space-x-6">
    <div class="relative w-full space-y-1.5">
      <component
        :is="clickable ? 'button' : 'div'"
        v-for="(item, index) in sortedData"
        :key="item.key ?? item.name"
        :type="clickable ? 'button' : undefined"
        :aria-label="clickable ? `${item.name}: ${valueFormatter(item.value)}` : undefined"
        class="group w-full rounded-sm"
        :class="clickable ? 'cursor-pointer hover:bg-secondary focus:inset-ring focus:inset-ring-ring focus:outline-hidden focus:ring-2 focus:ring-ring/20' : ''"
        @click="clickable && emit('valueChange', item)"
      >
        <div
          class="flex h-8 items-center rounded-sm bg-primary/30"
          :class="clickable ? 'group-hover:bg-primary/40 dark:group-hover:bg-primary/40' : ''"
          :style="{ width: `${widths[index]}%` }"
        >
          <div class="absolute start-2 flex max-w-full pe-3 sm:pe-2">
            <Link
              v-if="item.href"
              :href="item.href"
              target="_blank"
              rel="noreferrer"
              class="truncate whitespace-nowrap rounded-sm text-base/6 text-fg sm:text-sm/6 hover:underline hover:underline-offset-2 focus:inset-ring focus:inset-ring-ring focus:outline-hidden focus:ring-2 focus:ring-ring/20"
              @click.stop
            >
              {{ item.name }}
            </Link>
            <p v-else class="truncate whitespace-nowrap text-base/6 text-fg sm:text-sm/6">
              {{ item.name }}
            </p>
          </div>
        </div>
      </component>
    </div>
    <div>
      <div
        v-for="(item, index) in sortedData"
        :key="item.key ?? item.name"
        class="flex h-8 items-center justify-end"
        :class="index === sortedData.length - 1 ? 'mb-0' : 'mb-1.5'"
      >
        <p class="truncate whitespace-nowrap text-fg text-sm leading-none">
          {{ valueFormatter(item.value) }}
        </p>
      </div>
    </div>
  </div>
</template>
