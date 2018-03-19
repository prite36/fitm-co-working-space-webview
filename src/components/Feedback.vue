<template>
  <div class="Feedback">
    <template>
      <v-parallax height="650" src="/static/doc-images/vbanner.jpg">
        <v-card color="grey lighten-4" flat>
          <v-card-text>
            <v-container fluid>
              <v-layout row >
                <v-flex xs12>
                  <div v-if="!feedbackSuccess">
                      <h3>Feedback {{$route.params.status}}</h3>
                      <v-alert type="warning"
                              :value="starValidate"
                              transition="scale-transition">
                              Please rate this feedback.
                      </v-alert>
                      <div class="nameFeedback">
                        Facebook Chatbot
                      </div>
                      <div class="star">
                        <star-rating v-model="chatbotRating"
                                     v-bind:increment='1'
                                     v-bind:star-size='27'
                                     v-bind:padding='3'
                                     v-bind:show-rating='false'>
                        </star-rating>
                      </div>

                      <div class="nameFeedback">
                        Device
                      </div>
                      <div class="star">
                        <star-rating v-model="deviceRating"
                                     v-bind:increment='1'
                                     v-bind:star-size='27'
                                     v-bind:padding='3'
                                     v-bind:show-rating='false'>
                        </star-rating>
                      </div>

                      <div class="nameFeedback">
                        Room
                      </div>
                      <div class="star">
                        <star-rating v-model="roomRating"
                                     v-bind:increment='1'
                                     v-bind:star-size='27'
                                     v-bind:padding='3'
                                     v-bind:show-rating='false'>
                        </star-rating>
                      </div>

                      <div class="nameFeedback">
                        Service
                      </div>
                      <div class="star">
                        <star-rating v-model="serviceRating"
                                     v-bind:increment='1'
                                     v-bind:star-size='27'
                                     v-bind:padding='3'
                                     v-bind:show-rating='false'>
                        </star-rating>
                      </div>
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
                  <div v-else>
                    <v-layout justify-space-around>
                      <v-icon color="success" x-large>done</v-icon>
                    </v-layout>
                    <h3>Feedback  {{$route.params.item}} success</h3><br>
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
import momenTime from 'moment-timezone'
import StarRating from 'vue-star-rating'
import axios from 'axios'
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
      feedbackSuccess: false
    }
  },
  components: {
    StarRating
  },
  methods: {
    validateBeforeSubmit () {
      this.submitClick = true
      if (!this.starValidate) {
        this.pushCommentData()
        this.feedbackSuccess = true
      } else {
        this.alert = true
      }
    },
    pushCommentData () {
      firebase.database().ref('comments/').push({
        chatbotRating: this.chatbotRating,
        deviceRating: this.deviceRating,
        roomRating: this.roomRating,
        serviceRating: this.serviceRating,
        comment: this.comment,
        timeStamp: momenTime().tz('Asia/Bangkok').format('YYYY-MM-DD HH:mm')
      })
    },
    postPost () {
      axios.post(`https://fitmcoworkingspace.me/feedback`, {
        body: {

        }
      })
      .then(response => {
        if (response.data === 'success') {
          this.feedbackSuccess = true
        }
      })
      .catch(error => {
        console.log(error)
      })
    }
  },
  created () {
  },
  mounted () {
  },
  watch: {
  },
  computed: {
    starValidate () {
      /*
        function นี้เอาไว้เช็ค โดยให้ผู้ใช้กด star บางตัว แล้วกดปุ่ม submit ถึงจะผ่าน
        (!this.submitClick ค่าเริ่มต้นเป็น false)
        - เปิดหน้าเว็บมาครั้งแรกเข้าเงื่อนไขเพราะ  !this.submitClick  = true
        - ไม่กด star แล้วกด submit ไม่เข้าเงื่อนไขเพราะ !this.submitClick  = false
        - ่กด star แล้วกด submit เข้าเงื่อนไขเพราะ  ตัวแปร Rating มีค่า
      */
      if (this.chatbotRating || this.deviceRating || this.roomRating || this.serviceRating || !this.submitClick) {
        return false  // ไม่แสดง alert
      } else return true  // แสดง alert  ก็ต่อเมื่อ กดปุ่ม submit แล้วไม่ได้เลือก star feedback เลย
    }
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
  float: left;
  width: 55%;
  /* border: 1px solid red; */
}
</style>
