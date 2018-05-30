<template>
  <div class="booking">
    <v-tabs dark grow>
      <v-toolbar color="primary" dark>
        <v-btn icon>
          <v-icon small>create</v-icon>
        </v-btn>
          <h3>Please Select {{paramsItem}}</h3>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-tabs>
    <v-parallax height="800" src="/static/doc-images/vbanner.jpg" v-loading.fullscreen.lock= "loadingPage">
    <v-card color="grey lighten-4" flat>
      <v-card-text>
        <v-container fluid fill-height>
          <v-layout row>
            <v-flex xs12>
              <div v-if="mainPage === 'content'">
                <!-- /////////////////////////////////////////////////////// -->
                <div v-if="data.selectData.selectType === null">
                  <div v-for="(item, key) in items">
                    <v-btn block large color="primary" @click="data.selectData.selectType = key">{{key}}</v-btn><br>
                  </div>
                </div>
                <!-- /////////////////////////////////////////////////////// -->
                <div class="page2" v-if="data.selectData.selectType !== null">
                  <div class="headline">Please Booking {{data.selectData.selectType}}</div><br>
                  <div class="description" align-left>* You can booking {{data.selectData.selectType}} minimum <span class="red--text">{{configSystem[paramsItem].min}} minutes</span>, maximum <span class="red--text">{{configSystem[paramsItem].max / 60}}  hours.</span>
                    <p v-if="data.selectData.selectType === 'classRoom'">* This room maximum <span class="red--text">50 persons.</span></p>
                    <p v-if="data.selectData.selectType === 'largeRoom'">* This room maximum <span class="red--text">20 persons.</span></p>
                    <p v-if="data.selectData.selectType === 'mediumroom'">* This room maximum <span class="red--text">10 persons.</span></p>
                    <p v-if="data.selectData.selectType === 'smallRoom'">* This room maximum <span class="red--text">5 persons.</span></p>
                  </div>
                  <v-alert icon="warning" dismissible v-model="errorBooking">
                    This range time is already booked. Please fill information again.
                  </v-alert>
                  <form @submit.prevent="validateBeforeSubmit">
                    <v-dialog persistent v-model="data.selectData.modalDateStart" lazy full-width width="290px">
                      <v-text-field slot="activator" label="Date Start" :error-messages="errors.collect('date start')" data-vv-name="date start" v-validate="'required'" v-model="data.selectData.dateStart" prepend-icon="event" color="success" readonly></v-text-field>
                      <v-date-picker v-model="data.selectData.dateStart" :allowed-dates= "allowedDatesStart" crollable actions>
                        <template slot-scope="{ save, cancel }">
                         <v-card-actions>
                           <v-spacer></v-spacer>
                           <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                           <v-btn flat color="primary" @click="save">OK</v-btn>
                         </v-card-actions>
                       </template>
                      </v-date-picker>
                    </v-dialog>
                    <!-- /////////////////////////////////////////////////////// -->
                    <v-dialog persistent v-model="data.modals.modalTimeStart" lazy full-width width="290px">
                      <v-text-field slot="activator" label="Time Start" :error-messages="errors.collect('time start')" data-vv-name="time start" v-validate="'required|overlaps|timeStartAfterTimeNow|limitTimeBooking'" v-model="data.selectData.timeStart" prepend-icon="access_time" readonly></v-text-field>
                      <v-time-picker :return-value.sync="time" format="24hr" v-model="data.selectData.timeStart" :allowed-hours="allowedTimesStart.hours" :allowed-minutes="allowedTimesStart.minutes" actions>
                        <template slot-scope="{ save, cancel }">
                          <v-card-actions>
                            <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                            <v-btn flat color="primary" @click="save">Save</v-btn>
                          </v-card-actions>
                        </template>
                      </v-time-picker>
                    </v-dialog>
                    <!-- /////////////////////////////////////////////////////// -->
                    <v-dialog persistent v-model="data.modals.modalDateStop" lazy full-width width="290px">
                      <v-text-field slot="activator" label="Date Stop" :error-messages="errors.collect('date stop')" data-vv-name="date stop" v-validate="'required'" v-model="data.selectData.dateStop" prepend-icon="event" readonly></v-text-field>
                      <v-date-picker v-model="data.selectData.dateStop" :allowed-dates= "allowedDatesStop" scrollable actions>
                        <template slot-scope="{ save, cancel }">
                         <v-card-actions>
                           <v-spacer></v-spacer>
                           <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                           <v-btn flat color="primary" @click="save">OK</v-btn>
                         </v-card-actions>
                       </template>
                      </v-date-picker>
                    </v-dialog>
                    <!-- /////////////////////////////////////////////////////// -->
                    <v-dialog persistent v-model="data.modals.modalTimeStop" lazy full-width width="290px">
                      <v-text-field slot="activator" label="Time Stop" :error-messages="errors.collect('time stop')" data-vv-name="time stop" v-validate="'required|overlaps|limitTimeBooking'" v-model="data.selectData.timeStop" prepend-icon="access_time" readonly></v-text-field>
                      <v-time-picker format="24hr" v-model="data.selectData.timeStop" :allowed-hours="allowedTimesStop.hours" :allowed-minutes="allowedTimesStop.minutes" actions>
                        <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                          <v-btn flat color="primary" @click="save">Save</v-btn>
                        </v-card-actions>
                      </template>
                      </v-time-picker>
                    </v-dialog>
                    <!-- /////////////////////////////////////////////////////// -->
                    <v-select label="Name Type Item" item-value="text" prepend-icon="map" v-bind:items="nameTypeCanUse" v-model="nameTypeItem"
                      :error-messages="errors.collect('Name Type Item')"
                      v-validate="'required'"
                      data-vv-name="Name Type Item"
                      :disabled="showNameMenu"
                    ></v-select>
                      <!-- /////////////////////////////////////////////////////// -->
                   <v-btn block large color="primary" @click="validateBeforeSubmit()">SUBMIT</v-btn>
                  </form>
                </div>
              </div>
              <div v-if="mainPage === 'block'">
                <v-layout justify-space-around>
                  <v-icon color="red darken-1" x-large>block</v-icon>
                </v-layout>
                <h1>you are blocked</h1>
              </div>
              <div v-if="mainPage === 'manyBookings'">
                <v-layout justify-space-around>
                  <v-icon color="red darken-1" x-large>error</v-icon>
                </v-layout>
                <h1>You many bookings</h1>
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
  </v-parallax>
  </div>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
import diff from 'lodash/difference'
import Moment from 'moment'
import momenTime from 'moment-timezone'
import { extendMoment } from 'moment-range'
import { Validator } from 'vee-validate'
const moment = extendMoment(Moment)
export default {
  name: 'Register',
  data () {
    return {
      loadingPage: true,
      errorBooking: false,
      mainPage: '',
      threadContext: null,
      items: null,
      profiles: null,
      bookings: null,
      configSystem: null,
      data: {
        selectData: {
          selectType: null,
          dateStart: null,
          timeStart: null,
          dateStop: null,
          timeStop: null
        },
        modals: {
          modalDateStart: false,
          modalTimeStart: false,
          modalDateStop: false,
          modalTimeStop: false
        }
      },
      showNameMenu: true,
      paramsItem: this.$route.params.item.replace(/room/g, 'Room'),
      nameTypeItem: null,
      bookingData: null,
      nameTypeCanUse: [],
      allowedDatesStart: {
        min: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD'),
        max: null
      },
      allowedDatesStop: {
        min: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD'),
        max: null
      },
      allowedTimesStart: {
        hours: { min: 0, max: 24 },
        minutes: function (value) {
          if (value % 5 === 0) {
            return true
          } else {
            return false
          }
        }
      },
      allowedTimesStop: {
        hours: { min: 0, max: 24 },
        minutes: function (value) {
          if (value % 5 === 0) {
            return true
          } else {
            return false
          }
        }
      },
      oldVal: null
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
          this.loadingPage = true
          this.pushBookingData()
        }
      })
    },
    postPost (newData) {
      axios.post(`https://fitmcoworkingspace.me/bookingSuccess`, {
        body: newData
      })
      .then(response => {
        if (response.data === 'success') {
          this.closeWeb(1500)
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    pushBookingData () {
      var newData = {}
      let pushData = (values = {}) => {
        let key = firebase.database().ref('booking/').child(this.paramsItem).child(this.data.selectData.selectType).child(this.nameTypeItem).push().key
        newData = {
          id: key,
          status: 'pending',
          childPart: `${this.paramsItem}/${this.data.selectData.selectType}/${this.nameTypeItem}/${key}`,
          nameTypeItem: this.nameTypeItem,
          senderID: this.threadContext.tid,
          dateStart: this.data.selectData.dateStart,
          timeStart: this.data.selectData.timeStart,
          dateStop: this.data.selectData.dateStop,
          timeStop: this.data.selectData.timeStop,
          timeStamp: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm')
        }
        values[key] = newData
        return values
      }
      firebase.database().ref('booking/').child(this.paramsItem).child(this.data.selectData.selectType).child(this.nameTypeItem).transaction(values => {
        if (values) {
          // เอาเวลาที่จะจองไปเช็คใน Booking ดูว่ามีข้อมูลที่เวลาจองชนกันไหม?
          if (!Object.values(values).some(key => this.checkOverlaps(key))) {
            // ถ้าเวลาไม่ชน push data
            return pushData(values)
          } else {
            // ถ้าเวลาที่จะจองชนกัน return ค่าว่าง  committed = flase
            return  //  eslint-disable-line
          }
        } else {
          // ถ้าไม่มีข้อมูลใน firebase ไม่ต้องส่งค่าอะไรไป
          return pushData()
        }
      }, (error, committed) => {
        if (error) {
          console.error(error)
        } else if (!committed) {
          // ถ้าเวลาที่จะจองชนกัน
          this.loadingPage = false
          this.errorBooking = true
          this.nameTypeItem = null
          this.data.selectData.dateStart = null
          this.data.selectData.timeStart = null
          this.data.selectData.dateStop = null
          this.data.selectData.timeStop = null
        } else {
          // ถ้า Booking transaction สำเร็จส่ง API
          this.postPost(newData)
        }
      })
    },
    checkNameTypeCanUse () {
      let vm = this
      let nameTypeDontUse = []
      let nameTypeAll = Object.keys(this.items[this.data.selectData.selectType]) // ชื่อห้อง หรือ อุปกรณ์ทั้งหมด
      this.$bindAsObject('bookingData', firebase.database().ref('booking').child(vm.paramsItem).child(vm.data.selectData.selectType), null, () => {
        delete this.bookingData['.key']
        // clear data
        this.nameTypeCanUse = []
        this.nameTypeItem = null
        if (this.bookingData['.value'] !== null) {
          //  have data
          for (var name in this.bookingData) {
            // ถ้าเจอประวัติการจองที่ชน จะเก็บชื่อ nameType ลงใน nameTypeDontUse
            if (Object.values(this.bookingData[name]).some(key => this.checkOverlaps(key))) {
              nameTypeDontUse.push(name)
            }
          }
          // get difference between two arrays
          this.nameTypeCanUse = diff(nameTypeAll, nameTypeDontUse)
        } else {
          // dont have data
          this.nameTypeCanUse = nameTypeAll
        }
      })
    },
    checkOverlaps (value) {
      let format = 'YYYY-MM-DD HH:mm'
      // ข้อมูล date และ time จากหน้าเว็บ เอามาเช็คว่า ชนกับเวลาการจองอื่นๆไหม
      let inputStart = moment(`${this.data.selectData.dateStart} ${this.data.selectData.timeStart}`, format)
      let inputStop = moment(`${this.data.selectData.dateStop} ${this.data.selectData.timeStop}`, format)

      // ข้อมูล date และ time จาก DB ประวัติการจอง ครั้งนั้น
      let checkdbStart = moment(`${value.dateStart} ${value.timeStart}`, format)
      let checkdbStop = moment(`${value.dateStop} ${value.timeStop}`, format)
      const range1 = moment.range(inputStart, inputStop)
      const range2 = moment.range(checkdbStart, checkdbStop)
      // overlaps ถ้าเวลา ชนกัน จะคืนค่า true
      return range1.overlaps(range2)
    },
    checkOverlapsInputbox () {
      // ถ้า selectData ทุกตัว ไม่เท่ากับ null ถึงจะเช็ค validate
      if (Object.values(this.data.selectData).every(x => x !== null)) {
        // เช็คว่า เวลาใน Inputbox ในกรณี วันที่วันเดียวกัน แต่เวลา start มากกว่า stop ให้ return false
        let format = 'YYYY-MM-DD HH:mm'
        let inputStart = moment(`${this.data.selectData.dateStart} ${this.data.selectData.timeStart}`, format)
        let inputStop = moment(`${this.data.selectData.dateStop} ${this.data.selectData.timeStop}`, format)
        return inputStart.isBefore(inputStop)
      } else {
        return true
      }
    },
    checkTimeStartAfterTimeNow () {
      // เวลาเริ่มจองต้อง >= เวลาปัจจุบัน
      let format = 'YYYY-MM-DD HH:mm'
      let inputStart = moment(`${this.data.selectData.dateStart} ${this.data.selectData.timeStart}`, format)
      let query = inputStart.isSameOrAfter(momenTime().tz('Asia/Bangkok'))
      return query
    },
    checkLimitTimeBooking (condition) {
      // เวลาจองต้อง <= เวลาที่สามารถจองได้มากสุด
      let vm = this
      let format = 'YYYY-MM-DD HH:mm'
      let inputStart = moment(`${this.data.selectData.dateStart} ${this.data.selectData.timeStart}`, format)
      let inputStop = moment(`${this.data.selectData.dateStop} ${this.data.selectData.timeStop}`, format)
      // เอาเวลา inputStart กับ inputStop มาหาว่าห่างกันกี่ชั่วโมง และต้อง (<= || >=) เวลา ต่ำสุด สูงสุดที่สามารถจองได้
      let result = null
      if (condition === 'min') result = inputStop.diff(inputStart, 'minutes', true) >= this.configSystem[vm.paramsItem].min
      if (condition === 'max') result = inputStop.diff(inputStart, 'minutes', true) <= this.configSystem[vm.paramsItem].max
      return (result || !this.data.selectData.timeStart || !this.data.selectData.timeStop)
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
      let getProfiles = new Promise((resolve, reject) => {
        // let vm = this
        this.$bindAsObject('profiles', firebase.database().ref('profile'), null, () => {
          delete this.profiles['.key']
          for (let status in this.profiles) {
            if (this.profiles[status][this.threadContext.tid]) {
              /* Userที่ไม่ถูกblock  statusBlock จะมีค่าเป็น false
               resolve ส่งค่า true หมายความว่าสามารถ booking ได้   reject ส่งค่า false คือ booking ไม่ได้ */
              if (!this.profiles[status][this.threadContext.tid].statusBlock) resolve(true)
              else reject(new Error(false))
              break
            }
          }
        })
      })
      let checkBooking = new Promise((resolve, reject) => {
        this.$bindAsObject('configSystem', firebase.database().ref('configSystem'), null, () => {
          delete this.configSystem['.key']
          let countBooking = 0
          this.$bindAsObject('bookings', firebase.database().ref('booking'), null, () => {
            delete this.bookings['.key']
            loop1: {// eslint-disable-line
              for (let type in this.bookings) {
                for (let nameType in this.bookings[type]) {
                  for (let name in this.bookings[type][nameType]) {
                    for (let id in this.bookings[type][nameType][name]) {
                      if (this.bookings[type][nameType][name][id].senderID === this.threadContext.tid) {
                        // ถ้าหาเจอแสดงว่าเป็น booking ของ user คนนี้ ให้ countBooking++
                        countBooking++
                        // ถ้าจำนวนการจองของ user คนนี้ >= จำนวนการจองมากสุดที่สามารถจองได้
                        if (countBooking >= this.configSystem.countOfMaxBooking) {
                          // คืนค่า false  หมายความว่า ไม่สามารถจองได้
                          resolve(false)
                          break loop1 // eslint-disable-line
                        }
                      }
                    }
                  }
                }
              }
            }
            // คืนค่า true หมายความว่า สามารถจองได้
            resolve(true)
          })
        })
      })
      getSDK.then(values => {
        this.threadContext = values
        Promise.all([getProfiles, checkBooking]).then(values => {
          this.loadingPage = false
          /* values คืนค่าเป็น array แล้วใช้ every เช็คค่าใน array ทีละตัว
           ทุกตัวใน array ต้องเป็นจริง เช่น [true, true] ถึงจะเข้า เข้าเงื่อนไข if */
          if (values.every(x => x)) {
            this.mainPage = 'content'
          } else {
            this.mainPage = 'manyBookings'
            this.closeWeb(2000)
          }
        }).catch(reason => {
          this.mainPage = 'block'
          this.closeWeb(2000)
        })
      }).catch(reason => {
        this.threadContext = reason
        this.loadingPage = false
        this.mainPage = 'error404'
      })
    }
  },
  mounted () {
    let vm = this
    this.getDataAndSDK()
    this.$bindAsObject('items', firebase.database().ref('items').child(vm.paramsItem), null, () => { delete this.items['.key'] })
    const limitTimeBooking = value => new Promise(resolve => {
      setTimeout(() => {
        if (!this.checkLimitTimeBooking('min')) {
          return resolve({
            valid: false,
            data: {
              message: `booking time too little.`
            }
          })
        } else if (!this.checkLimitTimeBooking('max')) {
          return resolve({
            valid: false,
            data: {
              message: `booking time too much.`
            }
          })
        } else {
          return resolve({
            valid: true
          })
        }
      }, 200)
    })
    Validator.extend('limitTimeBooking', {
      validate: limitTimeBooking,
      getMessage: (field, params, data) => data.message
    })
    // // fake Data
    // this.$bindAsObject('configSystem', firebase.database().ref('configSystem'), null, () => { delete this.configSystem['.key'] })
    // this.mainPage = 'content'
    // this.loadingPage = false
  },
  created () {
    const isOverlaps = value => new Promise((resolve) => {
      setTimeout(() => {
        // ถ้าวันที่เวลาสัมพันธ์กัน
        if (this.checkOverlapsInputbox()) {
          return resolve({
            valid: true
          })
        }
        return resolve({
          valid: false,
          data: {
            message: `Date & Time Not related.`
          }
        })
      }, 200)
    })
    const isTimeStartAfterTimeNow = value => new Promise((resolve) => {
      setTimeout(() => {
        // ถ้าวันที่เวลาสัมพันธ์กัน
        if (this.checkTimeStartAfterTimeNow()) {
          return resolve({
            valid: true
          })
        }
        return resolve({
          valid: false,
          data: {
            message: `Please select after time now.`
          }
        })
      }, 200)
    })
    Validator.extend('overlaps', {
      validate: isOverlaps,
      getMessage: (field, params, data) => data.message
    })
    Validator.extend('timeStartAfterTimeNow', {
      validate: isTimeStartAfterTimeNow,
      getMessage: (field, params, data) => data.message
    })
  },
  watch: {
    data: {
      handler (val) {
        if (Object.values(val.selectData).every(x => x !== null) && Object.values(val.modals).every(x => x === false)) {
          this.checkNameTypeCanUse()
          this.showNameMenu = false
        }
        if (!val.selectData.dateStart) {
          // ถ้า selectData.dateStart เป็น null ให้ DatesStart มากสุด วันนี้ +2เดือน
          this.allowedDatesStart.max = Moment(momenTime().tz('Asia/Bangkok')).add(2, 'months').format('YYYY-MM-DD')
        }
        if (!val.selectData.dateStop) {
          // ถ้า selectData.dateStop เป็น null ให้ DatesStop มากสุด วันนี้ +2เดือน
          this.allowedDatesStop.max = Moment(momenTime().tz('Asia/Bangkok')).add(2, 'months').format('YYYY-MM-DD')
        }
        if (val.selectData.dateStart) {
          // ถ้า selectData.dateStart มีค่า DatesStop จะเลือกวันที่ได้น้อยสุดคือ วันที่เลือก dateStart
          this.allowedDatesStop.min = val.selectData.dateStart
        }
        if (val.selectData.dateStop) {
          // ถ้า selectData.dateStop มีค่า DatesStart จะเลือกวันที่ได้มากสุด คือวันที่เลิอก  dateStop
          this.allowedDatesStart.max = val.selectData.dateStop
        }
      },
      deep: true
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.booking {
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
.alert {
  font-size: 18px;
}
.description {
  text-align: left;
  font-size: 16px;
}
</style>
