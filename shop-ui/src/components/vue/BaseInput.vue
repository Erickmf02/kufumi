<script setup lang="ts">
const emit = defineEmits(['on-input'])
interface Props {
  value: string, 
  label: string,
  type: "email" | "text" | "number",
  placeHolder?: string
  errorMessage?: string
}
const {
  value,
  label,
  type,
  placeHolder = "",
  errorMessage
} = defineProps<Props>()
</script>

<template>
  <div>
    <label for="input-label" class="block text-sm font-medium mb-2">{{ label }}</label>
    <input
      @input="(e: any) => emit('on-input', e.target.value)"
      :type="type"
      id="input-label"
      :class="[
        'py-3 px-4 block w-full rounded-lg text-sm transition disabled:opacity-50 disabled:pointer-events-none',
        errorMessage ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500'
      ]"
      :placeholder="placeHolder"
      :value="value"
    />
    <p v-if="errorMessage" class="text-sm text-red-500 mt-1">{{ errorMessage }}</p>
  </div>
</template>
