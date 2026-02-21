<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import Calendar from "./Calendar.vue"
import DateField from "./DateField.vue"

const props = withDefaults(
  defineProps<{
    modelValue?: string
    disabled?: boolean
  }>(),
  {
    modelValue: "",
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
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

const updateFromCalendar = (value: string) => {
  emit("update:modelValue", value)
  close()
}
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
  <div ref="root" data-slot="date-picker" class="relative w-fit">
    <div class="flex items-center gap-1">
      <DateField
        :model-value="modelValue"
        :disabled="disabled"
        @update:model-value="emit('update:modelValue', $event)"
      />
      <button
        ref="triggerRef"
        type="button"
        data-slot="date-picker-trigger"
        class="rounded-md px-2 py-1 text-muted-fg hover:text-fg"
        :disabled="disabled"
        @click="open = !open"
      >
        <span aria-hidden="true">📅</span>
        <span class="sr-only">Toggle calendar</span>
      </button>
    </div>
    <div
      v-if="open"
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      aria-label="Date picker"
      tabindex="-1"
      class="absolute left-0 top-full z-50 mt-2"
    >
      <Calendar :model-value="modelValue" @update:model-value="updateFromCalendar" />
    </div>
  </div>
</template>
