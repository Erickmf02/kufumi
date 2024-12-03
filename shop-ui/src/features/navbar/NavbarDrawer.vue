<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { drawerState, hideDrawer } from './drawer-state';

const handleBeforeSwap = () => {
  hideDrawer();
};

onMounted(() => {
  document.addEventListener('astro:before-swap', handleBeforeSwap);
});

onUnmounted(() => {
  document.removeEventListener('astro:before-swap', handleBeforeSwap);
});
</script>


<template>
  <Transition>
    <div @click.self="hideDrawer" v-if="drawerState.isDrawerOpen" class="z-50 fixed h-[100dvh] w-screen bg-zinc-900 bg-opacity-50">
      <div class="relative bg-zinc-900 max-w-screen-sm h-[100dvh]">
        <button @click="hideDrawer" class="absolute right-0 top-0 m-2 flex justify-center items-center bg-white bg-opacity-10 rounded-full h-10 w-10 text-white transition-all hover:bg-opacity-40 active:bg-opacity-50 active:scale-95">
          <svg class="bi bi-x-lg h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor"  viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
          </svg>
        </button>

        <div class="grid text-white">
          Drawer~ Rooooooar~
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.v-enter-active > div,
.v-leave-active > div {
  transition: transform 0.3s ease-in-out;
}

.v-enter-from > div,
.v-leave-to > div{
  transform: translateX(-100%);
}
</style>