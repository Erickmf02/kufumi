<script setup lang="ts">
import { ref, onMounted } from 'vue';
import emblaCarouselVue from 'embla-carousel-vue';

interface Props {
  productId: number
  images: string[];
}

const props = defineProps<Props>();

// Referencias para los carruseles principal y miniaturas
const [emblaMainRef, emblaMainApi] = emblaCarouselVue();
const [emblaThumbsRef, emblaThumbsApi] = emblaCarouselVue({
  containScroll: 'keepSnaps',
  dragFree: true,
});

// Estado para la imagen seleccionada
const selectedIndex = ref(0);

// Cambia la diapositiva principal al hacer clic en una miniatura
const selectSlide = (index: number) => {
  emblaMainApi.value?.scrollTo(index);
};

// Sincroniza la selección de miniaturas con el carrusel principal
const onMainSelect = () => {
  if (!emblaMainApi.value) return;
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap();
  emblaThumbsApi.value?.scrollTo(selectedIndex.value);
};

onMounted(() => {
  if (!emblaMainApi.value) return;

  // Configura eventos de selección en el carrusel principal
  emblaMainApi.value.on('select', onMainSelect);
  emblaMainApi.value.on('reInit', onMainSelect);

  // Inicializa la sincronización
  onMainSelect();
});
</script>

<template>
  <div class="flex flex-col items-center space-y-2">
    <!-- Carrusel Principal -->
    <div class="w-full aspect-square overflow-hidden rounded-3xl" ref="emblaMainRef">
      <div class="flex">
        <div
          v-for="(image, index) in props.images"
          :style="`${(index == 0 && selectedIndex == 0) ? `view-transition-name: product-${productId}-image;`:''}`"
          :key="index"
          class="flex-[0_0_100%] aspect-square overflow-hidden"
        >
          <img
            :src="image"
            :alt="'Imagen ' + (index + 1)"
            class="w-full h-full object-cover rounded-3xl"
          />
        </div>
      </div>
    </div>

    <!-- Miniaturas -->
    <div class="w-full max-w-xl overflow-hidden rounded-xl" ref="emblaThumbsRef">
      <div class="flex gap-2">
        <div
          v-for="(image, index) in props.images"
          :key="index"
          class="flex-[0_0_auto] w-14 lg:w-20 aspect-square overflow-hidden rounded-xl cursor-pointer border-2"
          :class="index === selectedIndex ? 'border-rose-500' : 'border-transparent'"
          @click="selectSlide(index)"
        >
          <img
            :src="image"
            :alt="'Miniatura ' + (index + 1)"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</template>
