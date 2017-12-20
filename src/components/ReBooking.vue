<template>
<div class="Booking">
  <div v-if="!reBookingSuccess">
    Please input time
    <!-- /////////////////////////////////////////////////////// -->
    <select v-model="selectedMinutes">
      <option v-for="option in minutesOptions" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
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
import _ from 'lodash/Math'
const moment = extendMoment(Moment)
export default {
  name: 'Register',
  data () {
    return {
      valid: false,
      dataBooking: null,
      minutes: null,
      reBookingSuccess: false,
      childPart: [],
      selectedMinutes: null,
      minutesOptions: []
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
      // let childPart = this.$route.params.bookingPart.replace(/:/g, '/')
      const timeChange = moment(`${this.dataBooking[this.childPart[3]].dateStop} ${this.dataBooking[this.childPart[3]].timeStop}`, format).add({hours: this.hours, minutes: this.minutes})
      firebase.database().ref('/booking').child(this.childPart[0]).child(this.childPart[1]).child(this.childPart[2]).child(this.childPart[3]).update({
        dateStop: moment(timeChange).format('YYYY-MM-DD'),
        timeStop: moment(timeChange).format('HH:mm'),
        timeStamp: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm')
      })
      this.postPost(timeChange)
    }
  },
  watch: {
    dataBooking: function () {
      let format = 'YYYY-MM-DD HH:mm'
      delete this.dataBooking['.key']
      let getTime = `${this.dataBooking[this.childPart[3]].dateStop} ${this.dataBooking[this.childPart[3]].timeStop}`
      let dateTimeStop = moment(getTime, format)
      let dateTimeStopAdd60 = moment(getTime, format).add({minutes: 60})
      let timeDiffAll = []
      console.log(`old ${moment(dateTimeStop).format(format)} new ${moment(dateTimeStopAdd60).format(format)}`)
      for (var key in this.dataBooking) {
        let checkDateTimeStop = moment(`${this.dataBooking[key].dateStop} ${this.dataBooking[key].timeStop}`, format)
        if (checkDateTimeStop.isBetween(dateTimeStop, dateTimeStopAdd60)) {
          timeDiffAll.push(checkDateTimeStop.diff(dateTimeStop, 'm'))
        }
      }
      let minMinuteForReBooking = _.min(timeDiffAll)
      this.minutesOptions = []
      for (var i = 1; i <= minMinuteForReBooking; i++) {
        if (i % 5 === 0) {
          this.minutesOptions.push({ text: ` ${i} นาที`, value: i })
        }
      }
    }
  },
  mounted () {
    this.childPart = this.$route.params.bookingPart.split(':')
    this.$bindAsObject('dataBooking', firebase.database().ref('/booking').child(this.childPart[0]).child(this.childPart[1]).child(this.childPart[2]))
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
