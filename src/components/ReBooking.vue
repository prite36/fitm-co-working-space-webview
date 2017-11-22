<template>
<div class="Booking">
  <div v-if="!reBookingSuccess">
    Please input time
    <!-- /////////////////////////////////////////////////////// -->
    <v-form v-model="valid">
      <v-text-field label="Hour" v-model="hours"  ></v-text-field>
    </v-form>
    <v-form v-model="valid">
      <v-text-field label="Minute" v-model="minutes"  ></v-text-field>
    </v-form>
    <v-btn color="primary" @click="changeBookingData()">Submit</v-btn>
  </div>
  <div class="" v-else>
    <h1>Change Time  Success</h1>
    <h1>Plese close Page</h1>
  </div>
</div>
</template>

<script>
import firebase from 'firebase'
import Moment from 'moment'
import momenTime from 'moment-timezone'
import { extendMoment } from 'moment-range'
import axios from 'axios'
const moment = extendMoment(Moment)
export default {
  name: 'Register',
  data () {
    return {
      valid: false,
      dataBooking: null,
      hours: null,
      minutes: null,
      reBookingSuccess: false
    }
  },
  methods: {
    postPost (timeChange) {
      axios.post(`https://fitmcoworkingspace.me/rebookingSuccess`, {
        body: {
          senderID: this.$route.params.senderID,
          date: moment(timeChange).format('DD-MM-YYYY'),
          time: moment(timeChange).format('HH:mm')
        }
      })
      .then(response => {
        if (response.data === 'success') {
          this.reBookingSuccess = true
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    changeBookingData () {
      let format = 'YYYY-MM-DD HH:mm'
      let childPart = this.$route.params.bookingPart.replace(/:/g, '/')
      this.$bindAsObject('dataBooking', firebase.database().ref(childPart), null, () => {
        delete this.dataBooking['.key']
        const timeChange = moment(`${this.dataBooking.dateStop} ${this.dataBooking.timeStop}`, format).add({hours: this.hours, minutes: this.minutes})
        console.log(moment(timeChange).format('DD-MM-YYYY'))
        firebase.database().ref(childPart).update({
          dateStop: moment(timeChange).format('YYYY-MM-DD'),
          timeStop: moment(timeChange).format('HH:mm'),
          timeStamp: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm')
        })
        this.postPost(timeChange)
      })
    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.page2 {
  padding-left: 2%;
  padding-right: 2%;
}
.field {
  margin-left: 2%;
  margin-right: 2%;
}
.label {
  font-size: 16px;
  text-align: left;
}
</style>
