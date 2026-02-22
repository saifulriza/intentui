<script setup lang="ts">
import { computed } from "vue"

type Datum = Record<string, string | number | null | undefined>
type Config = Record<string, { label?: string; color?: string }>

const props = withDefaults(
  defineProps<{
    data?: Datum[]
    dataKey?: string
    config?: Config
    height?: number
  }>(),
  {
    data: () => [],
    dataKey: "name",
    config: () => ({}),
    height: 240,
  },
)

const padding = 16
const SINGLE_POINT_CENTER_X = 50
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

const series = computed(() =>
  categories.value.map((category, categoryIndex) => {
    const points = props.data.map((item, index) => {
      const x =
        props.data.length <= 1
          ? SINGLE_POINT_CENTER_X
          : padding + (index * (100 - padding * 2)) / (props.data.length - 1)
      const y = 100 - padding - (Number(item[category] ?? 0) / maxValue.value) * (100 - padding * 2)
      return { x, y }
    })

    return {
      key: category,
      label: props.config[category]?.label ?? category,
      color: props.config[category]?.color ?? `var(--chart-${(categoryIndex % CHART_COLOR_COUNT) + 1})`,
      polyline: points.map((point) => `${point.x},${point.y}`).join(" "),
      points,
    }
  }),
)
</script>

<template>
  <div data-slot="line-chart" class="space-y-3">
    <svg viewBox="0 0 100 100" class="h-auto w-full overflow-visible" role="img" aria-label="Line chart">
      <line x1="16" y1="84" x2="16" y2="16" class="stroke-border" stroke-width="0.4" />
      <line x1="16" y1="84" x2="84" y2="84" class="stroke-border" stroke-width="0.4" />
      <g v-for="item in series" :key="item.key">
        <polyline fill="none" :points="item.polyline" :stroke="item.color" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
        <circle v-for="(point, index) in item.points" :key="`${item.key}-${index}`" :cx="point.x" :cy="point.y" r="1.1" :fill="item.color" />
      </g>
    </svg>

    <div class="flex flex-wrap gap-3 text-xs">
      <span v-for="item in series" :key="`legend-${item.key}`" class="inline-flex items-center gap-1.5 text-muted-fg">
        <span class="size-2 rounded-full" :style="{ backgroundColor: item.color }" />
        {{ item.label }}
      </span>
    </div>
  </div>
</template>
