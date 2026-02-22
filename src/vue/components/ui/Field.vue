<script setup lang="ts">
const fieldClasses =
  "w-full [&>[data-slot=label]+[data-slot=control]]:mt-2 [&>[data-slot=label]+[data-slot=description]]:mt-1 [&>[data-slot=description]+[data-slot=control]]:mt-2 [&>[data-slot=control]+[data-slot=description]]:mt-2 [&>[data-slot=control]+[data-slot=errorMessage]]:mt-2 *:data-[slot=label]:font-medium disabled:opacity-50 group-disabled:opacity-50"
</script>

<template>
  <div data-slot="field" :class="fieldClasses">
    <slot />
  </div>
</template>
