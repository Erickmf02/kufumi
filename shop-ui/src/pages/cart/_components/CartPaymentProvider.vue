<script setup lang="ts">
import { reactive } from 'vue';
import RadioInput from '../../../components/vue/RadioInput.vue';

const paymentProviders = [
  { value: "transbank", label: "Transbank" },
];

interface Input {
  value: string,
  isValid: boolean,
  errorMessage?: string
}

const input = reactive<Input>({
  value: '',
  isValid: false,
  errorMessage: undefined
})

function validateInput() {
  input.isValid = true;
  input.errorMessage = undefined;

  if (!input.value) {
    input.isValid = false;
    input.errorMessage = "Debes seleccionar un metodo de pago";
    return;
  }

  const isValidOption = paymentProviders.some(option => option.value === input.value);

  if (!isValidOption) {
    input.isValid = false;
    input.errorMessage = "El método de pago seleccionado no es válido";
  }
}


function getFormStatus(): { isValid: boolean, form : string  } {
  const isValidForm = [input].every(field => field.isValid);

  return {
    isValid: isValidForm,
    form: input.value
  };
}

function forceValidate() {
  validateInput();
}

// Exponer las funciones para que puedan ser usadas fuera del componente
defineExpose({
  getFormStatus,
  forceValidate
});
</script>

<template>
  <div class="p-4 bg-slate-50 w-full max-w-screen-md rounded-lg shadow-md">
    <div class="mb-4">
      <h2 class="text-xl font-semibold">Método de Pago</h2>
      <p v-if="input.errorMessage" class="text-sm text-red-500">{{ input.errorMessage }}</p>
    </div>
    <RadioInput :options="paymentProviders" @on-input="(i) => { input.value = i; validateInput(); }" />
  </div>
</template>
