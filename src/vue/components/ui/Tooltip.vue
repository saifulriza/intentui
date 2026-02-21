<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    inverse?: boolean
    arrow?: boolean
    text?: string
  }>(),
  {
    modelValue: false,
    inverse: false,
    arrow: true,
    text: "",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const internalOpen = ref(false)
const instance = getCurrentInstance()
const tooltipId = `tooltip-${instance?.uid ?? crypto.randomUUID()}`

const isOpen = computed(() => props.modelValue || internalOpen.value)

const open = () => {
  internalOpen.value = true
  emit("update:modelValue", true)
}
const close = () => {
  internalOpen.value = false
  emit("update:modelValue", false)
}
</script>

<template>
  <span
    data-slot="tooltip"
    class="relative inline-flex"
    :aria-describedby="isOpen ? tooltipId : undefined"
    @mouseenter="open"
    @mouseleave="close"
    @focusin="open"
    @focusout="close"
  >
    <slot />
    <span
      v-if="isOpen"
      :id="tooltipId"
      role="tooltip"
      class="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 max-w-sm rounded-lg border px-2.5 py-1.5 text-sm/6"
      :class="inverse ? 'border-transparent bg-fg text-bg' : 'border-muted-fg/30 bg-overlay text-overlay-fg'"
    >
      <span
        v-if="arrow"
        class="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t"
        :class="inverse ? 'border-transparent bg-fg' : 'border-border bg-overlay'"
        aria-hidden="true"
      />
      <slot name="content">
        {{ text }}
      </slot>
    </span>
  </span>
</template>
