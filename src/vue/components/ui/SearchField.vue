<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    ariaLabel?: string
    disabled?: boolean
  }>(),
  {
    modelValue: "",
    placeholder: "Search...",
    ariaLabel: "Search",
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
  submit: [value: string]
}>()

const update = (event: Event) => emit("update:modelValue", (event.target as HTMLInputElement).value)
const clear = () => emit("update:modelValue", "")
const submit = () => emit("submit", props.modelValue)
</script>

<template>
  <div data-slot="search-field" class="w-full">
    <div data-slot="control" class="group/search-field flex w-full items-center rounded-lg border border-input px-3 py-2">
      <svg aria-hidden="true" viewBox="0 0 20 20" class="size-5 shrink-0 text-muted-fg fill-current">
        <path
          fill-rule="evenodd"
          d="M9 3.5a5.5 5.5 0 1 0 3.47 9.77l3.63 3.63a.75.75 0 1 0 1.06-1.06l-3.63-3.63A5.5 5.5 0 0 0 9 3.5Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
          clip-rule="evenodd"
        />
      </svg>
      <input
        :value="modelValue"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        :disabled="disabled"
        class="w-full min-w-0 bg-transparent px-2.5 py-1 text-base text-fg placeholder-muted-fg outline-hidden sm:text-sm"
        @input="update"
        @keydown.enter.prevent="submit"
      />
      <button
        type="button"
        class="touch-target grid place-content-center px-3 py-2 text-muted-fg hover:text-fg sm:px-2.5 sm:py-1.5 sm:text-sm/5"
        :disabled="!modelValue"
        :class="modelValue ? '' : 'invisible'"
        @click="clear"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" class="size-4 fill-current">
          <path
            fill-rule="evenodd"
            d="M4.22 4.22a.75.75 0 0 1 1.06 0L10 8.94l4.72-4.72a.75.75 0 1 1 1.06 1.06L11.06 10l4.72 4.72a.75.75 0 1 1-1.06 1.06L10 11.06l-4.72 4.72a.75.75 0 0 1-1.06-1.06L8.94 10 4.22 5.28a.75.75 0 0 1 0-1.06Z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="sr-only">Clear search</span>
      </button>
    </div>
  </div>
</template>
