<script setup lang="ts">
import Dialog from "./Dialog.vue"

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    side?: "top" | "bottom" | "left" | "right"
    title?: string
    description?: string
    dismissable?: boolean
    isFloat?: boolean
  }>(),
  {
    modelValue: false,
    side: "right",
    dismissable: true,
    isFloat: true,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const close = () => emit("update:modelValue", false)

const sideVariants: Record<string, string> = {
  top: "inset-x-0 top-0 rounded-b-2xl border-b border-fg/20 dark:border-border data-[float=true]:inset-x-2 data-[float=true]:top-2 data-[float=true]:border-b-0",
  bottom:
    "inset-x-0 bottom-0 rounded-t-2xl border-t border-fg/20 dark:border-border data-[float=true]:inset-x-2 data-[float=true]:bottom-2 data-[float=true]:border-t-0",
  left: "inset-y-0 left-0 h-auto w-3/4 overflow-y-auto border-r border-fg/20 dark:border-border sm:max-w-80 data-[float=true]:inset-y-2 data-[float=true]:left-2 data-[float=true]:border-r-0",
  right:
    "inset-y-0 right-0 h-auto w-3/4 overflow-y-auto border-l border-fg/20 dark:border-border sm:max-w-80 data-[float=true]:inset-y-2 data-[float=true]:right-2 data-[float=true]:border-l-0",
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed start-0 top-0 z-50 size-full overflow-hidden bg-black/15"
      @click.self="dismissable ? close() : undefined"
    >
      <div aria-hidden="true" class="absolute inset-0" />
      <div
        :data-float="isFloat"
        :class="[
          'fixed z-50 grid gap-4 border-fg/20 bg-overlay text-overlay-fg shadow-lg dark:border-border',
          'data-[float=true]:rounded-lg data-[float=true]:ring data-[float=true]:ring-fg/5 dark:data-[float=true]:ring-border',
          sideVariants[side],
        ]"
      >
        <Dialog :title="title" :description="description" :dismissable="dismissable" @close="close">
          <slot />
          <template #footer><slot name="footer" /></template>
        </Dialog>
      </div>
    </div>
  </Teleport>
</template>
