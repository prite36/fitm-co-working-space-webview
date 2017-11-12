<template>
  <div class="hello">
    <div class="field">
      <label class="label">First Name</label>
      <input class="input" type="text" v-model="firstName" required>
      <br><br>
      <label class="label">Last Name</label>
      <input class="input" type="text" v-model="lastName" required>
      <br><br>
      <label class="label">Email</label>
      <input class="input" type="text" placeholder="example@mail.com" v-model="email" required>
      <br><br>
      <label class="label">Phone Number</label>
      <input class="input" type="text" placeholder="089999xxxx" v-model="phoneNumber" required>
      <br><br>
      <label class="label">Birth Day</label>
      <input class="input" type="date" placeholder="" v-model="birtday" required>
      <br><br>
      <label class="label">Gender</label>
      <div class="field">
        <div class="control">
          <label class="radio">
            <input type="radio" v-model="gender" value="male">
            male
          </label>
          <label class="radio">
            <input type="radio" v-model="gender" value="female">
            female
          </label>
        </div>
      </div>
      <center>
      <button class="button is-link" @click="postPost()">Submit</button>
      </center>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import axios from 'axios'
var config = {
  apiKey: 'AIzaSyAE2rQQye4hlRpDqAWirvyaaCExiaWA8DY',
  authDomain: 'fitm-coworkingspace.firebaseapp.com',
  databaseURL: 'https://fitm-coworkingspace.firebaseio.com',
  projectId: 'fitm-coworkingspace',
  storageBucket: 'fitm-coworkingspace.appspot.com',
  messagingSenderId: '181239315787'
}
firebase.initializeApp(config)
// var db = firebase.database()
export default {
  name: 'Register',
  data () {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      birtday: '',
      gender: ''
    }
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
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field {
  margin-left: 2%;
  margin-right: 2%;
}
.label {
  font-size: 16px;
  text-align: left;
}
</style>
