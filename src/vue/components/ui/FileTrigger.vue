<script setup lang="ts">
import { computed, ref } from "vue"
import Button from "./Button.vue"
import Loader from "./Loader.vue"

const props = withDefaults(
  defineProps<{
    intent?: "primary" | "secondary" | "warning" | "danger" | "outline" | "plain"
    size?: "xs" | "sm" | "md" | "lg" | "sq-xs" | "sq-sm" | "sq-md" | "sq-lg"
    isCircle?: boolean
    isDisabled?: boolean
    isPending?: boolean
    defaultCamera?: boolean
    acceptDirectory?: boolean
    allowsMultiple?: boolean
    accept?: string
  }>(),
  {
    intent: "outline",
    size: "md",
    isCircle: false,
    isDisabled: false,
    isPending: false,
    defaultCamera: false,
    acceptDirectory: false,
    allowsMultiple: false,
  },
)

const emit = defineEmits<{
  change: [files: FileList]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const openPicker = () => {
  if (props.isDisabled || props.isPending) return
  inputRef.value?.click()
}

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    emit("change", target.files)
    target.value = ""
  }
}

const iconLabel = computed(() => {
  if (props.defaultCamera) return "Camera upload"
  if (props.acceptDirectory) return "Directory upload"
  return "File upload"
})
</script>

<template>
  <div data-slot="file-trigger">
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :multiple="allowsMultiple"
      :accept="accept"
      :webkitdirectory="acceptDirectory ? '' : undefined"
      @change="onChange"
    />
    <Button
      :intent="intent"
      :size="size"
      :is-circle="isCircle"
      :disabled="isDisabled"
      @click="openPicker"
    >
      <span class="sr-only">{{ iconLabel }}</span>
      <Loader v-if="isPending" />
      <span v-else-if="defaultCamera" aria-hidden="true">📷</span>
      <span v-else-if="acceptDirectory" aria-hidden="true">📁</span>
      <span v-else aria-hidden="true">📎</span>
      <slot>
        {{
          allowsMultiple
            ? "Browse files..."
            : acceptDirectory
              ? "Browse..."
              : "Browse file..."
        }}
      </slot>
    </Button>
  </div>
</template>
