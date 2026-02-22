<script setup lang="ts">
import { computed, provide, ref } from "vue"

type NavbarItem = {
  key: string
  label: string
  href?: string
  current?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    items?: NavbarItem[]
    mobile?: boolean
  }>(),
  {
    modelValue: false,
    items: () => [],
    mobile: false,
  },
)

const emit = defineEmits<{
  "update:modelValue": [value: boolean]
}>()

const isOpen = computed(() => props.modelValue)
const toggleNavbar = () => emit("update:modelValue", !props.modelValue)
const closeNavbar = () => emit("update:modelValue", false)

provide("intent-navbar", {
  isOpen,
  toggleNavbar,
  closeNavbar,
})

const localOpen = ref(false)
const inlineOpen = computed(() => (props.mobile ? isOpen.value : localOpen.value))
</script>

<template>
  <div data-slot="navbar" class="relative w-full border-b bg-navbar">
    <div class="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5">
      <button
        type="button"
        data-slot="navbar-trigger"
        aria-label="Toggle Navbar"
        class="rounded-md p-2 hover:bg-secondary lg:hidden"
        @click="props.mobile ? toggleNavbar() : (localOpen = !localOpen)"
      >
        ☰
      </button>

      <div class="hidden min-w-0 items-center gap-2 lg:flex">
        <a
          v-for="item in items"
          :key="item.key"
          data-slot="navbar-item"
          :href="item.href || '#'"
          :aria-current="item.current ? 'page' : undefined"
          class="rounded-lg px-3 py-1.5 text-sm/5 font-medium hover:bg-secondary"
          :class="item.current ? 'bg-secondary text-fg' : 'text-muted-fg'"
        >
          {{ item.label }}
        </a>
      </div>

      <slot />
    </div>

    <div v-if="inlineOpen" data-slot="navbar-mobile" class="border-t px-4 py-2 lg:hidden">
      <a
        v-for="item in items"
        :key="item.key"
        data-slot="navbar-item"
        :href="item.href || '#'"
        :aria-current="item.current ? 'page' : undefined"
        class="block rounded-lg px-3 py-2 text-sm/5 font-medium hover:bg-secondary"
        :class="item.current ? 'bg-secondary text-fg' : 'text-muted-fg'"
        @click="closeNavbar"
      >
        {{ item.label }}
      </a>
    </div>
  </div>
</template>
