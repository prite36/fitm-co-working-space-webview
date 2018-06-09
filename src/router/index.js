import Vue from 'vue'
import VeeValidate from 'vee-validate'
import Router from 'vue-router'
import BookingTimeline from '@/components/BookingTimeline'
import Register from '@/components/Register'
import Booking from '@/components/Booking'
import ReBooking from '@/components/ReBooking'
import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'
import EditProfile from '@/components/EditProfile'
import Feedback from '@/components/Feedback'
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
      path: '/register/:status',
      name: 'Register',
      component: Register
    },
    {
      path: '/booking/:item',
      name: 'Booking',
      component: Booking
    },
    {
      path: '/rebooking/:bookingPart',
      name: 'ReBooking',
      component: ReBooking
    },
    {
      path: '/editProfile',
      name: 'EditProfile',
      component: EditProfile
    },
    {
      path: '/feedback',
      name: 'Feedback',
      component: Feedback
    }
  ]
})
