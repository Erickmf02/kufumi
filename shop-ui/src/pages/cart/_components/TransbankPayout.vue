<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from "vue";
import BaseButton from "../../../components/vue/BaseButton.vue";

interface Payout {
  url: string;
  token: string;
}

// Props
const props = defineProps<{
  payout: Payout;
}>();

// Referencia al formulario
const paymentForm = useTemplateRef('form')

// Enviar el formulario automáticamente al montar el componente
onMounted(() => {
 (paymentForm.value as HTMLFormElement).submit();
});

</script>

<template>
  <!-- Formulario visible con el campo token oculto -->
  <form ref="form"
    :action="props.payout.url"
    method="post"
    target="_blank"
    class="flex flex-col"
  >
    <input type="hidden" name="token_ws" :value="props.payout.token" />
    <BaseButton type="submit" variant="principal-ghost">
      Si no fuiste redirigido has click aqui
    </BaseButton>
  </form>
</template>
