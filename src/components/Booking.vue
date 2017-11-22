<template>
<div class="Booking">
  <div v-if="!bookingSuccess">
    Please Select {{$route.params.item}}
    <!-- /////////////////////////////////////////////////////// -->
    <div v-if="data.selectData.selectType === null">
      <div class="" v-for="(item, key) in items">
        Type Room = {{key}}
        <v-btn color="primary" @click="data.selectData.selectType = key">{{key}}</v-btn>
      </div>
    </div>
    <!-- /////////////////////////////////////////////////////// -->
    <div class="page2" v-if="data.selectData.selectType !== null">
      <v-dialog persistent v-model="data.selectData.modalDateStart" lazy full-width width="290px">
        <v-text-field slot="activator" label="วันที่เริ่มจอง" v-model="data.selectData.dateStart" prepend-icon="event" color="success" readonly></v-text-field>
        <v-date-picker v-model="data.selectData.dateStart" scrollable actions>
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
        <v-text-field slot="activator" label="เวลาที่เริ่มจอง" v-model="data.selectData.timeStart" prepend-icon="access_time" readonly></v-text-field>
        <v-time-picker format="24hr" v-model="data.selectData.timeStart" actions>
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
        <v-text-field slot="activator" label="จองถึงวันที่" v-model="data.selectData.dateStop" prepend-icon="event" readonly></v-text-field>
        <v-date-picker v-model="data.selectData.dateStop" scrollable actions>
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
        <v-text-field slot="activator" label="เวลาสิ้นสุด" v-model="data.selectData.timeStop" prepend-icon="access_time" readonly></v-text-field>
        <v-time-picker format="24hr" v-model="data.selectData.timeStop" actions>
          <template slot-scope="{ save, cancel }">
          <v-card-actions>
            <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
            <v-btn flat color="primary" @click="save">Save</v-btn>
          </v-card-actions>
        </template>
        </v-time-picker>
      </v-dialog>

      <v-text-field prepend-icon="people" name="input-1" label="จำนวนผู้เข้าใช้งาน" v-model="countPeople"></v-text-field>

      <div class="" v-if="testButton">
        select name = {{nameTypeItem}}
           <div v-for="name in nameTypeCanUse">
             <v-btn color="primary" @click="nameTypeItem = name">{{name}}</v-btn>
           </div>
           <v-btn color="primary" v-if="nameTypeItem !== null" @click="pushBookingData()">SUBMIT</v-btn>
      </div>
    </div>
  </div>
  <div class="" v-else>
       <h1>Booking  {{$route.params.item}} Success</h1>
       <h1>Plese close Page</h1>
  </div>


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
      testButton: false,
      nameTypeItem: null,
      bookingData: '',
      nameTypeCanUse: [],
      bookingSuccess: false
    }
  },
  mounted () {
    let vm = this
    this.$bindAsObject('items', firebase.database().ref('items').child(vm.$route.params.item), null, () => { delete this.items['.key'] })
  },
  methods: {
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
      let newData = {
        id: key,
        userID: this.$route.params.senderID,
        dateStart: this.data.selectData.dateStart,
        timeStart: this.data.selectData.timeStart,
        dateStop: this.data.selectData.dateStop,
        timeStop: this.data.selectData.timeStop,
        countPeople: this.countPeople,
        timeStamp: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm')
      }
      myRef.update(newData)
      console.log(key)
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
    }
  },
  watch: {
    data: {
      handler (val, oldVal) {
        if (Object.values(val.selectData).every(x => x !== null) && Object.values(val.modals).every(x => x === false)) {
          console.log('pass')
          this.checkNameTypeCanUse()
          this.testButton = true
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
