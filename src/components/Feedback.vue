<template>
<div class="feedback">
  <v-tabs dark grow>
    <v-toolbar color="primary" dark>
      <v-btn icon>
        <v-icon small>computer</v-icon>
      </v-btn>
      Feedback
      <v-spacer></v-spacer>
    </v-toolbar>
  </v-tabs>
    <v-card color="grey lighten-4" flat v-loading.fullscreen.lock= "loadingPage">
      <div v-if="mainPage === 'content'">
        <v-alert type="warning" :value="starValidate" transition="scale-transition">
          Please rate this feedback.
        </v-alert>
        <v-container>
          <v-layout>
            <v-flex xs12>
              <v-card flat color="grey lighten-4">Facebook Chatbot</v-card>
            </v-flex>
            <v-flex xs12>
              <star-rating v-model="chatbotRating" v-bind:increment='1' v-bind:star-size='27' v-bind:padding='3' v-bind:show-rating='false'>
              </star-rating>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-card flat color="grey lighten-4">Devices</v-card>
            </v-flex>
            <v-flex xs12>
              <star-rating v-model="deviceRating" v-bind:increment='1' v-bind:star-size='27' v-bind:padding='3' v-bind:show-rating='false'>
              </star-rating>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-card flat color="grey lighten-4">Rooms</v-card>
            </v-flex>
            <v-flex xs12>
              <star-rating v-model="roomRating" v-bind:increment='1' v-bind:star-size='27' v-bind:padding='3' v-bind:show-rating='false'>
              </star-rating>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex xs12>
              <v-card flat color="grey lighten-4">Service</v-card>
            </v-flex>
            <v-flex xs12>
              <star-rating v-model="serviceRating" v-bind:increment='1' v-bind:star-size='27' v-bind:padding='3' v-bind:show-rating='false'>
              </star-rating>
            </v-flex>
          </v-layout>
        </v-container>


        Add a comment about the quality of support you received (optional)
        <v-text-field name="input" class="comments" label="Comment" multi-line rows="3" v-model="comment">
        </v-text-field>
        <br><br>
        <v-btn color="primary" @click="validateBeforeSubmit()">Submit</v-btn>
        <br><br>
      </div>
      <div class="divalert" v-if="mainPage === 'success'">
        <v-layout justify-space-around>
          <v-icon color="success" x-large>done</v-icon>
        </v-layout>
        <h3>Thank you for feedback. We will improve this.</h3><br>
      </div>
      <div class="divalert" v-if="mainPage === 'error404'">
        <v-layout justify-space-around>
          <v-icon color="red darken-1" x-large>error</v-icon>
        </v-layout>
        <h2>Error 404<br>
                  Page Not Found</h2>
      </div>
    </v-card>
    <br>
</div>
</template>

<script>
import firebase from 'firebase'
import momenTime from 'moment-timezone'
import StarRating from 'vue-star-rating'
export default {
  name: 'Feedback',
  data () {
    return {
      chatbotRating: 0,
      deviceRating: 0,
      roomRating: 0,
      serviceRating: 0,
      comment: '',
      submitClick: false,
      loadingPage: true,
      mainPage: 'loading',
      threadContext: null
    }
  },
  components: {
    StarRating
  },
  props: ['appID'],
  methods: {
    validateBeforeSubmit () {
      this.submitClick = true
      if (!this.starValidate) {
        // Validate ผ่านแล้ว ให้ screen ขึ้น loading
        this.loadingPage = true
        this.pushCommentData()
      } else {
        this.alert = true
      }
    },
    pushCommentData () {
      firebase.database().ref('feedbacks/').push({
        chatbotRating: this.chatbotRating,
        deviceRating: this.deviceRating,
        roomRating: this.roomRating,
        serviceRating: this.serviceRating,
        comment: this.comment,
        timeStamp: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm')
      }, (err) => {
        if (!err) this.closeWeb()
      })
    },
    closeWeb () {
      this.loadingPage = false
      this.mainPage = 'success'
      setTimeout(() => {
        MessengerExtensions.requestCloseBrowser(() => { //eslint-disable-line
        }, (err) => {
          console.error(err)
        })
      }, 1500)
    }
  },
  computed: {
    /*
      function นี้เอาไว้เช็ค โดยให้ผู้ใช้กด star บางตัว แล้วกดปุ่ม submit ถึงจะผ่าน
      (!this.submitClick ค่าเริ่มต้นเป็น false)
      - เปิดหน้าเว็บมาครั้งแรกเข้าเงื่อนไขเพราะ  !this.submitClick  = true
      - ไม่กด star แล้วกด submit ไม่เข้าเงื่อนไขเพราะ !this.submitClick  = false
      - ่กด star แล้วกด submit เข้าเงื่อนไขเพราะ  ตัวแปร Rating มีค่า
    */
    starValidate () {
      if (this.chatbotRating || this.deviceRating || this.roomRating || this.serviceRating || !this.submitClick) {
        return false  // ไม่แสดง alert
      } else return true  // แสดง alert  ก็ต่อเมื่อ กดปุ่ม submit แล้วไม่ได้เลือก star feedback เลย
    }
  },
  created () {
  },
  mounted () {
    var vm = this
    window.extAsyncInit = function () {
    MessengerExtensions.getContext(vm.appID, //eslint-disable-line
      function success (threadContext) {
        vm.threadContext = threadContext
        vm.loadingPage = false
        vm.mainPage = 'content'
      },
      function error (err) {
        vm.threadContext = err
        vm.loadingPage = false
        vm.mainPage = 'error404'
      })
    }
    // // fake data
    // this.loadingPage = false
    // this.mainPage = 'content'
    // this.threadContext = {tid: '1411911565515632'}
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.feedback {
  background-color: #F5F5F5;
}
.divalert {
  padding-top: 20%;
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
.star {
  text-align:center;
  /* border: 1px solid red; */
}
.comments {
  margin-left: 5%;
  padding-right: 10%;
}
</style>
