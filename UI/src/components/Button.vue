<template>
  <button @click="click()">{{value}}</button>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Button",
  props: {
    click: {
      type: Function,
      required: true
    },
    value: {
      type: String,
      required: false,
      default: () => "Click"
    }
  },
  computed: {
    ...mapGetters(["title"])
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  margin: 8px;
}
</style>
