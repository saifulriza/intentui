<script setup lang="ts">
import { computed } from "vue"

type Datum = Record<string, string | number | null | undefined>

const props = withDefaults(
  defineProps<{
    data?: Datum[]
    dataKey?: string
    nameKey?: string
    donut?: boolean
  }>(),
  {
    data: () => [],
    dataKey: "value",
    nameKey: "name",
    donut: false,
  },
)
const CHART_COLOR_COUNT = 5

const total = computed(() =>
  props.data.reduce((sum, item) => sum + Math.max(0, Number(item[props.dataKey] ?? 0)), 0),
)

/**
 * Build an SVG wedge path from circle center/radius and start/end angles (radians).
 */
function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const x1 = cx + r * Math.cos(start)
  const y1 = cy + r * Math.sin(start)
  const x2 = cx + r * Math.cos(end)
  const y2 = cy + r * Math.sin(end)
  // SVG path: move to center -> line to arc start -> draw arc to arc end -> close wedge.
  // `largeArc` switches to the larger arc when the sweep is more than 180 degrees.
  const largeArc = end - start > Math.PI ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

const segments = computed(() => {
  let current = -Math.PI / 2
  return props.data.map((item, index) => {
    const value = Math.max(0, Number(item[props.dataKey] ?? 0))
    const angle = total.value === 0 ? 0 : (value / total.value) * Math.PI * 2
    const start = current
    const end = current + angle
    current = end

    return {
      key: `${item[props.nameKey] ?? index}`,
      label: String(item[props.nameKey] ?? `Item ${index + 1}`),
      value,
      color: `var(--chart-${(index % CHART_COLOR_COUNT) + 1})`,
      path: describeArc(50, 50, 34, start, end),
    }
  })
})
</script>

<template>
  <div data-slot="pie-chart" class="space-y-3">
    <svg viewBox="0 0 100 100" class="h-auto w-full" role="img" aria-label="Pie chart">
      <g v-if="segments.length > 0">
        <path v-for="segment in segments" :key="segment.key" :d="segment.path" :fill="segment.color" />
      </g>
      <circle v-if="donut" cx="50" cy="50" r="16" class="fill-bg" />
    </svg>

    <div class="flex flex-wrap gap-3 text-xs">
      <span
        v-for="segment in segments"
        :key="`legend-${segment.key}`"
        class="inline-flex items-center gap-1.5 text-muted-fg"
      >
        <span class="size-2 rounded-full" :style="{ backgroundColor: segment.color }" />
        {{ segment.label }} ({{ segment.value }})
      </span>
    </div>
  </div>
</template>
