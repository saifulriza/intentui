<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    disabled?: boolean
    label?: string
    name?: string
  }>(),
  {
    modelValue: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const onToggle = (event: Event) => {
  if (!(event.target instanceof HTMLInputElement)) return
  emit("update:modelValue", event.target.checked)
}

const indicatorClasses = computed(() =>
  [
    "relative isolate inline-flex h-6 w-10 cursor-default rounded-full p-0.75 sm:h-5 sm:w-8",
    "transition duration-200 ease-in-out",
    "inset-ring inset-ring-input bg-input/30",
    props.modelValue && "inset-ring-(--switch-shadow) bg-(--switch-bg) dark:inset-ring-(--switch-bg-ring) dark:bg-(--switch-bg)",
    props.disabled && "dark:bg-muted-fg/30",
  ]
    .filter(Boolean)
    .join(" "),
)

const thumbClasses = computed(() =>
  [
    "pointer-events-none relative inline-block size-4.5 translate-x-0 rounded-full border border-transparent bg-white shadow-sm ring ring-fg/5 transition duration-200 ease-in-out sm:size-3.5",
    props.modelValue &&
      "bg-(--switch) shadow-(--switch-shadow) ring-(--switch-ring) ltr:translate-x-4 ltr:sm:translate-x-3 rtl:-translate-x-4 rtl:sm:-translate-x-3",
  ]
    .filter(Boolean)
    .join(" "),
)
</script>

<template>
  <label
    data-slot="control"
    class="[--switch-bg-ring:var(--color-blue-700)]/90 [--switch-bg:var(--color-blue-600)] dark:[--switch-bg-ring:transparent] [--switch-ring:var(--color-blue-700)]/90 [--switch-shadow:var(--color-blue-900)]/20 [--switch:white] group relative grid cursor-default gap-x-6 gap-y-1 ltr:grid-cols-[1fr_auto] rtl:grid-cols-[auto_1fr] *:data-[slot=indicator]:self-start sm:*:data-[slot=indicator]:mt-0.5 ltr:*:data-[slot=indicator]:col-start-2 rtl:*:data-[slot=indicator]:col-start-1 *:data-[slot=label]:row-start-1 ltr:*:data-[slot=label]:col-start-1 rtl:*:data-[slot=label]:col-start-2 disabled:opacity-50"
    :class="disabled ? 'opacity-50' : ''"
  >
    <input
      type="checkbox"
      class="sr-only"
      :checked="modelValue"
      :disabled="disabled"
      :name="name"
      @change="onToggle"
    />
    <span data-slot="indicator" :class="indicatorClasses">
      <span aria-hidden="true" :class="thumbClasses" />
    </span>
    <span v-if="label" data-slot="label" class="text-sm/6 text-fg">{{ label }}</span>
    <slot />
  </label>
</template>
