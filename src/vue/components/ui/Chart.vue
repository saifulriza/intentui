<script setup lang="ts">
import { computed, provide, ref, watch } from "vue"

type ChartConfig = Record<string, { label?: string; color?: string }>
type ChartDatum = Record<string, unknown>

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    config?: ChartConfig
    data?: ChartDatum[]
    dataKey?: string
    layout?: "horizontal" | "vertical" | "radial"
    modelValue?: string | null
    showLegend?: boolean
    legendClickable?: boolean
  }>(),
  {
    title: undefined,
    description: undefined,
    config: () => ({}),
    data: () => [],
    dataKey: "value",
    layout: "horizontal",
    modelValue: null,
    showLegend: true,
    legendClickable: true,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | null]
  "legend-select": [value: string | null]
}>()

const selectedLegend = ref<string | null>(props.modelValue)
const CHART_COLOR_COUNT = 5

watch(
  () => props.modelValue,
  (value) => {
    selectedLegend.value = value
  },
)

watch(selectedLegend, (value) => {
  emit("update:modelValue", value)
  emit("legend-select", value)
})

const categories = computed(() => {
  const configured = Object.keys(props.config)
  if (configured.length > 0) return configured
  if (props.data.length === 0) return []
  const first = props.data[0]
  return Object.keys(first).filter((key) => key !== props.dataKey && key !== "name")
})

const legendItems = computed(() =>
  categories.value.map((key, index) => ({
    key,
    label: props.config[key]?.label ?? key,
    color: props.config[key]?.color ?? `var(--chart-${(index % CHART_COLOR_COUNT) + 1})`,
  })),
)

const handleLegendSelect = (key: string) => {
  if (!props.legendClickable) return
  selectedLegend.value = selectedLegend.value === key ? null : key
}

provide("intentui:chart", {
  config: computed(() => props.config),
  data: computed(() => props.data),
  dataKey: computed(() => props.dataKey),
  layout: computed(() => props.layout),
  selectedLegend,
})
</script>

<template>
  <div data-slot="chart" class="rounded-xl border border-border bg-bg p-4">
    <div v-if="title || description" class="mb-4">
      <h3 v-if="title" class="font-medium text-fg text-sm">{{ title }}</h3>
      <p v-if="description" class="mt-1 text-muted-fg text-xs">{{ description }}</p>
    </div>
    <slot
      :config="config"
      :data="data"
      :data-key="dataKey"
      :layout="layout"
      :selected-legend="selectedLegend"
      :on-legend-select="handleLegendSelect"
    />
    <div v-if="showLegend && legendItems.length > 0" class="mt-3 flex flex-wrap gap-3 text-xs">
      <button
        v-for="item in legendItems"
        :key="item.key"
        type="button"
        class="inline-flex items-center gap-1.5 text-muted-fg transition"
        :class="selectedLegend && selectedLegend !== item.key ? 'opacity-45' : 'opacity-100'"
        :disabled="!legendClickable"
        @click="handleLegendSelect(item.key)"
      >
        <span class="size-2 rounded-full" :style="{ backgroundColor: item.color }" />
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
