import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Booking from '@/components/Booking'
import ReBooking from '@/components/ReBooking'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: HelloWorld
    },
    {
      path: '/register/:senderID/:status',
      name: 'Register',
      component: Register
    },
    {
      path: '/booking/:senderID/:item',
      // path: '/booking',
      name: 'Booking',
      component: Booking
    },
    {
      path: '/rebooking/:bookingPart',
      // path: '/booking',
      name: 'ReBooking',
      component: ReBooking
    }
  ]
})
