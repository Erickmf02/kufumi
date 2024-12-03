<script setup lang="ts">
import type { Product, ProductService } from '../../services/product.service';
import BaseButton, { type BaseButtonVariant } from './BaseButton.vue';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { cartService } from '../../services/cart2.service';

interface Props {
  product: Product
}

const { product } = defineProps<Props>()
const cart = ref(cartService.getCart());

let unsubscribe: () => void;

function handleOnClick() {
  if(product.stock < 1) return;

  const cart = cartService.getCart()
  if(isInCart.value){
    cartService.setCart({
      ...cart,
      items: cart.items.filter((i)=> i.product.id != product.id)
    })
  }else{
    cartService.setCart({
      ...cart,
      items: [{stock: 1, product},...cart.items]
    })
  }
}

const isInCart = computed(()=>{
  return cart.value.items.some((item) => item.product.id == product.id)
})

const buttonVariant = computed((): BaseButtonVariant=>{
  if(product.stock < 1){
    return "principal-outlined"
  }
  else if(!isInCart.value){
    return "principal"
  } else {
    return "principal-outlined"
  }
})

onMounted(()=>{
  unsubscribe = cartService.subscribe((newCart)=>{
    cart.value = newCart
  })
})
onUnmounted(()=>{
  if (unsubscribe) {
    unsubscribe();
  }
})
</script>

<template>
<BaseButton @on-click="handleOnClick" :variant="buttonVariant" :disabled="product.stock < 1">
  <template v-if="product.stock < 1">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-6 w-6" viewBox="0 0 16 16">
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
      <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
    </svg>
    <span>Sin stock disponible</span>
  </template>
  <template v-else-if="!isInCart">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-6 w-6" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5"/>
      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
    </svg>
    <span>Añadir al carrito</span>
  </template>
  <template v-else>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="h-6 w-6 " viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M5.5 10a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5"/>
      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
    </svg>
    Remover del carrito
  </template>
</BaseButton>

</template>