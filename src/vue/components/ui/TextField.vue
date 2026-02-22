<template>
  <div
    data-slot="control"
    class="w-full [&>[data-slot=label]+[data-slot=control]]:mt-2 [&>[data-slot=label]+[data-slot=description]]:mt-1 [&>[data-slot=description]+[data-slot=control]]:mt-2 [&>[data-slot=control]+[data-slot=description]]:mt-2 [&>[data-slot=control]+[data-slot=errorMessage]]:mt-2 *:data-[slot=label]:font-medium in-disabled:opacity-50 disabled:opacity-50"
  >
    <slot />
  </div>
</template>
