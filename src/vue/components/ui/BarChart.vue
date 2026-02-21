<script setup lang="ts">
import { computed } from "vue"

type Datum = Record<string, string | number | null | undefined>
type Config = Record<string, { label?: string; color?: string }>

const props = withDefaults(
  defineProps<{
    data?: Datum[]
    dataKey?: string
    config?: Config
  }>(),
  {
    data: () => [],
    dataKey: "name",
    config: () => ({}),
  },
)

const padding = 16
const minBarHeight = 0.8
const minBarWidth = 1.8
const groupInnerSpacing = 2
const barSpacing = 0.6
const groupStartOffset = 1
const CHART_COLOR_COUNT = 5
const categories = computed(() => {
  const keys = Object.keys(props.config)
  if (keys.length) return keys
  const first = props.data[0] ?? {}
  return Object.keys(first).filter((key) => key !== props.dataKey)
})

const maxValue = computed(() => {
  const values = props.data.flatMap((item) =>
    categories.value.map((category) => Number(item[category] ?? 0)).filter((value) => Number.isFinite(value)),
  )
  return Math.max(1, ...values)
})

const groupedBars = computed(() => {
  const groups = props.data.length || 1
  const groupWidth = (100 - padding * 2) / groups
  const barWidth = Math.max(minBarWidth, (groupWidth - groupInnerSpacing) / Math.max(1, categories.value.length))

  return props.data.flatMap((item, groupIndex) => {
    const groupStart = padding + groupIndex * groupWidth + groupStartOffset
    return categories.value.map((category, categoryIndex) => {
      const value = Number(item[category] ?? 0)
      const height = (value / maxValue.value) * (100 - padding * 2)
      return {
        key: `${groupIndex}-${category}`,
        label: props.config[category]?.label ?? category,
        color: props.config[category]?.color ?? `var(--chart-${(categoryIndex % CHART_COLOR_COUNT) + 1})`,
        x: groupStart + categoryIndex * barWidth,
        y: 100 - padding - height,
        width: barWidth - barSpacing,
        height,
      }
    })
  })
})

const legend = computed(() =>
  categories.value.map((category, categoryIndex) => ({
    key: category,
    label: props.config[category]?.label ?? category,
    color: props.config[category]?.color ?? `var(--chart-${(categoryIndex % CHART_COLOR_COUNT) + 1})`,
  })),
)
</script>

<template>
  <div data-slot="bar-chart" class="space-y-3">
    <svg viewBox="0 0 100 100" class="h-auto w-full overflow-visible" role="img" aria-label="Bar chart">
      <line x1="16" y1="84" x2="16" y2="16" class="stroke-border" stroke-width="0.4" />
      <line x1="16" y1="84" x2="84" y2="84" class="stroke-border" stroke-width="0.4" />
      <rect
        v-for="bar in groupedBars"
        :key="bar.key"
        :x="bar.x"
        :y="bar.y"
        :width="bar.width"
        :height="Math.max(minBarHeight, bar.height)"
        :fill="bar.color"
        rx="0.8"
      />
    </svg>

    <div class="flex flex-wrap gap-3 text-xs">
      <span v-for="item in legend" :key="`legend-${item.key}`" class="inline-flex items-center gap-1.5 text-muted-fg">
        <span class="size-2 rounded-full" :style="{ backgroundColor: item.color }" />
        {{ item.label }}
      </span>
    </div>
  </div>
</template>
