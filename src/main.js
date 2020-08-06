import Vue from 'vue'
import App from './App.vue'

import dot9 from "vue-dot9"
Vue.use(dot9)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
