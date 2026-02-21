<script setup lang="ts">
import { computed, inject } from "vue"

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    value?: string | number
    indeterminate?: boolean
    invalid?: boolean
    disabled?: boolean
    name?: string
    label?: string
  }>(),
  {
    indeterminate: false,
    invalid: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const layoutClasses =
  "grid grid-cols-[1.125rem_1fr] gap-y-1 has-data-[slot=label]:gap-x-3 sm:grid-cols-[1rem_1fr] *:data-[slot=indicator]:col-start-1 *:data-[slot=indicator]:row-start-1 *:data-[slot=indicator]:mt-(--indicator-mt) *:data-[slot=label]:col-start-2 *:data-[slot=label]:row-start-1 *:[[slot=description]]:col-start-2 *:[[slot=description]]:row-start-2 has-[[slot=description]]:**:data-[slot=label]:font-medium"

const indicatorClasses =
  "relative inset-ring inset-ring-input isolate flex shrink-0 items-center justify-center rounded text-bg transition group-hover:inset-ring-muted-fg/30 sm:size-4 sm:*:data-[slot=check-indicator]:size-3.5 size-4.5 *:data-[slot=check-indicator]:size-4 in-disabled:bg-muted"

const group = inject<{
  modelValue: { value: Array<string | number> }
  name: { value?: string }
  toggleValue: (value: string | number, checked: boolean) => void
} | null>("intent-checkbox-group", null)

const isSelected = computed(() =>
  group && props.value !== undefined ? group.modelValue.value.includes(props.value) : props.modelValue,
)

const onChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  if (group && props.value !== undefined) {
    group.toggleValue(props.value, checked)
    return
  }
  emit("update:modelValue", checked)
}
</script>

<template>
  <label
    data-slot="control"
    class="group block [--indicator-mt:--spacing(0.75)] sm:[--indicator-mt:--spacing(1)]"
    :class="disabled ? 'opacity-50' : ''"
  >
    <input
      type="checkbox"
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
            'inset-ring-(--checkbox-ring,var(--color-ring)) bg-(--checkbox-bg,var(--color-primary)) text-(--checkbox-fg,var(--color-primary-fg))': isSelected,
            'inset-ring-(--checkbox-ring,var(--color-ring)) bg-secondary text-secondary-fg': indeterminate,
            'inset-ring-danger-subtle-fg/70 bg-danger-subtle/5 text-danger-fg ring-danger-subtle-fg/20 group-hover:inset-ring-danger-subtle-fg/70': invalid,
          },
        ]"
      >
        <svg
          v-if="indeterminate"
          data-slot="check-indicator"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M4 9.25a.75.75 0 0 0 0 1.5h12a.75.75 0 0 0 0-1.5H4Z" />
        </svg>
        <svg
          v-else-if="isSelected"
          data-slot="check-indicator"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.002 7.064a1 1 0 0 1-1.424-.008L3.29 8.656a1 1 0 0 1 1.42-1.408l4.284 4.322 6.296-6.275a1 1 0 0 1 1.414-.005Z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <span v-if="label" data-slot="label" class="text-sm/6 text-fg">{{ label }}</span>
      <slot />
    </div>
  </label>
</template>
