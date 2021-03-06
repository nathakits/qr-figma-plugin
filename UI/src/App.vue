<template>
  <div id="app" class="h-full py-2">
    <GenerateQr />
  </div>
</template>

<script>
import GenerateQr from "./components/GenerateQr.vue";

export default {
  name: "App",
  components: {
    GenerateQr
  }
};
</script>

<style>

body {
  overflow:hidden;
}
</style>
