<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import DateField from "./DateField.vue"
import RangeCalendar from "./RangeCalendar.vue"

const props = withDefaults(
  defineProps<{
    startValue?: string
    endValue?: string
    disabled?: boolean
  }>(),
  {
    startValue: "",
    endValue: "",
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:startValue": [value: string]
  "update:endValue": [value: string]
}>()

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const triggerRef = ref<HTMLButtonElement | null>(null)
const dialogRef = ref<HTMLDivElement | null>(null)

const close = () => (open.value = false)
const onOutside = (event: MouseEvent) => {
  if (!open.value) return
  if (!root.value?.contains(event.target as Node)) close()
}
const onEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") close()
}
onMounted(() => {
  document.addEventListener("mousedown", onOutside)
  document.addEventListener("keydown", onEscape)
})
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onOutside)
  document.removeEventListener("keydown", onEscape)
})
watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    dialogRef.value?.focus()
  } else {
    triggerRef.value?.focus()
  }
})
</script>

<template>
  <div ref="root" data-slot="date-range-picker" class="relative w-fit">
    <div class="flex items-center gap-2">
      <DateField
        :model-value="startValue"
        :disabled="disabled"
        aria-label="Start date"
        @update:model-value="emit('update:startValue', $event)"
      />
      <span class="text-muted-fg">—</span>
      <DateField
        :model-value="endValue"
        :disabled="disabled"
        aria-label="End date"
        @update:model-value="emit('update:endValue', $event)"
      />
      <button
        ref="triggerRef"
        type="button"
        class="rounded-md px-2 py-1 text-muted-fg hover:text-fg"
        :disabled="disabled"
        @click="open = !open"
      >
        <span aria-hidden="true">📅</span>
        <span class="sr-only">Toggle range calendar</span>
      </button>
    </div>
    <div
      v-if="open"
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      aria-label="Date range picker"
      tabindex="-1"
      class="absolute left-0 top-full z-50 mt-2"
    >
      <RangeCalendar
        :start-value="startValue"
        :end-value="endValue"
        @update:start-value="emit('update:startValue', $event)"
        @update:end-value="emit('update:endValue', $event)"
      />
    </div>
  </div>
</template>
