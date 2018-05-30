<template>
  <div class="rebooking">
    <v-tabs dark grow>
      <v-toolbar color="primary" dark>
        <v-btn icon>
          <v-icon small>access_time</v-icon>
        </v-btn>
        Rebooking
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-tabs>
    <v-card class="paddingcard" color="grey lighten-4" flat v-loading.fullscreen.lock= "loadingPage">
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex xs12>
              <div v-if="mainPage === 'content'">
                <form @submit.prevent="validateBeforeSubmit">
                  <h3>Booking Continue</h3>
                  <!-- /////////////////////////////////////////////////////// -->
                  <v-select label="Please Select Minute" prepend-icon="access_time" :items="minutesOptions"   v-model="selectedMinutes"
                    :error-messages="errors.collect('Minute')"
                    v-validate="'required'"
                    data-vv-name="Minute"
                  ></v-select><br><br>
                  <v-btn block color="primary" @click="validateBeforeSubmit()">Submit</v-btn>
                </form>
              </div>
              <div v-if="mainPage === 'notEditBooKing'">
                <v-layout justify-space-around>
                  <v-icon color="red darken-1" x-large>error</v-icon>
                </v-layout>
                <h1>you can't booking continue</h1>
              </div>
              <div v-if="mainPage === 'error404'">
                <h1>Error 404<br>
                Page Not Found</h1>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <br>
    </v-card>
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
      loadingPage: true,
      mainPage: '',
      threadContext: null,
      dataBooking: null,
      minutes: null,
      reBookingSuccess: false,
      childPart: [],
      selectedMinutes: null,
      minutesOptions: []
    }
  },
  props: ['appID'],
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          // eslint-disable-next-line
          this.$nextTick().then(() => {
            this.$validator.reset()
          })
          this.changeBookingData()
        }
      })
    },
    postPost (timeChange) {
      axios.post(`https://fitmcoworkingspace.me/rebookingSuccess`, {
        body: {
          senderID: this.threadContext.tid,
          date: moment(timeChange).format('DD-MM-YYYY'),
          time: moment(timeChange).format('HH:mm')
        }
      })
      .then(response => {
        if (response.data === 'success') {
          this.closeWeb()
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    changeBookingData () {
      let format = 'YYYY-MM-DD HH:mm'
      // let childPart = this.$route.params.bookingPart.replace(/:/g, '/')
      let getTime = `${this.dataBooking[this.childPart[3]].dateStop} ${this.dataBooking[this.childPart[3]].timeStop}`
      const timeChange = moment(getTime, format).add({minutes: this.selectedMinutes})
      // update firebase
      this.$firebaseRefs.dataBooking.child(this.childPart[3]).update({
        dateStop: moment(timeChange).format('YYYY-MM-DD'),
        timeStop: moment(timeChange).format('HH:mm'),
        bookingContinue: {
          timeStamp: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm')
        }
      })
      // send data to server
      this.postPost(timeChange)
    },
    closeWeb (delay) {
      this.loadingPage = false
      setTimeout(() => {
        MessengerExtensions.requestCloseBrowser() //eslint-disable-line
      }, delay)
    },
    getDataAndSDK () {
      let getSDK = new Promise((resolve, reject) => {
        var vm = this
        window.extAsyncInit = function () {
          MessengerExtensions.getContext(vm.appID, //eslint-disable-line
          function success (threadContext) {
            resolve(threadContext)
          },
          function error (err) {
            reject(err)
          })
        }
      })
      let getdataBooking = new Promise((resolve, reject) => {
        this.$bindAsObject('dataBooking', firebase.database().ref('/booking').child(this.childPart[0]).child(this.childPart[1]).child(this.childPart[2]), null, () => {
          delete this.dataBooking['.key']
          resolve()
        })
      })
      Promise.all([getSDK, getdataBooking]).then(values => {
        this.threadContext = values[0]
        this.loadingPage = false
        if (this.dataBooking[this.childPart[3]].bookingContinue === undefined) {
          // ยังไม่เคยยืดเวลาจอง
          this.mainPage = 'content'
        } else {
          // เคยยืดเวลาจอง
          this.mainPage = 'notEditBooKing'
          this.closeWeb(3000)
        }
      }).catch(reason => {
        this.threadContext = reason
        this.loadingPage = false
        this.mainPage = 'error404'
        // fake data
        this.mainPage = 'content'
      })
    }
  },
  watch: {
    dataBooking: function () {
      let format = 'YYYY-MM-DD HH:mm'
      let getTime = `${this.dataBooking[this.childPart[3]].dateStop} ${this.dataBooking[this.childPart[3]].timeStop}`
      console.log(getTime)
      let dateTimeStop = moment(getTime, format)
      // เวลาจองสิ้นสุด บวกเพื่มอีก 60 นาที
      let dateTimeStopAdd60 = moment(getTime, format).add({minutes: 60})
      let timeDiffAll = []
      console.log(`old ${moment(dateTimeStop).format(format)} new ${moment(dateTimeStopAdd60).format(format)}`)
      // วนการจองแต่ละครั้ง ออกมาเช็ค
      for (var key in this.dataBooking) {
        let checkDateTimeStart = moment(`${this.dataBooking[key].dateStart} ${this.dataBooking[key].timeStart}`, format)
        // เช็คว่า เวลาอยู่ระหว่าง  เวลาจองสิ้นสุด กับ เวลาจองสิ้นสุด+60 รึเปล่า
        if (checkDateTimeStart.isBetween(dateTimeStop, dateTimeStopAdd60)) {
          // หาว่าเวลา start ห่างจากเวลา stop กี่นาที แล้วเก็บใส่ timeDiffAll
          timeDiffAll.push(checkDateTimeStart.diff(dateTimeStop, 'm'))
        }
      }
      // หาค่าที่น้อยที่สุดใน Array
      let minMinuteForReBooking = _.min(timeDiffAll)
      // ถ้า minMinuteForReBooking คืนค่า undefined แสดงว่าใน timeDiffAll ไม่มีค่า []
      if (!minMinuteForReBooking) {
        // ให้ค่า จองได้น้อยสุด 60 นาที
        minMinuteForReBooking = 60
      }
      // clear ค่า ที่ใช้ไปแสดงใน select Minute
      this.minutesOptions = []
      for (var i = 1; i <= minMinuteForReBooking; i++) {
        if (i % 5 === 0) {
          this.minutesOptions.push({ text: `${i} Minute`, value: i })
        }
      }
    }
  },
  created () {
    this.childPart = this.$route.params.bookingPart.split(':')
  },
  mounted () {
    this.getDataAndSDK()
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.paddingcard {
  padding-top: 5%;
}
.rebooking {
  background-color: #F5F5F5;
}
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
