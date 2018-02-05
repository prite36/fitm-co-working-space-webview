import Vue from 'vue'
import VeeValidate from 'vee-validate'
import Router from 'vue-router'
import BookingTimeline from '@/components/BookingTimeline'
import Register from '@/components/Register'
import Booking from '@/components/Booking'
import ReBooking from '@/components/ReBooking'
import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'
/* eslint-disable */
import Chart from 'chart.js'
/* eslint-enable */
Vue.use(Router)
Vue.use(VeeValidate)
Vue.use(VueChartkick, { Chartkick })

export default new Router({
  routes: [
    {
      path: '/',
      name: 'BookingTimeline',
      component: BookingTimeline
    },
    {
      path: '/register/:senderID/:status',
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
