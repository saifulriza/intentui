<script setup lang="ts">
import { computed, ref } from "vue"

type TreeNode = {
  key: string
  label: string
  children?: TreeNode[]
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | string[]
    items?: TreeNode[]
    selectionMode?: "single" | "multiple" | "none"
  }>(),
  {
    modelValue: "",
    items: () => [],
    selectionMode: "none",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string | string[]]
}>()

const expanded = ref<Set<string>>(new Set())
const selectedSet = computed(() =>
  new Set(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]),
)

const toggleExpand = (key: string) => {
  const next = new Set(expanded.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expanded.value = next
}

const onSelect = (node: TreeNode) => {
  if (node.disabled || props.selectionMode === "none") return
  if (props.selectionMode === "single") {
    emit("update:modelValue", node.key)
    return
  }
  const next = new Set(selectedSet.value)
  if (next.has(node.key)) next.delete(node.key)
  else next.add(node.key)
  emit("update:modelValue", Array.from(next))
}
</script>

<template>
  <div data-slot="tree" class="flex flex-col gap-y-2 overflow-auto outline-hidden">
    <ul class="space-y-1">
      <template v-for="node in items" :key="node.key">
        <li>
          <div
            class="group/tree-item flex select-none items-center gap-2 rounded-lg px-2 py-1.5"
            :class="[
              selectedSet.has(node.key) ? 'bg-primary-subtle text-primary-subtle-fg' : 'hover:bg-primary-subtle/40',
              node.disabled ? 'opacity-50' : '',
            ]"
          >
            <button
              v-if="node.children?.length"
              type="button"
              class="shrink-0 text-muted-fg hover:text-fg"
              :aria-label="expanded.has(node.key) ? 'Collapse' : 'Expand'"
              :disabled="node.disabled"
              @click="toggleExpand(node.key)"
            >
              <span class="inline-block" :class="expanded.has(node.key) ? 'rotate-90' : ''">›</span>
            </button>
            <span v-else class="block w-4 shrink-0" aria-hidden="true" />
            <button
              type="button"
              class="flex-1 text-left text-sm/6"
              :disabled="node.disabled"
              @click="onSelect(node)"
            >
              {{ node.label }}
            </button>
          </div>
          <ul v-if="node.children?.length && expanded.has(node.key)" class="mt-1 ms-6 space-y-1">
            <li v-for="child in node.children" :key="child.key">
              <button
                type="button"
                class="flex w-full items-center rounded-lg px-2 py-1.5 text-left text-sm/6"
                :class="[
                  selectedSet.has(child.key)
                    ? 'bg-primary-subtle text-primary-subtle-fg'
                    : 'hover:bg-primary-subtle/40',
                  child.disabled ? 'opacity-50' : '',
                ]"
                :disabled="child.disabled"
                @click="onSelect(child)"
              >
                {{ child.label }}
              </button>
            </li>
          </ul>
        </li>
      </template>
    </ul>
    <slot />
  </div>
</template>
