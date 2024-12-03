<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ProductService, type Product } from '../../../services/product.service';
import ItemCard from '../../../components/vue/ItemCard.vue';
import { cartService } from '../../../services/cart2.service';

interface Props {
  clientApiUrl: string,
  items: {
    stock: number,
    product: Product
  } []
}

const {
  clientApiUrl,
  items
} = defineProps<Props>();

const productService = new ProductService(clientApiUrl);


const isLoading = ref(true);
const products = ref<Product[]>([]);


const fetchCartProducts = async () => {
  try {
    const productIds = items.map((item: any) => item.product.id);
    products.value = await productService.findMany(productIds);
  } catch (error) {
    console.error('Error al obtener los productos del carrito:', error);
  }
};

const updateCartStock = () => {
  const updatedItems = items
    .map((item: any) => {
      const product = products.value.find((p) => p.id === item.product.id);
      if (!product || product.stock === 0) return null; // Eliminar si no hay producto o stock
      return {
        ...item,
        product,
        stock: Math.min(item.stock, product.stock), // Ajustar stock
      };
    })
    .filter(Boolean); // Eliminar ítems nulos

  const cart = cartService.getCart();
  cartService.setCart({ ...cart, items: updatedItems});
};

const totalPrice = computed(() =>
  items.reduce((sum, item) => {
    return sum + item.product.value * item.stock
  }, 0)
);


onMounted(async ()=>{
  if(items.length > 0){
    await fetchCartProducts()
    updateCartStock()
    isLoading.value = false;
  }
})

defineExpose({
  getFormStatus
})

function getFormStatus(){
  return {
    isValid: !isLoading.value,
    form: items.map((item)=>{
      return {
        stock: item.stock,
        id: item.product.id
      }
    })
  }
}

</script>

<template>
  <div v-if="!isLoading && products" class="p-4 bg-slate-50 w-full max-w-screen-md rounded-lg shadow-md">
    <h1 class="text-xl font-medium mb-4">Mi carrito</h1> 
    <div class="space-y-2 relative">
      <ItemCard :product="item.product" :max="item.product.stock" :stock="item.stock" :key="item.product.id" v-for="item in items" />
    </div>
    <div class="mt-4 flex items-center justify-between bg-slate-200 rounded-lg py-2 px-4 text-black">
      <p class="text-lg">
        total
      </p>
      <h3 class="text-end text-xl">$<span class="font-bold">{{ totalPrice.toLocaleString() }}</span> CLP</h3>
    </div>
  </div>
</template>