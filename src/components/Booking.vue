<template>
<div class="Booking">
  Please Select {{$route.params.item}}
  <!-- /////////////////////////////////////////////////////// -->
  <!-- <div v-if="$route.params.item === 'device' && data.selectData.selectType === null">
    <div class="" v-for="(item, key) in items">
      Type Item = {{key}}
      <div class="" v-for="(childItem, key) in item">
        <v-btn color="primary">{{key}}</v-btn>
      </div>
    </div>
  </div> -->
  <!-- /////////////////////////////////////////////////////// -->
  <v-btn color="primary" @click="test()">test</v-btn>
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
         <v-btn color="primary" @click="nameTypeItem = 'mediumroom1'">mediumroom1</v-btn>
         <v-btn color="primary" @click="nameTypeItem = 'mediumroom2'">mediumroom2</v-btn>

         <v-btn color="primary" @click="pushBookingData()">SUBMIT</v-btn>
    </div>
  </div>


</div>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
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
      nameTypeItem: null
    }
  },
  mounted () {
    let vm = this
    this.$bindAsObject('items', firebase.database().ref('items').child(vm.$route.params.item))
  },
  methods: {
    sendto (value, value2) {
      if (value) {

      }
    },
    // push () {
    //   this.$firebaseRefs.data.push({
    //     text: '55585'
    //   })
    // },
    postPost () {
      axios.post(`https://fitmcoworkingspace.me/searchBooking`, {
        body: {
          userID: this.$route.params.senderID,
          item: this.$route.params.item,
          typeItem: this.data.selectData.selectType,
          dateStart: this.data.selectData.dateStart,
          timeStart: this.data.selectData.timeStart,
          dateStop: this.data.selectData.dateStop,
          timeStop: this.data.selectData.timeStop
        }
      })
      .then(response => {
        if (response.data === 'recivebooking') {
          console.log(response.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
    },
    pushBookingData () {
      firebase.database().ref('booking/').child(this.$route.params.item).child(this.data.selectData.selectType).child(this.nameTypeItem).push({
        senderID: this.$route.params.item,
        selectType: this.data.selectData.selectType,
        dateStart: this.data.selectData.dateStart,
        timeStart: this.data.selectData.timeStart,
        dateStop: this.data.selectData.dateStop,
        timeStop: this.data.selectData.timeStop,
        countPeople: this.countPeople
      })
    }
  },
  watch: {
    items: function () {
      delete this.items['.key']
    },
    data: {
      handler (val, oldVal) {
        if (Object.values(val.selectData).every(x => x !== null) && Object.values(val.modals).every(x => x === false)) {
          console.log('pass')
          // this.postPost()
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
