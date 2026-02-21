<template>
  <div
    data-slot="card"
    class="group/card flex flex-col gap-(--gutter) rounded-lg border py-(--gutter) text-fg shadow-xs [--gutter:--spacing(6)] has-[table]:overflow-hidden has-[table]:not-has-data-[slot=card-footer]:pb-0 **:data-[slot=table-header]:bg-muted/50 has-[table]:**:data-[slot=card-footer]:border-t **:[table]:overflow-hidden"
  >
    <slot />
  </div>
</template>
