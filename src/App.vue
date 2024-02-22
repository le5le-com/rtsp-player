<template>
  <Header />
  <div class="app-body">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header.vue';
</script>
<style lang="postcss" scoped>
.app-body {
  display: flex;
  height: calc(100vh - 50px);
}
</style>
