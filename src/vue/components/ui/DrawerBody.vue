<template>
  <div
    data-slot="drawer-body"
    class="isolate flex max-h-[calc(var(--visual-viewport-height)-var(--visual-viewport-vertical-padding))] flex-col overflow-auto px-4 py-1"
  >
    <slot />
  </div>
</template>
