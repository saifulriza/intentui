<script setup lang="ts">
import { computed, ref } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: string
  }>(),
  { modelValue: "" },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const now = new Date()
const monthCursor = ref(new Date(now.getFullYear(), now.getMonth(), 1))

const monthLabel = computed(() =>
  monthCursor.value.toLocaleString(undefined, { month: "long", year: "numeric" }),
)
const weekdays = computed(() => {
  const base = new Date(2024, 0, 7)
  return Array.from({ length: 7 }).map((_, i) =>
    new Date(base.getFullYear(), base.getMonth(), base.getDate() + i).toLocaleDateString(undefined, {
      weekday: "short",
    }),
  )
})

const days = computed(() => {
  const year = monthCursor.value.getFullYear()
  const month = monthCursor.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()
  const cells: { date: string; label: number; current: boolean }[] = []

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    const d = new Date(year, month - 1, day)
    cells.push({ date: d.toISOString().slice(0, 10), label: day, current: false })
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day)
    cells.push({ date: d.toISOString().slice(0, 10), label: day, current: true })
  }
  while (cells.length % 7 !== 0) {
    const day = cells.length - (firstDay + daysInMonth) + 1
    const d = new Date(year, month + 1, day)
    cells.push({ date: d.toISOString().slice(0, 10), label: day, current: false })
  }
  return cells
})

const selectDate = (value: string) => emit("update:modelValue", value)
const prevMonth = () =>
  (monthCursor.value = new Date(monthCursor.value.getFullYear(), monthCursor.value.getMonth() - 1, 1))
const nextMonth = () =>
  (monthCursor.value = new Date(monthCursor.value.getFullYear(), monthCursor.value.getMonth() + 1, 1))
</script>

<template>
  <div data-slot="calendar" class="w-fit rounded-xl border bg-bg p-2">
    <header data-slot="calendar-header" class="mb-2 flex items-center justify-between gap-2">
      <button
        type="button"
        aria-label="Previous month"
        class="rounded-md px-2 py-1 hover:bg-secondary"
        @click="prevMonth"
      >
        ‹
      </button>
      <h3 class="font-medium text-sm">{{ monthLabel }}</h3>
      <button
        type="button"
        aria-label="Next month"
        class="rounded-md px-2 py-1 hover:bg-secondary"
        @click="nextMonth"
      >
        ›
      </button>
    </header>
    <div class="grid grid-cols-7 gap-1 text-center text-xs text-muted-fg">
      <span v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>
    <div class="mt-1 grid grid-cols-7 gap-1">
      <button
        v-for="item in days"
        :key="item.date"
        type="button"
        class="size-9 rounded-md text-sm"
        :class="[
          item.current ? 'text-fg hover:bg-secondary' : 'text-muted-fg/70 hover:bg-secondary/60',
          modelValue === item.date ? 'bg-primary text-primary-fg hover:bg-primary/90' : '',
        ]"
        @click="selectDate(item.date)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
