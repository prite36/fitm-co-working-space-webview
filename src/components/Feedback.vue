<template>
  <div class="Feedback">
    <template>
      <v-parallax height="650" src="/static/doc-images/vbanner.jpg" v-loading.fullscreen.lock= "loadingPage" >
        <v-card color="grey lighten-4" flat>
          <v-card-text>
            <v-container fluid>
              <v-layout row >
                <v-flex xs12>
                  <div v-if="mainPage === 'content'">
                      <h3>Feedback{{$route.params.status}}</h3>
                      <v-alert type="warning"
                              :value="starValidate"
                              transition="scale-transition">
                              Please rate this feedback.
                      </v-alert>
                      <v-container grid-list-ms text-xs-center >
                        <v-layout row wrap >
                          <v-flex xs12 flat align-center="true">
                            <v-card flat>Facebook Chatbot</v-card>
                            <v-card flat>
                              <star-rating  v-model="chatbotRating"
                                            v-bind:increment='1'
                                            v-bind:star-size='27'
                                            v-bind:padding='3'
                                            v-bind:show-rating='false'>
                              </star-rating>
                            </v-card>
                          </v-flex>

                          <v-flex xs12 flat>
                            <v-card flat>Devices</v-card>
                            <v-card flat>
                              <star-rating  v-model="deviceRating"
                                            v-bind:increment='1'
                                            v-bind:star-size='27'
                                            v-bind:padding='3'
                                            v-bind:show-rating='false'>
                              </star-rating>
                            </v-card>
                          </v-flex>

                          <v-flex xs12 flat align-center="true">
                            <v-card flat>Rooms</v-card>
                            <v-card flat>
                              <center><star-rating v-model="roomRating"
                                           v-bind:increment='1'
                                           v-bind:star-size='27'
                                           v-bind:padding='3'
                                           v-bind:show-rating='false'>
                              </star-rating></center>
                            </v-card>
                          </v-flex>

                          <v-flex xs12 flat align-center="true">
                            <v-card flat>Service</v-card>
                            <v-card flat>
                              <star-rating v-model="serviceRating"
                                           v-bind:increment='1'
                                           v-bind:star-size='27'
                                           v-bind:padding='3'
                                           v-bind:show-rating='false'>
                              </star-rating>
                            </v-card>
                          </v-flex>

                        </v-layout>
                      </v-container>


                      Add a comment about the quality of support you received (optional)
                      <v-text-field name="input"
                                    label="Comment"
                                    multi-line
                                    rows="3"
                                    v-model="comment">
                      </v-text-field>

                      <br><br>
                      <v-btn  block color="primary" @click="validateBeforeSubmit()">Submit</v-btn>
                  </div>
                  <div v-if="mainPage === 'success'">
                    <v-layout justify-space-around>
                      <v-icon color="success" x-large>done</v-icon>
                    </v-layout>
                    <h3>Thank you for feedback. We will improve this.</h3><br>
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
      </v-parallax>
    </template>
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
      feedbackSuccess: false,
      threadContext: null
    }
  },
  components: {
    StarRating
  },
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
    // window.extAsyncInit = function () {}
    var vm = this
    window.extAsyncInit = function () {
    MessengerExtensions.getContext('170341890182672', //eslint-disable-line
    function success (threadContext) {
      vm.threadContext = threadContext
      vm.loadingPage = false
      vm.mainPage = 'content'
    },
    function error (err) {
      vm.threadContext = err
      vm.loadingPage = false
      vm.mainPage = 'error404'

      // // fake data
      // console.error(err)
      // vm.loadingPage = false
      // vm.mainPage = 'content'
      // vm.threadContext = {tid: '1411911565515632'}
    })
    }
  },
  watch: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.Feedback {
  padding-top: 5%;
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
.nameFeedback {
  float: left;
  width: 45%;
  /* border: 1px solid black; */
  padding: 5px 0px 5px 0px
}
.star {
  text-align:center;
  /* border: 1px solid red; */
}
</style>
