<script setup lang="ts">
import IconButton from '../../components/vue/IconButton.vue';
import { showDrawer } from './drawer-state';
</script>

<template>
  <IconButton @on-click="showDrawer">
    <svg class="bi bi-list h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor"  viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
    </svg>
  </IconButton>
</template>