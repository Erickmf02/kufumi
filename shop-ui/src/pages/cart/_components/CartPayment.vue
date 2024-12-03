<script setup lang="ts">
import { ref } from 'vue';
import { OrderService } from '../../../services/order.service';
import BaseButton from '../../../components/vue/BaseButton.vue';
import TransbankPayout from './TransbankPayout.vue';

interface Props {
  validateForm: () => boolean
  getForm: () => any,
  apiUrl: string
}
const { validateForm, getForm, apiUrl } = defineProps<Props>()

const isLoading = ref(false)
const payout = ref();

const orderService = new OrderService(apiUrl);

async function handlePay() {
  if(!validateForm()){
    return
  }
  isLoading.value = true;
  payout.value = null;
  try {
    const form = getForm();
    payout.value = (await orderService.create(form)).payout;
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    alert('Hubo un problema al procesar el pago.');
  }finally{
    isLoading.value = false;
  }
}
</script>


<template>
  <div class="w-full max-w-screen-md flex flex-col gap-2">
      <BaseButton @on-click="handlePay" variant="principal" size="large" :loading="isLoading">
        Comprar ahora
      </BaseButton>
      <TransbankPayout v-if="payout" :payout="payout"></TransbankPayout>
    </div>
</template>