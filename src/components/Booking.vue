<template>
<div class="Booking">
  <template>
    <v-parallax height="650" src="/static/doc-images/vbanner.jpg">
      <v-card color="grey lighten-4" flat>
        <v-card-text>
          <v-container fluid>
            <v-layout row>
              <v-flex xs12>

  <div v-if="!bookingSuccess">
    Please Select {{$route.params.item}}
    <!-- /////////////////////////////////////////////////////// -->
    <div v-if="data.selectData.selectType === null">
      <div class="" v-for="(item, key) in items">
        <v-btn color="primary" @click="data.selectData.selectType = key">{{key}}</v-btn>
      </div>
    </div>
    <!-- /////////////////////////////////////////////////////// -->
    <div class="page2" v-if="data.selectData.selectType !== null">
      <v-dialog persistent v-model="data.selectData.modalDateStart" lazy full-width width="290px">
        <v-text-field slot="activator" label="วันที่เริ่มจอง" :error-messages="errors.collect('date start')" data-vv-name="date start" v-validate="'required'" v-model="data.selectData.dateStart" prepend-icon="event" color="success" readonly></v-text-field>
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
        <v-text-field slot="activator" label="เวลาที่เริ่มจอง" :error-messages="errors.collect('time start')" data-vv-name="time start" v-validate="'required'" v-model="data.selectData.timeStart" prepend-icon="access_time" readonly></v-text-field>
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
        <v-text-field slot="activator" label="จองถึงวันที่" :error-messages="errors.collect('date stop')" data-vv-name="date stop" v-validate="'required'" v-model="data.selectData.dateStop" prepend-icon="event" readonly></v-text-field>
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
        <v-text-field slot="activator" label="เวลาสิ้นสุด" :error-messages="errors.collect('time stop')" data-vv-name="time stop" v-validate="'required'" v-model="data.selectData.timeStop" prepend-icon="access_time" readonly></v-text-field>
        <v-time-picker format="24hr" v-model="data.selectData.timeStop" :allowed-hours="allowedTimesStop.hours" :allowed-minutes="allowedTimesStop.minutes" actions>
          <template slot-scope="{ save, cancel }">
          <v-card-actions>
            <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
            <v-btn flat color="primary" @click="save">Save</v-btn>
          </v-card-actions>
        </template>
        </v-time-picker>
      </v-dialog>

      <v-text-field
        prepend-icon="people"
        name="input-1"
        label="จำนวนผู้เข้าใช้งาน"
        v-model="countPeople"
        :error-messages="errors.collect('count people')"
        v-validate="'required|numeric|max:3'"
        data-vv-name="count people"
        v-show="this.$route.params.item === 'meetingroom'"
      ></v-text-field>
        <v-select
        label="Name Type Item"
          v-bind:items="nameTypeCanUse"
          v-model="nameTypeItem"
          prepend-icon="map"
          item-value="text"
          :disabled="showNameMenu"
        ></v-select>
     <v-btn  light disabled v-show="nameTypeItem === null" @click="pushBookingData()">SUBMIT</v-btn>
     <v-btn  color="primary" v-show="nameTypeItem !== null" @click="pushBookingData()">SUBMIT</v-btn>

    </div>
  </div>
  <div class="" v-else>
       <h1>Booking  {{$route.params.item}} Success</h1>
       <h1>Plese close Page</h1>
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
const moment = extendMoment(Moment)
export default {
  name: 'Register',
  data () {
    return {
      items: '',
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
      bookingData: '',
      nameTypeCanUse: [],
      bookingSuccess: false,
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
  mounted () {
    let vm = this
    this.$bindAsObject('items', firebase.database().ref('items').child(vm.$route.params.item), null, () => { delete this.items['.key'] })
  },
  methods: {
    postPost () {
      axios.post(`https://fitmcoworkingspace.me/bookingSuccess`, {
        body: {
          senderID: this.$route.params.senderID,
          item: this.$route.params.item
        }
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
      firebase.database().ref('booking/').child(this.$route.params.item).child(this.data.selectData.selectType).child(this.nameTypeItem).push({
        userID: this.$route.params.senderID,
        dateStart: this.data.selectData.dateStart,
        timeStart: this.data.selectData.timeStart,
        dateStop: this.data.selectData.dateStop,
        timeStop: this.data.selectData.timeStop,
        countPeople: this.countPeople,
        timeStamp: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm')
      })
      this.postPost()
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
    }
  },
  watch: {
    data: {
      handler (val) {
        if (Object.values(val.selectData).every(x => x !== null) && Object.values(val.modals).every(x => x === false)) {
          this.checkNameTypeCanUse()
          this.showNameMenu = false
        }
        // DatesStop จะเลือกวันที่ได้น้อยสุดคือ วันที่เลือก dateStart
        this.allowedDatesStop.min = val.selectData.dateStart
        // DatesStart จะเลือกวันที่ได้มากสุด คือวันที่เลิอก  dateStop
        this.allowedDatesStart.max = val.selectData.dateStop
      },
      deep: true
    },
    countPeople () {
      console.log(this.countPeople)
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
