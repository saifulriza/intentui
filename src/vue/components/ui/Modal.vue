<script setup lang="ts">
import { computed } from "vue"
import Dialog from "./Dialog.vue"

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    description?: string
    role?: "dialog" | "alertdialog"
    dismissable?: boolean
    size?: "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "fullscreen"
  }>(),
  {
    modelValue: false,
    role: "dialog",
    dismissable: true,
    size: "md",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const sizeClass = {
  "2xs": "sm:max-w-2xs",
  xs: "sm:max-w-xs",
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
  fullscreen: "",
} as const

const close = () => emit("update:modelValue", false)

const containerClasses = computed(() =>
  [
    "relative overflow-hidden bg-overlay text-overlay-fg",
    "inset-shadow-xs rounded-t-2xl ring ring-muted-fg/25 drop-shadow-xl sm:rounded-2xl dark:ring-border",
    sizeClass[props.size],
    "row-start-2 w-full text-start align-middle",
  ].join(" "),
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      data-slot="modal-overlay"
      class="fixed start-0 top-0 z-50 h-screen w-screen bg-bg/15 backdrop-blur-[1px] motion-reduce:backdrop-blur-none grid grid-rows-[1fr_auto_1fr] justify-items-center sm:grid-rows-[1fr_auto_3fr]"
      @click.self="dismissable ? close() : undefined"
    >
      <div aria-hidden="true" class="absolute inset-0" />
      <div data-slot="modal-content" :class="containerClasses">
        <Dialog
          :role="role"
          :title="title"
          :description="description"
          :dismissable="dismissable"
          @close="close"
        >
          <slot />
          <template #footer>
            <slot name="footer" />
          </template>
        </Dialog>
      </div>
    </div>
  </Teleport>
</template>
