<template>
  <div>
    <h3>{{title}}</h3>
    <h4>Create Rectangles</h4>
    <input type="number" min="1" max="10" v-model="count" />
    <Button :value="'Cancel'" :click="onClose" />
    <Button :value="'Create Rectangles'" :click="onCreateRectangles" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { createRectangles, closePlugin } from "../helpers/figma-messages";

import Button from "./Button";

export default {
  name: "CreateRectangles",
  components: { Button },
  computed: {
    ...mapGetters(["title"])
  },
  methods: {
    onCreateRectangles() {
      createRectangles(this.count);
    },
    onClose() {
      closePlugin();
    }
  },
  data: function() {
    return {
      count: 3
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 10px;
}
input {
  margin: 4px;
  width: 80%;
}
</style>
