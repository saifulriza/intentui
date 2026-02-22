<script setup lang="ts">
import { computed, ref, watch } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: string
    length?: number
    disabled?: boolean
    name?: string
  }>(),
  {
    modelValue: "",
    length: 6,
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const slots = ref<string[]>(Array.from({ length: props.length }).map(() => ""))
const inputRefs = ref<HTMLInputElement[]>([])
const focusedIndex = ref(-1)

watch(
  () => props.modelValue,
  (value) => {
    const next = value.slice(0, props.length).split("")
    slots.value = Array.from({ length: props.length }).map((_, i) => next[i] ?? "")
  },
  { immediate: true },
)

const merged = computed(() => slots.value.join(""))

watch(merged, (value) => emit("update:modelValue", value))

const setRef = (el: HTMLInputElement | null, index: number) => {
  if (!el) return
  inputRefs.value[index] = el
}

const onInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, "")
  if (!value) {
    slots.value[index] = ""
    return
  }
  slots.value[index] = value[value.length - 1]
  if (index < props.length - 1) inputRefs.value[index + 1]?.focus()
}

const onPaste = (event: ClipboardEvent, index: number) => {
  event.preventDefault()
  const text = event.clipboardData?.getData("text") ?? ""
  const digits = text.replace(/\D/g, "")
  if (!digits) return
  for (let i = 0; i < digits.length && index + i < props.length; i++) {
    slots.value[index + i] = digits[i]
  }
  const nextFocus = Math.min(index + digits.length, props.length - 1)
  inputRefs.value[nextFocus]?.focus()
}

const onKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === "Backspace" && !slots.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
  if (event.key === "ArrowLeft" && index > 0) inputRefs.value[index - 1]?.focus()
  if (event.key === "ArrowRight" && index < props.length - 1) inputRefs.value[index + 1]?.focus()
}
</script>

<template>
  <div data-slot="input-otp" class="flex items-center gap-2 has-disabled:opacity-50">
    <input v-if="name" type="hidden" :name="name" :value="merged" />
    <div data-slot="input-otp-group" class="flex items-center">
      <input
        v-for="(_, index) in length"
        :key="index"
        :ref="(el) => setRef(el as HTMLInputElement | null, index)"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :value="slots[index]"
        :disabled="disabled"
        data-slot="input-otp-slot"
        :data-active="focusedIndex === index"
        class="relative flex size-9 items-center justify-center border-input border-y border-r text-center shadow-xs outline-none transition-all first:rounded-s-[calc(var(--radius-lg)-1px)] first:border-l last:rounded-e-[calc(var(--radius-lg)-1px)] data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:bg-primary-subtle/10 data-[active=true]:ring-3 data-[active=true]:ring-ring/20 sm:text-sm/6"
        @input="onInput($event, index)"
        @paste="onPaste($event, index)"
        @keydown="onKeydown($event, index)"
        @focus="focusedIndex = index"
        @blur="focusedIndex = -1"
      />
    </div>
  </div>
</template>
