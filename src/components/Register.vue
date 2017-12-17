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
         <p :class="{ 'control': true }">
           <label class="label">Email</label>
           <input v-validate="'required|email|unique'" :class="{'input': true, 'is-danger': errors.has('email') }" name="email" type="text" placeholder="example@mail.com" v-model="email" >
           <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
         </p>
        <br><br>
        <p class="control has-icon has-icon-right">
          <label class="label">Phone Number</label>
          <input class="input" type="text" v-model="phoneNumber" name="phone_number"  v-validate="'required|numeric'" :class="{'input': true, 'is-danger': errors.has('phone_number') }" placeholder="Phone Number">
          <span v-show="errors.has('phone_number')" class="help is-danger">{{ errors.first('phone_number') }}</span>
        </p>
        <br><br>
        <p class="control has-icon has-icon-right">
          <label class="label">Birth Day</label>
          <input class="input" type="date"  v-model="birtday" name="birth_day" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has('birth_day') }" placeholder="DD/MM/YYYY">
          <span v-show="errors.has('birth_day')" class="help is-danger">{{ errors.first('birth_day') }}</span>
        </p>
        <br><br>
          <p class="control">
            <label class="radio">
              <input name="radio_group_1" type="radio" v-model="gender" v-validate="'required'" value="male">
              male
            </label>
            <label class="radio">
              <input name="radio_group_1" type="radio" v-model="gender" value="female">
              female
            </label>
            <span v-show="errors.has('radio_group_1')" class="help is-danger">{{ errors.first('radio_group_1') }}</span>
          </p>
        <center>
          <button class="button is-link" >Submit</button>
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
import { Validator } from 'vee-validate'
import axios from 'axios'
export default {
  name: 'Register',
  data () {
    return {
      allProfile: '',
      allState: '',
      emailsDB: [],
      regSuccess: false,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      birtday: '',
      gender: ''
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
.field {
  margin-left: 2%;
  margin-right: 2%;
}
.label {
  font-size: 16px;
  text-align: left;
}
</style>
