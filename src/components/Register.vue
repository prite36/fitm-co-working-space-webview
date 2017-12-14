<template>
  <div class="Register">
    <form @submit.prevent="validateBeforeSubmit">
      <div class="field" v-if="!regSuccess">
        <p class="control has-icon has-icon-right">
          <label class="label">First Name</label>
          <input class="input" type="text" v-model="firstName" name="first_name"  v-validate="'required|alpha'" :class="{'input': true, 'is-danger': errors.has('first_name') }" placeholder="First Name">
          <span v-show="errors.has('first_name')" class="help is-danger">{{ errors.first('first_name') }}</span>
        </p>
        <br><br>
        <p class="control has-icon has-icon-right">
          <label class="label">Last Name</label>
          <input class="input" type="text" v-model="lastName" name="last_name"  v-validate="'required|alpha'" :class="{'input': true, 'is-danger': errors.has('last_name') }" placeholder="Last Name">
          <span v-show="errors.has('last_name')" class="help is-danger">{{ errors.first('last_name') }}</span>
        </p>
        <br><br>
        <label class="label">Email</label>
         <p :class="{ 'control': true }">
           <input v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }" name="email" type="text" placeholder="example@mail.com" v-model="email" >
           <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
         </p>
        <br><br>
        <p class="control has-icon has-icon-right">
          <label class="label">Phone Number</label>
          <input class="input" type="text" v-model="phoneNumber" name="phone_number"  v-validate="'required|numeric'" :class="{'input': true, 'is-danger': errors.has('phone_number') }" placeholder="Phone Number">
          <span v-show="errors.has('phone_number')" class="help is-danger">{{ errors.first('phone_number') }}</span>
        </p>
        <br><br>
        <label class="label">Birth Day</label>
        <input class="input" type="date" placeholder="" v-model="birtday" >
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
          <button class="button is-link" >Submit</button>
        <!-- <button class="button is-link" @click="postPost()">Submit</button> -->
        </center>
      </div>

    <div class="" v-else>
         <h1>Register Success</h1>
         <h1>Plese close Page</h1>
    </div>
    </form>
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
      regSuccess: false,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      birtday: '',
      gender: ''
    }
  },
  mounted () {
    let that = this
    firebase.database().ref('/').once('value', snapshot => {
      that.data = snapshot.val()
    })
  },
  methods: {
    validateBeforeSubmit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          // eslint-disable-next-line
          alert('From Submitted!')
          return
        }
        alert('Correct them errors!')
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
