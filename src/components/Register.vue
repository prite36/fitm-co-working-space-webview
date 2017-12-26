<template>
  <div class="Register">
    <template>
      <v-parallax height="650" src="/static/doc-images/vbanner.jpg">
        <v-card color="grey lighten-4" flat>
          <v-card-text>
            <v-container fluid>
              <v-layout row>
                <v-flex xs12>
                  <div v-if="!regSuccess">
                    <form @submit.prevent="validateBeforeSubmit">
                      <h3>Register</h3>
                      <v-text-field
                        :error-messages="errors.collect('first_name')"
                        label="First name"
                        v-model="firstName"
                        prepend-icon="account_box"
                        name="first_name"
                        v-validate="'required|alpha'"
                      ></v-text-field>
                      <v-text-field
                        label="Last name"
                        v-model="lastName"
                        prepend-icon="account_circle"
                        name="last_name"
                        :error-messages="errors.collect('last_name')"
                        v-validate="'required|alpha'"
                      ></v-text-field>
                      <v-text-field
                        label="email"
                        v-model="email"
                        prepend-icon="email"
                        v-validate="'required|email|unique'"
                        :error-messages="errors.collect('email')"
                        name="email"
                      ></v-text-field>
                      <v-text-field
                        label="Phone number"
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
                          label="Change date in dialog"
                          v-model="birthday"
                          prepend-icon="event"
                          readonly
                          name="birth_day"
                          v-validate="'required'"
                          :error-messages="errors.collect('birth_day')"
                        ></v-text-field>
                        <v-date-picker v-model="birthday" scrollable actions>
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
                      label="Select gender"
                      :error-messages="errors.collect('gender')">
                        <br>
                        <v-radio label="male"
                          value="male"
                          color="success"
                        ></v-radio>
                        <v-radio label="female"
                          value="female"
                        ></v-radio>
                      </v-radio-group>
                      <v-btn  block color="primary" @click="validateBeforeSubmit()">Submit</v-btn>
                    </form>
                  </div>
                  <div v-else>
                    <v-layout justify-space-around>
                      <v-icon color="success" x-large>done</v-icon>
                    </v-layout>
                    <h3>Register  {{$route.params.item}} success</h3><br>
                    <h3>Please close page</h3>
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
      modaldate: false,
      allProfile: '',
      allState: '',
      emailsDB: [],
      regSuccess: false,
      firstName: null,
      lastName: null,
      email: null,
      phoneNumber: null,
      birthday: null,
      gender: null
    }
  },
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
          senderID: this.$route.params.senderID,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          phoneNumber: this.phoneNumber,
          birtday: this.birthday,
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
    },
    getData () {
      this.$bindAsObject('allProfile', firebase.database().ref('profile'), null)
      this.$bindAsObject('allState', firebase.database().ref('state'), null)
    }
  },
  created () {
    // ดึงข้อมูล profile 1 ครั้ง
    this.getData()
    // เช็ค Email
    const isUnique = value => new Promise((resolve) => {
      setTimeout(() => {
        if (this.emailsDB.indexOf(value) === -1) {
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
  },
  watch: {
    allProfile () {
      delete this.allProfile['.key']
      // ดึงแค่ email เก็บใน emailsDB
      for (let status in this.allProfile) {
        for (let id in this.allProfile[status]) {
          this.emailsDB.push(this.allProfile[status][id].email)
        }
      }
    },
    allState () {
      delete this.allState['.key']
      // ดึงแค่ email เก็บใน emailsDB
      for (let id in this.allState) {
        // ถ้า id นั้นเป็น object ที่มี   data:
        if (this.allState[id].data) {
          this.emailsDB.push(this.allState[id].data.email)
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
