<template>
<div class="Booking">
  Please Select {{$route.params.item}}
  <!-- /////////////////////////////////////////////////////// -->
  <div v-if="$route.params.item === 'device' && selectType === ''">
    <div class="" v-for="(item, key) in items">
      Type Item = {{key}}
      <div class="" v-for="(childItem, key) in item">
        <v-btn color="primary">{{key}}</v-btn>
      </div>
    </div>
  </div>
  <!-- /////////////////////////////////////////////////////// -->
  <div v-if="$route.params.item === 'meetingroom' && selectType === ''">
    <div class="" v-for="(item, key) in items">
      Type Room = {{key}}
      <v-btn color="primary" @click="selectType = key">{{key}}</v-btn>
    </div>
  </div>
  <!-- /////////////////////////////////////////////////////// -->
  <div class="page2" v-if="selectType !== ''">
    <v-dialog persistent v-model="modalDateStart" lazy full-width width="290px">
      <v-text-field slot="activator" label="วันที่เริ่มจอง" v-model="dateStart" prepend-icon="event" readonly></v-text-field>
      <v-date-picker v-model="dateStart" scrollable actions>
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
    <v-dialog persistent v-model="modalTimeStart" lazy full-width width="290px">
      <v-text-field slot="activator" label="เวลาที่เริ่มจอง" v-model="timeStart" prepend-icon="access_time" readonly></v-text-field>
      <v-time-picker format="24hr" v-model="timeStart" actions>
        <template slot-scope="{ save, cancel }">
          <v-card-actions>
            <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
            <v-btn flat color="primary" @click="save">Save</v-btn>
          </v-card-actions>
        </template>
      </v-time-picker>
    </v-dialog>
    <!-- /////////////////////////////////////////////////////// -->

    <v-dialog persistent v-model="modalDateEnd" lazy full-width width="290px">
      <v-text-field slot="activator" label="จองถึงวันที่" v-model="dateStop" prepend-icon="event" readonly></v-text-field>
      <v-date-picker v-model="dateStop" scrollable actions>
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
    <v-dialog persistent v-model="modalTimeStart" lazy full-width width="290px">
      <v-text-field slot="activator" label="เวลาสิ้นสุด" v-model="timeStop" prepend-icon="access_time" readonly></v-text-field>
      <v-time-picker format="24hr" v-model="timeStop" actions>
        <template slot-scope="{ save, cancel }">
        <v-card-actions>
          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
          <v-btn flat color="primary" @click="save">Save</v-btn>
        </v-card-actions>
      </template>
      </v-time-picker>
    </v-dialog>

    <v-text-field prepend-icon="people" name="input-1" label="จำนวนผู้เข้าใช้งาน" v-model="countPeople"></v-text-field>

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
      selectType: '',

      dateStart: null,
      modalDateStart: false,

      timeStart: null,
      modalTimeStart: false,

      dateEnd: null,
      modalDateStop: false,

      timeEnd: null,
      modalTimeStop: false,

      countPeople: ''
    }
  },
  mounted () {
    let vm = this
    this.$bindAsObject('items', vm.db.ref('items').child(vm.$route.params.item))
  },
  methods: {
    push () {
      this.$firebaseRefs.data.push({
        text: '55585'
      })
    },
    postPost () {
      axios.post(`https://fitmcoworkingspace.me/externalregister`, {
        body: {
          status: this.$route.params.status,
          senderID: this.$route.params.senderID,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phoneNumber: this.phoneNumber,
          birtday: this.birtday,
          gender: this.gender
        }
      })
      .then(response => {
        if (response.data === 'success') {
          this.regSuccess = true
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
