// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import firebase from 'firebase'
import App from './App'
import router from './router'
import VeeValidate from 'vee-validate'
import Vuetify from 'vuetify'
import VueFire from 'vuefire'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, { locale })
Vue.use(Vuetify)
Vue.use(VueFire)
Vue.config.productionTip = false
Vue.use(VeeValidate)
var config = {
  apiKey: 'AIzaSyCe9ziSu83NGVd08_FnljSQj7dNCdtYS7w',
  authDomain: 'fitm-coworking-space.firebaseapp.com',
  databaseURL: 'https://fitm-coworking-space.firebaseio.com',
  projectId: 'fitm-coworking-space',
  messagingSenderId: '817891071163'
}
firebase.initializeApp(config)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  created: function () {
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0] // eslint-disable-line
      if (d.getElementById(id)) { return }
      js = d.createElement(s); js.id = id
      js.src = '//connect.facebook.com/en_US/messenger.Extensions.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'Messenger'))
  },
  router,
  template: '<App/>',
  components: { App }
})
