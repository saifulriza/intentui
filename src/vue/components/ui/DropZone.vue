<script setup lang="ts">
import { ref } from "vue"

const isDropTarget = ref(false)
const baseClasses =
  "group/drop-zone relative flex max-h-56 items-center justify-center overflow-hidden rounded-lg border border-dashed p-6"
const activeClasses = "border-primary border-solid bg-primary/10 ring-2 ring-ring/20"

const emit = defineEmits<{
  filesDrop: [files: FileList]
}>()

const props = withDefaults(
  defineProps<{
    multiple?: boolean
    accept?: string
    ariaLabel?: string
  }>(),
  {
    multiple: false,
    ariaLabel: "File drop zone",
  },
)

const inputRef = ref<HTMLInputElement | null>(null)

const isAccepted = (file: File) => {
  if (!props.accept) return true
  const rules = props.accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
  if (!rules.length) return true
  const fileName = file.name.toLowerCase()
  const mimeType = file.type.toLowerCase()
  return rules.some((rule) => {
    if (rule.startsWith(".")) return fileName.endsWith(rule)
    if (rule.endsWith("/*")) return mimeType.startsWith(rule.slice(0, -1))
    return mimeType === rule
  })
}

const filterFiles = (files: FileList) => {
  if (!props.accept) return files
  const transfer = new DataTransfer()
  Array.from(files)
    .filter(isAccepted)
    .forEach((file) => transfer.items.add(file))
  return transfer.files
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (!isDropTarget.value) isDropTarget.value = true
}

const onDragLeave = () => {
  isDropTarget.value = false
}

const onDrop = (event: DragEvent) => {
  event.preventDefault()
  isDropTarget.value = false
  if (event.dataTransfer?.files?.length) {
    const accepted = filterFiles(event.dataTransfer.files)
    if (accepted.length > 0) emit("filesDrop", accepted)
  }
}

const openFilePicker = () => {
  inputRef.value?.click()
}

const onFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    const accepted = filterFiles(target.files)
    if (accepted.length > 0) emit("filesDrop", accepted)
    target.value = ""
  }
}
</script>

<template>
  <div
    data-slot="drop-zone"
    role="button"
    :aria-label="ariaLabel"
    tabindex="0"
    :class="[baseClasses, isDropTarget ? activeClasses : '']"
    @click="openFilePicker"
    @keydown.enter.prevent="openFilePicker"
    @keydown.space.prevent="openFilePicker"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <input
      ref="inputRef"
      class="hidden"
      type="file"
      :multiple="multiple"
      :accept="accept"
      @change="onFileInput"
    />
    <slot />
  </div>
</template>
