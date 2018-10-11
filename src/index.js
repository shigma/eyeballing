const Vue = require('vue/dist/vue.runtime.common')

Vue.config.devtools = false
Vue.config.productionTip = false

new Vue(require('./app.vue')).$mount('#app')
