<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, useTemplateRef } from 'vue';
import { cartService } from '../../services/cart2.service';
import CartClientForm from './_components/CartClientForm.vue';
import CartProducts from './_components/CartProducts.vue';
import CartPayment from './_components/CartPayment.vue';
import LoadingPage from '../../components/vue/LoadingPage.vue';
import type { Cart } from '../../stores/cart2.store';
import CartPaymentProvider from './_components/CartPaymentProvider.vue';

// Props y servicios
interface Props {
  clientApiUrl: string;
}
const { clientApiUrl } = defineProps<Props>();

// Estado reactivo
const cart = ref<Cart | undefined>();
const isLoading = ref(true);

let unsubscribe: () => void;

// Estado del formulario reactivo
const form = reactive<any>({
  paymentProvider: 'transbank',
  client: {},
  items: [],
});

// Función para obtener los productos del carrito


// Manejo al montar el componente
const initializeCart = async () => {
  cart.value = cartService.getCart();
  unsubscribe = cartService.subscribe((newCart) => (cart.value = newCart));

  form.items = cart.value.items.map((item: any) => ({
    id: item.product.id,
    stock: item.stock,
  }));

  isLoading.value = false;
};

// Lifecycle hooks
onMounted(async () => {
  if (!cartService.wasLoaded) {
    cartService.tryLoadCartFromLocalStorage(initializeCart);
  } else {
    await initializeCart();
  }
});

onUnmounted(() => unsubscribe?.());
const cartClientForm = useTemplateRef('cart-client-form');
const cartProducts = useTemplateRef('cart-products');
const cartPaymentProvider = useTemplateRef('cart-payment-provider');


function validateForm(): boolean {
  const isClientValid = cartClientForm.value!.getFormStatus().isValid;
  let isValid = true;
  if(!isClientValid) {
    cartClientForm.value!.forceValidate();
    isValid = false;
  }

  const isProductsValid = cartProducts.value!.getFormStatus().isValid;
  if(!isProductsValid){
    isValid = false;
  }

  const isPaymentProviderValid = cartPaymentProvider.value!.getFormStatus().isValid;
  if(!isPaymentProviderValid){
    cartPaymentProvider.value!.forceValidate()
    isValid = false;
  }
  return isValid;
}

function getForm(){
  return {
    paymentProvider: cartPaymentProvider.value!.getFormStatus().form,
    client: cartClientForm.value!.getFormStatus().form,
    items: cartProducts.value!.getFormStatus().form
  };
}


</script>

<template>
  <LoadingPage v-if="isLoading"></LoadingPage>
  <div class="h-full p-2 space-y-4 flex flex-col items-center" v-else-if="cart && cart!.items.length > 0">

    <CartProducts ref="cart-products" :client-api-url="clientApiUrl" :items="cart!.items" />

    <CartClientForm ref="cart-client-form" />

    <CartPaymentProvider ref="cart-payment-provider"></CartPaymentProvider>

    <CartPayment :get-form="getForm" :validate-form="validateForm" :api-url="clientApiUrl" />
    
  </div>
  <slot v-else></slot>
</template>
