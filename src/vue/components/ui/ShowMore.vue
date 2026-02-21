<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    orientation?: "horizontal" | "vertical"
    as?: "button" | "text"
    text?: string
  }>(),
  {
    modelValue: false,
    orientation: "horizontal",
    as: "button",
    text: "Show more",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const toggle = () => emit("update:modelValue", !props.modelValue)
</script>

<template>
  <div
    data-slot="show-more"
    class="text-sm/6"
    :class="
      orientation === 'vertical'
        ? 'mx-2 flex h-auto flex-col items-center self-stretch before:mb-2 before:flex-1 before:border-l after:mt-2 after:flex-1 after:border-r'
        : 'my-2 flex items-center self-stretch before:me-2 before:flex-1 before:border-t after:ms-2 after:flex-1 after:border-t'
    "
  >
    <button
      v-if="as === 'button'"
      type="button"
      class="inline-flex size-8 items-center justify-center rounded-full border text-sm hover:bg-secondary"
      :aria-expanded="modelValue ? 'true' : 'false'"
      :aria-label="modelValue ? 'Show less content' : 'Show more content'"
      @click="toggle"
    >
      <slot>{{ modelValue ? "Less" : "More" }}</slot>
    </button>
    <span v-else class="text-muted-fg">{{ text }}</span>
  </div>
</template>
