<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'white' | 'black',
  tabIndex?: string
}
const emit = defineEmits(['on-click'])
const {
  variant = "white",
  tabIndex
} = defineProps<Props>()

const buttonClasses = computed(() => {
  let classes = "h-10 w-10 flex items-center justify-center rounded-full transition active:scale-95 ";
  // if(!disabled){
  //   classes += "active:scale-95 "
  // }

  switch(variant){
    case 'white':
      classes += 'text-white bg-white bg-opacity-10 hover:bg-opacity-20 '
      return classes;
    case 'black':
      classes += "text-black bg-black bg-opacity-10 hover:bg-opacity-20 "
      return classes;
  }
});
</script>

<template>
  <button :tabindex="tabIndex" @click="()=> emit('on-click')" :class="buttonClasses">
    <slot></slot>
  </button>
</template>