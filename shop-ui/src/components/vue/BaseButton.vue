<script lang="ts" setup>
import { computed } from "vue";

export type BaseButtonVariant = "base" | "principal" | "principal-ghost" | "principal-outlined";

interface Props {
  type?: 'button' | 'reset' | 'submit',
  variant?: BaseButtonVariant,
  disabled?: boolean,
  size?: 'base' | 'large'
  loading?: boolean,
  tabIndex?: string
}

const emit = defineEmits(["on-click"]);
const { type = 'button',variant = "base", disabled = false, size = 'base', loading = false } = defineProps<Props>();

const buttonClasses = computed(() => {
  let classes = "flex items-center justify-center rounded-full transition ";
  switch(size){
    case 'base':
      classes += 'gap-2 px-4 h-10 '
      break
    case 'large':
      classes += 'gap-4 px-8 h-14 text-xl '
      break
  }

  if(!disabled && !loading){
    classes += "active:scale-95 "
  }else{
    classes += "bg-opacity-80 "
  }

  switch(variant){
    case 'base':
      classes += 'bg-gray-200 text-gray-800 '
      if(!disabled && !loading){
        classes += 'hover:bg-gray-300 '
      }
      return classes;
    case 'principal':
      classes += "bg-rose-500 text-white "
      if(!disabled && !loading){
        classes += "hover:bg-rose-600 "
      }
      return classes;
    case 'principal-ghost':
      classes += 'text-rose-500 '
      if(!disabled && !loading){
        classes += 'hover:bg-rose-500 hover:bg-opacity-20 '
      }
      return classes;
    case 'principal-outlined':
      classes += 'text-rose-500 ring-1 ring-rose-500 '
      if(!disabled && !loading){
        classes += 'hover:bg-rose-500 hover:bg-opacity-10 '
      }
      return classes
  }
});

const spinerClasses = computed(()=>{
  let classes = "animate-spin inline-block border-current border-t-transparent text-white rounded-full "
  switch(size){
    case 'base': 
      classes += 'size-4 border-[3px] '
      break
    case 'large':
      classes += 'size-8 border-[4px] '
      break;
  }
  return classes;
})
</script>

<template>
  <button
    :type="type"
    @click="() => emit('on-click')"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :tabindex="tabIndex"
  >
    <slot v-if="!loading">Button</slot>
    <span v-else :class="spinerClasses" role="status" aria-label="loading">
      <span class="sr-only">Loading...</span>
    </span>
  </button>
</template>
