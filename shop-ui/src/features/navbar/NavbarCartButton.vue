<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { cartService } from '../../services/cart2.service';
import IconButton from '../../components/vue/IconButton.vue';

const cart = ref()
let unsubscribe: () => void;

onMounted(()=>{ 
  cart.value = cartService.getCart()
  unsubscribe = cartService.subscribe((newCart)=>{
    cart.value = newCart;
  })
})

onUnmounted(()=>{
  if(unsubscribe){
    unsubscribe()
  }
})
</script>

<template>
  <a href="/cart" class="rounded-full block">
    <IconButton :class="'relative'" :tabIndex="'-1'">
      <Transition>
        <span v-if="cart && cart.items.length > 0" class="absolute top-0 end-0 flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span class="rounded-full h-full w-full bg-rose-500"></span>
        </span> 
      </Transition>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-6 w-6" viewBox="0 0 16 16">
        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
      </svg>
    </IconButton>
  </a>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>