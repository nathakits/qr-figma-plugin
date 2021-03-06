<template>
  <div id="app" class="h-full py-2">
    <SearchSpotify />
  </div>
</template>

<script>
import SearchSpotify from "./components/SearchSpotify.vue";

export default {
  name: "App",
  components: {
    SearchSpotify
  }
};
</script>

<style>

body {
  overflow:hidden;
}
</style>
