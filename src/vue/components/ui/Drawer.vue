<script setup lang="ts">
import Dialog from "./Dialog.vue"

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    side?: "top" | "bottom" | "left" | "right"
    title?: string
    description?: string
    notch?: boolean
    dismissable?: boolean
  }>(),
  {
    modelValue: false,
    side: "bottom",
    notch: true,
    dismissable: true,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const close = () => emit("update:modelValue", false)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50 bg-black/20 backdrop-blur-[1px]"
      @click.self="dismissable ? close() : undefined"
    >
      <div aria-hidden="true" class="absolute inset-0" />
      <div
        :class="[
          'fixed max-h-full touch-none overflow-hidden bg-bg text-fg ring ring-input',
          side === 'left' || side === 'right' ? 'inset-y-0 h-auto w-full max-w-xs overflow-y-auto' : '',
          side === 'bottom' ? 'inset-x-0 bottom-0 rounded-t-2xl' : '',
          side === 'top' ? 'inset-x-0 top-0 rounded-b-2xl' : '',
          side === 'left' ? 'left-0' : '',
          side === 'right' ? 'right-0' : '',
        ]"
      >
        <Dialog :title="title" :description="description" :dismissable="dismissable" @close="close">
          <div
            v-if="notch && (side === 'bottom' || side === 'top')"
            class="notch sticky top-0 mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-fg/20"
          />
          <slot />
          <template #footer><slot name="footer" /></template>
        </Dialog>
      </div>
    </div>
  </Teleport>
</template>
