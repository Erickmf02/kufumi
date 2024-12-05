<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { sessionService } from '../../services/session.service';
import IconButton from '../../components/vue/IconButton.vue';
import type { Session } from '../../stores/session.store';
import { UserService } from '../../services/user.service';

interface Props {
  clientApiUrl: string
}

const { clientApiUrl } = defineProps<Props>()

const session = ref<Session | undefined>(undefined);
const isLoading = ref(true);  // Estado de carga
const signInUrl = ref<string | undefined>();

let unsubscribe: () => void;


const isUrlLoading = ref(false);

async function handleOnSignIn(){
  if(!isUrlLoading.value){
    const userService = new UserService(clientApiUrl);
    try {
      isUrlLoading.value = true;
      const url = await userService.getSignInUrl();
      const form = document.createElement('a');
      form.href = url;
      form.click();
    } catch (error) {
      console.log(error)
    }finally{
      isUrlLoading.value = false;
    }
  }
}


async function handleOnMounted() {
  const localSesion = sessionService.getSession();
  session.value = localSesion;
  unsubscribe = sessionService.subscribe((newSession) => {
    session.value = newSession;
    isLoading.value = false; 
  });

  if(!localSesion){
    
  }

  isLoading.value = false;
}

onMounted(async () => {
  if(!sessionService.wasLoaded){
    sessionService.tryLoadSessionFromLocalStorage(handleOnMounted);
  }else{
    await handleOnMounted();
  }
});

// Limpiar la suscripción al desmontar el componente
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<template>
  <template v-if="!isLoading">
    <a :href="`/user/${session.user.id}`" v-if="session" class="rounded-full">
      <IconButton :tabIndex="'-1'">
        <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor"  viewBox="0 0 16 16">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
        </svg>
      </IconButton>
    </a>

    <IconButton v-else @on-click="handleOnSignIn">
      <svg class="size-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
        <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
      </svg>
    </IconButton>
    
  </template>
  <IconButton v-else :tab-index="'-1'">
    <div class="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent rounded-full" role="status" aria-label="loading">
      <span class="sr-only">Loading...</span>
    </div>
  </IconButton>
</template>
