import Vue from 'vue'
import VeeValidate from 'vee-validate'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Booking from '@/components/Booking'
import ReBooking from '@/components/ReBooking'
Vue.use(Router)
Vue.use(VeeValidate)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld
    },
    {
      path: '/register/:status',
      name: 'Register',
      component: Register
    },
    {
      path: '/booking/:senderID/:item',
      name: 'Booking',
      component: Booking
    },
    {
      path: '/rebooking/:senderID/:bookingPart',
      name: 'ReBooking',
      component: ReBooking
    }
  ]
})
