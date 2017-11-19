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

    <v-text-field prepend-icon="people" name="input-1" label="จำนวนผู้เข้าใช้งาน" v-model="data.selectData.countPeople"></v-text-field>

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
      db: firebase.database(),
      items: '',
      data: {
        selectData: {
          selectType: null,
          dateStart: null,
          timeStart: null,
          dateStop: null,
          timeStop: null,
          countPeople: null
        },
        modals: {
          modalDateStart: false,
          modalTimeStart: false,
          modalDateStop: false,
          modalTimeStop: false
        }
      }
    }
  },
  mounted () {
    let vm = this
    this.$bindAsObject('items', vm.db.ref('items').child(vm.$route.params.item))
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
      axios.post(`https://fitmcoworkingspace.me/booking`, {
        body: {
          item: this.$route.params.item,
          senderID: this.$route.params.senderID,
          typeItem: this.data.selectData.selectType,
          dateStart: this.data.selectData.dateStart,
          timeStart: this.data.selectData.timeStart,
          dateStop: this.data.selectData.dateStop,
          timeStop: this.data.selectData.timeStop,
          countPeople: this.data.selectData.countPeople
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
          this.postPost()
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
