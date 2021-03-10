import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store';
import "tailwindcss/tailwind.css"
import "./assets/css/index.css"

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
