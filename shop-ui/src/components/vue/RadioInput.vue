<script setup lang="ts">
import { ref } from 'vue';



interface Props {
  options: {
    label: string,
    value: string
  }[];
}

const { options } = defineProps<Props>();
const emit = defineEmits(['on-input']);

const selectedValue = ref();

const onInput = (value: string | number) => {
  selectedValue.value = value;
  emit('on-input', value);
};
</script>

<template>
  <div class="space-y-2">
    <template v-for="(option, index) in options" :key="index">
      <label class="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          :value="option.value"
          v-model="selectedValue"
          @input="onInput(option.value)"
          class="text-rose-500 focus:ring-0 focus:ring-offset-0 transition"
        />
        <span class="text-gray-700">{{ option.label }}</span>
      </label>
    </template>
  </div>
</template>

