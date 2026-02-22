<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    placeholder?: string
    disabled?: boolean
    readOnly?: boolean
    required?: boolean
    requiredMessage?: string
  }>(),
  {
    modelValue: () => [],
    placeholder: "Type and press Enter…",
    disabled: false,
    readOnly: false,
    required: false,
    requiredMessage: "At least one item is required",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string[]]
}>()

const inputValue = ref("")
const touched = ref(false)
const instance = getCurrentInstance()
const errorId = `tag-field-error-${instance?.uid ?? 0}`

const isInvalid = computed(() => Boolean(props.required && touched.value && (props.modelValue?.length ?? 0) === 0))

const addTags = () => {
  if (props.readOnly || props.disabled) return
  const raw = inputValue.value.trim()
  if (!raw) return
  const next = new Set(props.modelValue)
  const nextLower = new Set(Array.from(next).map((v) => v.toLowerCase()))
  raw
    .split(/[,;]/)
    .map((entry) => entry.trim().replace(/\s\s+/g, " "))
    .filter(Boolean)
    .forEach((entry) => {
      const lower = entry.toLowerCase()
      if (!nextLower.has(lower)) {
        next.add(entry)
        nextLower.add(lower)
      }
    })
  emit("update:modelValue", Array.from(next))
  inputValue.value = ""
  touched.value = true
}

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault()
    addTags()
  }
}

const removeTag = (tag: string) => {
  if (props.readOnly || props.disabled) return
  emit(
    "update:modelValue",
    props.modelValue.filter((entry) => entry !== tag),
  )
  touched.value = true
}
</script>

<template>
  <div data-slot="tag-field" class="flex flex-col gap-y-1">
    <input
      v-model="inputValue"
      type="text"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readOnly"
      :aria-describedby="isInvalid ? errorId : undefined"
      class="w-full rounded-lg border border-input px-3 py-2 text-base/6 text-fg outline-hidden sm:text-sm/6"
      :class="isInvalid ? 'border-danger-subtle-fg/70 bg-danger-subtle/5' : ''"
      @keydown="onKeydown"
      @blur="touched = true"
    />
    <p v-if="isInvalid" :id="errorId" class="text-danger text-sm">{{ requiredMessage }}</p>
    <div class="mt-1 flex flex-wrap gap-1">
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
      >
        {{ tag }}
        <button
          type="button"
          class="text-muted-fg hover:text-fg disabled:opacity-50"
          :disabled="readOnly || disabled"
          @click="removeTag(tag)"
        >
          <span aria-hidden="true">✕</span>
          <span class="sr-only">Remove {{ tag }}</span>
        </button>
      </span>
    </div>
  </div>
</template>
