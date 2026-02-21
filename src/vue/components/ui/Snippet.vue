<script setup lang="ts">
import { computed, ref } from "vue"

type SnippetTab = {
  id: string
  label: string
  code: string
}

const props = withDefaults(
  defineProps<{
    tabs?: SnippetTab[]
    modelValue?: string
    language?: string
  }>(),
  {
    tabs: () => [],
    modelValue: "",
    language: "text",
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: string]
}>()

const copied = ref(false)
const copyFailed = ref(false)

const currentTab = computed(() => {
  if (!props.tabs.length) return null
  const selected = props.tabs.find((tab) => tab.id === props.modelValue)
  return selected ?? props.tabs[0]
})

const selectTab = (id: string) => emit("update:modelValue", id)

const copyCurrentCode = async () => {
  const tab = currentTab.value
  if (!tab) return
  try {
    await navigator.clipboard.writeText(tab.code)
    copied.value = true
    copyFailed.value = false
    setTimeout(() => {
      copied.value = false
    }, 1200)
  } catch {
    copyFailed.value = true
    setTimeout(() => {
      copyFailed.value = false
    }, 1200)
  }
}
</script>

<template>
  <div data-slot="snippet" class="w-full overflow-hidden rounded-md border bg-bg">
    <div data-slot="snippet-tabs-list" role="tablist" class="flex items-center gap-1 border-b bg-muted p-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :id="`snippet-tab-${tab.id}`"
        type="button"
        role="tab"
        :aria-selected="tab.id === (currentTab?.id || '') ? 'true' : 'false'"
        :tabindex="tab.id === (currentTab?.id || '') ? 0 : -1"
        class="rounded-md px-2 py-1 text-sm/5"
        :class="tab.id === (currentTab?.id || '') ? 'bg-bg font-medium' : 'hover:bg-bg/70'"
        @click="selectTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div
      data-slot="snippet-tab-panel"
      role="tabpanel"
      :aria-labelledby="currentTab ? `snippet-tab-${currentTab.id}` : undefined"
      class="flex items-center justify-between gap-3 p-3"
    >
      <pre
        role="region"
        :aria-label="`Code preview${currentTab?.label ? ` for ${currentTab.label}` : ''}`"
        class="min-w-0 flex-1 overflow-x-auto text-sm"
      ><code :data-language="language">{{ currentTab?.code }}</code></pre>
      <button
        type="button"
        aria-live="polite"
        :aria-label="`${copyFailed ? 'Copy failed' : copied ? 'Code copied' : 'Copy code snippet'}${currentTab?.label ? ` for ${currentTab.label}` : ''}`"
        class="rounded-md border px-2 py-1 text-xs/5 font-medium"
        @click="copyCurrentCode"
      >
        {{ copyFailed ? "Failed" : copied ? "Copied" : "Copy" }}
      </button>
    </div>
  </div>
</template>
