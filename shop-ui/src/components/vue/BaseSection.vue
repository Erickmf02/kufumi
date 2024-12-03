<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title?: string;
  subtitle?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

const {
  title,
  subtitle,
  width = 'xl'
} = defineProps<Props>();


// Computed class for container width
const containerClass = computed(() => `flex flex-col max-w-screen-${width} space-y-4 w-full`);
</script>

<template>
  <section class="w-full items-center bg-slate-50 p-4 shadow-md flex justify-center">
    <div :class="containerClass">
      <div v-if="title || subtitle">
        <div v-if="title" class="text-2xl flex items-center space-x-2">
          <svg
            class="bi bi-hearts text-rose-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.931.481c1.627-1.671 5.692 1.254 0 5.015-5.692-3.76-1.626-6.686 0-5.015m6.84 1.794c1.084-1.114 3.795.836 0 3.343-3.795-2.507-1.084-4.457 0-3.343M7.84 7.642c2.71-2.786 9.486 2.09 0 8.358-9.487-6.268-2.71-11.144 0-8.358"
            />
          </svg>
          <h2 class="font-medium text-slate-800 overpass">{{ title }}</h2>
        </div>
        <h3 v-if="subtitle" class="text-slate-600 poppins">{{ subtitle }}</h3>
      </div>
      <div>
        <slot />
      </div>
    </div>
  </section>
</template>
