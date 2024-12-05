<script lang="ts" setup>
import IconButton from './IconButton.vue';
import type { Product } from '../../services/product.service';
import { cartService } from '../../services/cart2.service';

// Props
const { product, quantity, max } = defineProps<{
  product: Product
  quantity: number,
  max?: number
}>()


// Maneja el cambio de cantidad
function handleOnInput(e: Event) {
  const value: number = parseInt((e.target as HTMLInputElement).value);

  // Actualiza el stock del producto en el carrito
  const cart = cartService.getCart();
  cartService.setCart({
    ...cart,
    items: cart.items.map((item) =>
      item.product.id === product.id ? { ...item, stock: value } : item
    ),
  });
}

// Maneja la eliminación del producto
function handleRemove() {
  const cart = cartService.getCart()
  cartService.setCart({
    ...cart,
    items: cart.items.filter(i=> i.product.id != product.id)
  })
}
</script>

<template>
  <div class="grid gap-2 grid-cols-12">

    <!-- Image container-->
    <div class="col-span-2 sm:col-span-1">
      <div class="w-full aspect-square">
        <img
        :src="product.image || 'https://via.placeholder.com/150'"
        alt="Imagen del producto"
        class="w-full h-full object-cover rounded-lg"
        />
      </div>
    </div>
    
    <!-- Side-->
    <div class="col-span-10 sm:col-span-11 flex items-center justify-between">
      <div class="flex justify-center flex-col h-full">
        <h3 class="text-lg font-medium">{{ product.name }}</h3>
        <h4 class="text-sm text-slate-600">  $<span class="font-semibold">{{product.value.toLocaleString() }}</span> CLP</h4>
      </div>
      <div class="flex gap-2">
        <input
          id="stock-input"
          type="number"
          @input="handleOnInput"
          class="w-16 px-2 py-1 border rounded text-sm text-gray-800"
          min="1"
          :max="max"
          :value="quantity"
        />
        <IconButton @on-click="handleRemove" variant="black">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
          </svg>
        </IconButton>
      </div>
    </div>
  </div>
</template>
