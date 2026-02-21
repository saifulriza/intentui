<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    closeOnOutsideClick?: boolean
    arrow?: boolean
    ariaLabel?: string
  }>(),
  {
    modelValue: false,
    closeOnOutsideClick: true,
    arrow: false,
    ariaLabel: "Popover",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const root = ref<HTMLElement | null>(null)
const popoverClasses = [
  "group/popover absolute left-0 top-full z-50 mt-2 min-w-40 max-w-xs",
  "rounded-xl bg-overlay text-overlay-fg shadow-xs outline-hidden",
  "ring ring-muted-fg/20 drop-shadow-xl transition-transform sm:text-sm dark:ring-border",
  "[--gutter:--spacing(6)]",
].join(" ")

const onClickOutside = (event: MouseEvent) => {
  if (!props.modelValue || !props.closeOnOutsideClick) return
  if (!root.value?.contains(event.target as Node)) emit("update:modelValue", false)
}

watch(
  () => props.modelValue,
  (open) => {
    if (open && props.closeOnOutsideClick) {
      document.addEventListener("mousedown", onClickOutside)
    } else {
      document.removeEventListener("mousedown", onClickOutside)
    }
  },
  { immediate: true },
)
onBeforeUnmount(() => document.removeEventListener("mousedown", onClickOutside))
</script>

<template>
  <div ref="root" data-slot="popover" class="relative inline-flex">
    <slot name="trigger" />
    <div
      v-if="modelValue"
      data-slot="popover-content"
      :aria-label="ariaLabel"
      :class="popoverClasses"
    >
      <div
        v-if="arrow"
        class="absolute -top-1 left-4 h-2 w-2 rotate-45 border-l border-t border-border bg-overlay"
        aria-hidden="true"
      />
      <div data-slot="popover-inner" class="max-h-[inherit] overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>
