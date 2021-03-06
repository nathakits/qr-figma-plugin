import Vue from 'vue'
import App from './App.vue'
import { store } from './store/store';
import "tailwindcss/tailwind.css"
import "./assets/css/index.css"
import { longClickDirective } from 'vue-long-click'

const longClickInstance = longClickDirective({ delay: 400, interval: 0 })
Vue.directive('longclick', longClickInstance)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
