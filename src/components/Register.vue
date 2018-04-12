<template>
  <div class="Register">
    <template>
      <v-parallax height="650" src="/static/doc-images/vbanner.jpg" v-loading.fullscreen.lock= "loadingPage">
        <v-card color="grey lighten-4" flat>
          <v-card-text>
            <v-container fluid>
              <v-layout row>
                <v-flex xs12>
                  <div v-if="mainPage === 'content'">
                    <form @submit.prevent="validateBeforeSubmit">
                      <h3>Register {{$route.params.status}}</h3>
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
                        label="Email"
                        v-model="email"
                        prepend-icon="email"
                        v-validate="'required|email|unique'"
                        :error-messages="errors.collect('email')"
                        name="email"
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
                      Test{{testData}}
                    </form>
                  </div>
                  <div v-if="mainPage === 'error404'">
                    <h1>Error 404<br>
                    Page Not Found</h1>
                    {{threadContext}}
                  </div>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <br>
        </v-card>
      </v-parallax>
    </template>
  </div>
</template>

<script>
import firebase from 'firebase'
import { Validator } from 'vee-validate'
import axios from 'axios'
export default {
  name: 'Register',
  data () {
    return {
      loadingPage: true,
      mainPage: '',
      threadContext: null,
      modaldate: false,
      allProfile: '',
      allState: '',
      userID_DB: [],
      emails_DB: [],
      firstName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
      dateOfBirth: null,
      gender: null,
      testData: null
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
          this.postPost()
        }
      })
    },
    postPost () {
      axios.post(`https://fitmcoworkingspace.me/externalregister`, {
        body: {
          status: this.$route.params.status,
          senderID: this.threadContext.tid,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phoneNumber: this.phoneNumber,
          dateOfBirth: this.dateOfBirth,
          gender: this.gender
        }
      })
      .then(response => {
        if (response.data === 'success') {
          this.closeWeb()
        }
      })
      .catch(error => {
        console.error(error)
      })
    },
    closeWeb () {
      this.loadingPage = false
      MessengerExtensions.requestCloseBrowser(() => { //eslint-disable-line
      }, (err) => {
        console.error(err)
      })
    },
    Re_registerCheck () {
      // เอา tid จาก FB เช็คใน allState ว่า User คนนี้เคยสมัคสมาชิกแล้วหรือยัง
      // ถ้า id ตรงกัน คืนค่า true
      let findID = this.userID_DB.includes(this.threadContext[0].tid)
      // ถ้า check = true หมาายความว่า User เคยสมัครสมาชิกไปแล้ว
      if (findID) {
        this.loadingPage = false
        this.mainPage = 'content'
        this.testData = 'You registered'
      } else {
        this.loadingPage = false
        this.mainPage = 'content'
        this.testData = 'No Re_register' + this.threadContext[0].tid
      }
    },
    getDataAndSDK () {
      this.$bindAsObject('allState', firebase.database().ref('state'), null)
      let getAllProfile = new Promise(resolve => {
        this.$bindAsObject('allProfile', firebase.database().ref('profile'), null, () => {
          resolve()
        })
      })

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
      Promise.all([getSDK, getAllProfile]).then(values => {
        this.threadContext = values
        this.Re_registerCheck()
        console.log(values)
      }).catch(reason => {
        this.threadContext = 'error ' + reason
        this.loadingPage = false
        this.mainPage = 'error404'
        console.log(reason)
      })
    }
  },
  created () {
    // เช็ค Email
    const isUnique = value => new Promise((resolve) => {
      setTimeout(() => {
        if (this.emails_DB.indexOf(value) === -1) {
          return resolve({
            valid: true
          })
        }
        return resolve({
          valid: false,
          data: {
            message: `${value} is already taken.`
          }
        })
      }, 200)
    })
    Validator.extend('unique', {
      validate: isUnique,
      getMessage: (field, params, data) => data.message
    })
  },
  mounted () {
    this.getDataAndSDK()
  },
  watch: {
    allProfile () {
      delete this.allProfile['.key']
      // ดึงแค่ email เก็บใน emails_DB
      for (let status in this.allProfile) {
        for (let id in this.allProfile[status]) {
          this.userID_DB.push(id)
          this.emails_DB.push(this.allProfile[status][id].email)
        }
      }
    },
    allState () {
      delete this.allState['.key']
      // ดึงแค่ email เก็บใน emails_DB
      for (let id in this.allState) {
        // ถ้า id นั้นเป็น object ที่มี   data:
        if (this.allState[id].data) {
          this.emails_DB.push(this.allState[id].data.email)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
