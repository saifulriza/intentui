<script setup lang="ts">
import { computed, inject } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | boolean
    value: string | number | boolean
    invalid?: boolean
    disabled?: boolean
    name?: string
    label?: string
  }>(),
  {
    invalid: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | number | boolean]
}>()

const layoutClasses =
  "grid grid-cols-[1.125rem_1fr] gap-x-3 gap-y-1 sm:grid-cols-[1rem_1fr] *:data-[slot=indicator]:col-start-1 *:data-[slot=indicator]:row-start-1 *:data-[slot=indicator]:mt-0.75 sm:*:data-[slot=indicator]:mt-1 *:data-[slot=label]:col-start-2 *:data-[slot=label]:row-start-1 *:[[slot=description]]:col-start-2 *:[[slot=description]]:row-start-2 has-[[slot=description]]:**:data-[slot=label]:font-medium"

const indicatorClasses =
  "relative inset-ring inset-ring-input isolate flex size-4.5 shrink-0 items-center justify-center rounded-full text-bg transition before:absolute before:inset-auto before:size-2 before:shrink-0 before:rounded-full before:content-[''] hover:before:bg-muted-fg/20 sm:size-4 sm:before:size-1.7 in-disabled:bg-muted"

const group = inject<{
  modelValue: { value?: string | number | boolean }
  name: { value?: string }
  selectValue: (value: string | number | boolean) => void
} | null>("intent-radio-group", null)

const isSelected = computed(() =>
  group ? group.modelValue.value === props.value : props.modelValue === props.value,
)

const onChange = () => {
  if (group) {
    group.selectValue(props.value)
    return
  }
  emit("update:modelValue", props.value)
}
</script>

<template>
  <label class="group block" :class="disabled ? 'opacity-50' : ''">
    <input
      type="radio"
      class="sr-only"
      :checked="isSelected"
      :name="group?.name?.value ?? name"
      :disabled="disabled"
      :value="value"
      @change="onChange"
    />
    <div :class="layoutClasses">
      <span
        data-slot="indicator"
        :class="[
          indicatorClasses,
          {
            'inset-ring-(--radio-ring,var(--color-ring)) bg-(--radio-bg,var(--color-primary)) text-(--radio-fg,var(--color-primary-fg)) before:bg-bg hover:before:bg-muted/90': isSelected,
            'inset-ring-danger-subtle-fg/70 bg-danger-subtle/5 text-danger-fg ring-danger-subtle-fg/20': invalid,
          },
        ]"
      />
      <span v-if="label" data-slot="label" class="text-sm/6 text-fg">{{ label }}</span>
      <slot />
    </div>
  </label>
</template>
