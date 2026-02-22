<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import ListBox from "./ListBox.vue"
import SearchField from "./SearchField.vue"

type CommandMenuItem = {
  key: string
  label: string
  description?: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    items?: CommandMenuItem[]
    placeholder?: string
    title?: string
    shortcut?: string
    isPending?: boolean
    escapeButton?: boolean
  }>(),
  {
    modelValue: false,
    items: () => [],
    placeholder: "Search...",
    title: "Command Menu",
    shortcut: "",
    isPending: false,
    escapeButton: true,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
  select: [item: CommandMenuItem]
}>()

const query = ref("")
const overlayClass =
  "fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-black/30 grid grid-rows-[1fr_auto] justify-items-center text-center sm:grid-rows-[1fr_auto_3fr]"

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.items
  return props.items.filter(
    (item) =>
      item.label.toLowerCase().includes(q) || (item.description ?? "").toLowerCase().includes(q),
  )
})

const close = () => emit("update:modelValue", false)
const onSelect = (value: string | string[]) => {
  const key = Array.isArray(value) ? value[0] : value
  const item = filtered.value.find((entry) => entry.key === key)
  if (!item) return
  emit("select", item)
  close()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (props.shortcut && event.key.toLowerCase() === props.shortcut.toLowerCase() && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    emit("update:modelValue", true)
    return
  }

  if (event.key === "Escape" && props.modelValue) {
    event.preventDefault()
    close()
  }
}

onMounted(() => document.addEventListener("keydown", handleKeydown))
onUnmounted(() => document.removeEventListener("keydown", handleKeydown))

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) query.value = ""
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      data-slot="command-menu-overlay"
      role="presentation"
      :class="overlayClass"
      @click.self="close"
    >
      <div
        data-slot="command-menu-content"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        class="row-start-2 w-full max-w-lg rounded-t-2xl bg-overlay text-overlay-fg shadow-lg ring ring-muted-fg/15 sm:rounded-xl"
      >
        <div data-slot="command-menu-dialog" class="flex max-h-[80vh] flex-col overflow-hidden outline-hidden">
          <div class="border-b px-2.5 py-1">
            <SearchField v-model="query" :placeholder="placeholder" />
          </div>
          <ListBox
            :items="filtered"
            class="border-0 rounded-none"
            @update:model-value="onSelect"
          />
          <div v-if="filtered.length === 0" class="p-4 text-center text-muted-fg text-sm">
            No results found.
          </div>
          <div class="border-t px-2 py-1.5 text-muted-fg text-sm">
            <span v-if="isPending">Searching…</span>
            <span v-else>{{ title }}</span>
            <button
              v-if="escapeButton"
              type="button"
              class="float-right hidden cursor-default rounded border px-1.5 py-0.5 text-current/90 hover:bg-muted lg:inline lg:text-xs"
              @click="close"
            >
              Esc
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
