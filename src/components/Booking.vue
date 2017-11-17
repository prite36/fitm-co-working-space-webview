<template>
  <div class="Booking">
    <v-layout row wrap>
     <v-spacer></v-spacer>
     <v-flex xs11 sm5>
       <v-dialog
         persistent
         v-model="modal2"
         lazy
         full-width
         width="290px"
       >
         <v-text-field
           slot="activator"
           label="Picker in dialog"
           v-model="time"
           prepend-icon="access_time"
           readonly
         ></v-text-field>
         <v-time-picker v-model="time" format="24hr" actions>
           <template slot-scope="{ save, cancel }">
             <v-card-actions>
               <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
               <v-btn flat color="primary" @click="save">Save</v-btn>
             </v-card-actions>
           </template>
         </v-time-picker>
       </v-dialog>
     </v-flex>
   </v-layout>
  </div>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
export default {
  name: 'Register',
  data () {
    return {
      data: '',
      time: null,
      menu2: false,
      modal2: false
    }
  },
  mounted () {
    let that = this
    firebase.database().ref('/').once('value', snapshot => {
      that.data = snapshot.val()
    })
  },
  methods: {
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
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
.field {
  margin-left: 2%;
  margin-right: 2%;
}
.label {
  font-size: 16px;
  text-align: left;
}
</style>
