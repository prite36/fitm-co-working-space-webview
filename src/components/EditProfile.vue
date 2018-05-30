<template>
  <div class="editProfile">
    <v-tabs dark grow>
      <v-toolbar color="primary" dark>
        <v-btn icon>
          <v-icon small>create</v-icon>
        </v-btn>
        edit profile
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-tabs>
    <v-card color="grey lighten-4" flat v-loading.fullscreen.lock= "loadingPage">
      <v-card-text>
        <v-container fluid>
          <v-layout row>
            <v-flex xs12>
              <div v-if="mainPage === 'content'">
                <form @submit.prevent="validateBeforeSubmit">
                  <h3>Edit Profile</h3>
                  <v-text-field
                    :error-messages="errors.collect('first_name')"
                    label="First Name"
                    v-model="firstName"
                    prepend-icon="account_box"
                    name="first_name"
                    v-validate="'required|alpha'"
                  ></v-text-field>
                  <v-text-field
                    label="Last Name"
                    v-model="lastName"
                    prepend-icon="account_circle"
                    name="last_name"
                    :error-messages="errors.collect('last_name')"
                    v-validate="'required|alpha'"
                  ></v-text-field>
                  <v-text-field
                    label="Phone Number"
                    Pre-made="phone"
                    v-model="phoneNumber"
                    prepend-icon="contact_phone"
                    name="phone_number"
                    v-validate="'required|numeric'"
                    :error-messages="errors.collect('phone_number')"
                  ></v-text-field>
                  <v-dialog persistent v-model="modaldate" lazy full-width width="290px">
                    <v-text-field
                      slot="activator"
                      label="Date Of Birth"
                      v-model="dateOfBirth"
                      prepend-icon="event"
                      readonly
                      name="birth_day"
                      v-validate="'required'"
                      :error-messages="errors.collect('birth_day')"
                    ></v-text-field>
                    <v-date-picker v-model="dateOfBirth" scrollable actions>
                      <template slot-scope="{ save, cancel }">
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                          <v-btn flat color="primary" @click="save">OK</v-btn>
                        </v-card-actions>
                      </template>
                    </v-date-picker>
                  </v-dialog>
                  <v-radio-group
                  v-model="gender"
                  name="gender"
                  v-validate="'required'"
                  label="Select Gender"
                  :error-messages="errors.collect('gender')">
                    <br>
                    <v-radio label="Male"
                      value="male"
                      color="success"
                    ></v-radio>
                    <v-radio label="Female"
                      value="female"
                    ></v-radio>
                  </v-radio-group>
                  <v-btn  block color="primary" @click="validateBeforeSubmit()">Submit</v-btn>
                </form>
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
  </div>
</template>

<script>
import firebase from 'firebase' // eslint-disable-line
import { Validator } from 'vee-validate' // eslint-disable-line
import axios from 'axios'
export default {
  name: 'EditProfile',
  data () {
    return {
      loadingPage: true,
      mainPage: '',
      threadContext: null,
      userProfile: null,
      modaldate: false,
      firstName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
      dateOfBirth: null,
      gender: null
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
          this.$firebaseRefs.userProfile.set({
            firstName: this.firstName,
            lastName: this.lastName,
            phoneNumber: this.phoneNumber,
            dateOfBirth: this.dateOfBirth,
            gender: this.gender
          })
          this.loadingPage = true
          this.postPost()
        }
      })
    },
    closeWeb (delay) {
      this.loadingPage = false
      setTimeout(() => {
        MessengerExtensions.requestCloseBrowser() //eslint-disable-line
      }, delay)
    },
    postPost () {
      axios.post(`https://fitmcoworkingspace.me/editProfile`, {
        body: {
          senderID: this.threadContext.tid
        }
      })
      .then(response => {
        if (response.data === 'success') {
          this.closeWeb(0)
        }
      })
      .catch(error => {
        console.error(error)
      })
    }
  },
  created () {
  },
  beforeMount () {
    // var vm = this
    // window.extAsyncInit = function () {
    //   MessengerExtensions.getContext(vm.appID, //eslint-disable-line
    //   function success (threadContext) {
    //     vm.threadContext = threadContext
    //     vm.loadingPage = false
    //     vm.mainPage = 'content'
    //     getUserProfile(threadContext.tid)
    //   },
    //   function error (err) {
    //     vm.threadContext = err
    //     vm.loadingPage = false
    //     vm.mainPage = 'error404'
    //   })
    // }
    let getUserProfile = (userID) => {
      this.$bindAsObject('userProfile', firebase.database().ref('profile').child('guest').child(userID), null, () => {
        this.firstName = this.userProfile.firstName
        this.lastName = this.userProfile.lastName
        this.phoneNumber = this.userProfile.phoneNumber
        this.dateOfBirth = this.userProfile.dateOfBirth
        this.gender = this.userProfile.gender
      })
    }
    // fake data
    this.loadingPage = false
    this.mainPage = 'content'
    this.threadContext = {tid: '1411911565515632'}
    getUserProfile(this.threadContext.tid)
  },
  mounted () {
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editProfile {
  background-color: #F5F5F5;
}
#inspire {
  padding-top: 3%;
}
.field {
  margin-left: 2%;
  margin-right: 2%;
}
.label {
  font-size: 16px;
  text-align: left;
}
.registed {
  padding-top: 30%;
}
</style>
