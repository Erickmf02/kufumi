<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { UserService } from '../../services/user.service';
import { navigate } from 'astro:transitions/client';
import { sessionService } from '../../services/session.service';


interface Props {
  clientApiUrl: string,
  token: string
}
const {clientApiUrl, token} = defineProps<Props>()
const isLoading = ref(true);
const errorMessage = ref<undefined | string>();

onMounted(async ()=>{
  const userService = new UserService(clientApiUrl);
  try {
    const user = await userService.findByToken(token);
    sessionService.setSession({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username
      }
    })
    navigate("/");
  } catch (error) {
    console.log(error)
    errorMessage.value = "Error!!!!"
  } finally {
    isLoading.value = false;
  }
})
</script>

<template>
  <template v-if="isLoading">
    Cargando...
  </template>
  <template v-else-if="errorMessage">
    {{ errorMessage }}
  </template>
</template>