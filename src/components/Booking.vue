<template>
<div class="Booking">
  <template>
    <v-parallax height="650" src="/static/doc-images/vbanner.jpg" v-loading.fullscreen.lock= "loadingPage">
      <v-card color="grey lighten-4" flat>
        <v-card-text>
          <v-container fluid>
            <v-layout row>
              <v-flex xs12>
                <div v-if="mainPage === 'content'">
                  <!-- /////////////////////////////////////////////////////// -->
                  <div v-if="data.selectData.selectType === null">
                    <h3>Please Select {{$route.params.item}}</h3><br>
                    <div class="" v-for="(item, key) in items">
                      <v-btn block color="primary" @click="data.selectData.selectType = key">{{key}}</v-btn><br>
                    </div>
                  </div>
                  <!-- /////////////////////////////////////////////////////// -->
                  <div class="page2" v-if="data.selectData.selectType !== null">
                    <h3>Please Booking {{data.selectData.selectType}}</h3><br>
                    {{allowedDatesStart.max}}
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
                        <v-text-field slot="activator" label="Time Start" :error-messages="errors.collect('time start')" data-vv-name="time start" v-validate="'required|overlaps|timeStartAfterTimeNow'" v-model="data.selectData.timeStart" prepend-icon="access_time" readonly></v-text-field>
                        <v-time-picker format="24hr" v-model="data.selectData.timeStart" :allowed-hours="allowedTimesStart.hours" :allowed-minutes="allowedTimesStart.minutes" actions>
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
                        <v-text-field slot="activator" label="Time Stop" :error-messages="errors.collect('time stop')" data-vv-name="time stop" v-validate="'required|overlaps'" v-model="data.selectData.timeStop" prepend-icon="access_time" readonly></v-text-field>
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
                      <div v-if="this.$route.params.item === 'meetingroom'" >
                        <v-text-field label="Count People" name="count-people" prepend-icon="people" v-model="countPeople"
                          :error-messages="errors.collect('count people')"
                          v-validate="'required|numeric|max:3'"
                          data-vv-name="count people"
                        ></v-text-field>
                      </div>
                      <!-- /////////////////////////////////////////////////////// -->
                      <v-select label="Name Type Item" item-value="text" prepend-icon="map" v-bind:items="nameTypeCanUse" v-model="nameTypeItem"
                        :error-messages="errors.collect('Name Type Item')"
                        v-validate="'required'"
                        data-vv-name="Name Type Item"
                        :disabled="showNameMenu"
                      ></v-select>
                        <!-- /////////////////////////////////////////////////////// -->
                     <v-btn block color="primary" @click="validateBeforeSubmit()">SUBMIT</v-btn>
                    </form>
                  </div>
                </div>
                <div v-if="mainPage === 'error404'">
                  <h1>Error 404<br>
                  Page Not Found</h1>
                </div>
                <div v-if="mainPage === 'block'">
                  <h1>you are blocked</h1>
                </div>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <br>
      </v-card>
    </v-parallax>
    </template>
  </v-app>
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
      mainPage: '',
      threadContext: null,
      items: null,
      profiles: null,
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
      countPeople: null,
      showNameMenu: true,
      nameTypeItem: null,
      bookingData: null,
      nameTypeCanUse: [],
      allowedDatesStart: {
        min: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD'),
        max: null
      },
      allowedDatesStop: {
        min: null,
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
          this.bookingSuccess = true
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    pushBookingData () {
      let myRef = firebase.database().ref('booking/').child(this.$route.params.item).child(this.data.selectData.selectType).child(this.nameTypeItem).push()
      let key = myRef.key
      var newData = {
        id: key,
        childPart: `${this.$route.params.item}/${this.data.selectData.selectType}/${this.nameTypeItem}/${key}`,
        nameTypeItem: this.nameTypeItem,
        senderID: this.threadContext.tid,
        dateStart: this.data.selectData.dateStart,
        timeStart: this.data.selectData.timeStart,
        dateStop: this.data.selectData.dateStop,
        timeStop: this.data.selectData.timeStop,
        countPeople: this.countPeople,
        timeStamp: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm')
      }
      myRef.update(newData)
      this.postPost(newData)
    },
    checkNameTypeCanUse () {
      let vm = this
      let nameTypeDontUse = []
      let nameTypeAll = Object.keys(this.items[this.data.selectData.selectType]) // ชื่อห้อง หรือ อุปกรณ์ทั้งหมด
      this.$bindAsObject('bookingData', firebase.database().ref('booking').child(vm.$route.params.item).child(vm.data.selectData.selectType), null, () => {
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
              resolve(this.profiles[status][this.threadContext.tid].statusBlock)
              break
            }
          }
          reject(new Error('notFound'))
        })
      })
      getSDK.then(values => {
        this.threadContext = values
        getProfiles.then(values => {
          this.loadingPage = false
          // user จะ booking ได้ก็ต่อเมื่อ values คืนค่าเป็น false
          if (!values) {
            this.mainPage = 'content'
          } else {
            this.mainPage = 'block'
            this.closeWeb(2000)
          }
        }).catch(reason => {
          console.log(reason)
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
    this.$bindAsObject('items', firebase.database().ref('items').child(vm.$route.params.item), null, () => { delete this.items['.key'] })
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
